import React, { useState, useEffect, useRef } from 'react';

const ClinicalIntake: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'speaking' | 'listening' | 'processing'>('idle');
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [feedback, setFeedback] = useState("");

    // Refs for stable logic across renders
    const socket = useRef<WebSocket | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const statusRef = useRef(status);

    // Sync statusRef so the loops always see the latest state
    useEffect(() => { statusRef.current = status; }, [status]);

    useEffect(() => {
        // Use 127.0.0.1 to avoid DNS lag/errors
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/interview`);
        
        ws.onopen = () => console.log("Connected to Backend");
        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.type === "TURN_COMPLETE") handleBackendResponse(response.data);
        };
        ws.onclose = () => setStatus('idle');
        socket.current = ws;

        // One-time Mic Setup
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(stream);
            analyser.current = audioCtx.createAnalyser();
            analyser.current.fftSize = 256;
            source.connect(analyser.current);
            
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
            mediaRecorder.current.onstop = async () => {
                if (audioChunks.current.length === 0) return;
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const buffer = await audioBlob.arrayBuffer();
                if (socket.current?.readyState === WebSocket.OPEN) {
                    socket.current.send(buffer);
                    setStatus('processing');
                }
                audioChunks.current = [];
            };
            monitorVolume(); // Start the infinite volume loop
        });

        return () => ws.close();
    }, []);

    const monitorVolume = () => {
        if (!analyser.current) return;
        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        analyser.current.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        if (statusRef.current === 'listening') {
            if (volume < 15) { // Threshold for silence
                if (!silenceTimer.current) {
                    silenceTimer.current = setTimeout(() => {
                        if (mediaRecorder.current?.state === "recording") {
                            mediaRecorder.current.stop();
                        }
                    }, 2500); // 2.5s pause
                }
            } else {
                if (silenceTimer.current) {
                    clearTimeout(silenceTimer.current);
                    silenceTimer.current = null;
                }
            }
        }
        requestAnimationFrame(monitorVolume);
    };

    const handleBackendResponse = (data: any) => {
        setFeedback(data.feedback_text);
        speakText(data.feedback_text, () => {
            if (data.next_question) {
                setCurrentQuestion(data.next_question);
                speakText(data.next_question.text, () => {
                    setStatus('listening');
                    mediaRecorder.current?.start();
                });
            } else {
                setStatus('idle');
            }
        });
    };

    const speakText = (text: string, onEnd: () => void) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        utter.onstart = () => setStatus('speaking');
        utter.onend = onEnd;
        synth.speak(utter);
    };

    return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold">{status.toUpperCase()}</h2>
            <p className="mt-4 text-lg">{currentQuestion?.text || "Ready to start?"}</p>
            {feedback && <p className="italic text-blue-500 mt-2">{feedback}</p>}
            <button 
                className="mt-8 px-6 py-2 bg-green-500 text-white rounded"
                onClick={() => { if (status === 'idle') setStatus('processing'); }} 
            >
                Start Assessment
            </button>
        </div>
    );
};

export default ClinicalIntake;