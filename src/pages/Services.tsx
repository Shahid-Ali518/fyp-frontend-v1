import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Heart,
  BarChart3,
  MessageCircle,
  Shield,
  Smile,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import servicesAi from "@/assets/services-ai.jpg";

const services = [
  {
    icon: Brain,
    title: "AI Mental Health Assessment",
    description:
      "Our AI conducts comprehensive mental health screenings using validated psychological frameworks like PHQ-9, GAD-7, and custom deep-learning models to detect early signs of anxiety, depression, and stress.",
    features: ["PHQ-9 & GAD-7 Screening", "Personalized Risk Analysis", "Actionable Recommendations", "Progress Tracking"],
  },
  {
    icon: Heart,
    title: "Emotion Analysis Engine",
    description:
      "Advanced NLP and sentiment analysis detect emotions in real-time through text input. Our models identify nuanced emotional states including mixed emotions, emotional intensity, and emotional triggers.",
    features: ["Real-time Sentiment Detection", "Multi-emotion Classification", "Emotional Trigger Identification", "Contextual Analysis"],
  },
  {
    icon: BarChart3,
    title: "Mood Tracking & Insights",
    description:
      "Visual dashboards and analytics help you understand emotional patterns over time. Identify correlations between your mood, sleep, activities, and environmental factors.",
    features: ["Daily Mood Journals", "Trend Visualization", "Pattern Recognition", "Weekly/Monthly Reports"],
  },
  {
    icon: MessageCircle,
    title: "AI Therapy Companion",
    description:
      "A conversational AI trained in CBT and mindfulness techniques provides 24/7 emotional support, guided exercises, and coping strategies tailored to your needs.",
    features: ["24/7 Availability", "CBT-based Techniques", "Guided Meditation", "Crisis Resource Links"],
  },
  {
    icon: Smile,
    title: "Facial Expression Analysis",
    description:
      "Optional camera-based emotion detection analyzes facial micro-expressions to provide an additional layer of emotional assessment during sessions.",
    features: ["Micro-expression Detection", "Real-time Feedback", "Privacy-first Processing", "Session Summaries"],
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "End-to-end encryption, HIPAA-compliant infrastructure, and zero-knowledge architecture ensure your most sensitive data remains completely private.",
    features: ["End-to-End Encryption", "HIPAA Compliant", "Data Anonymization", "User-controlled Deletion"],
  },
];

const Services = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-bg section-padding py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-coral font-medium text-sm uppercase tracking-wider">Our Services</span>
            <h1 className="text-4xl md:text-5xl text-foreground leading-tight">
              Comprehensive AI-Powered Mental Health Solutions
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              From emotion analysis to personalized assessments, our suite of AI tools helps you
              understand, monitor, and improve your mental wellbeing.
            </p>
            <Button variant="coral" size="lg" className="text-base px-8 py-6">
              Start Free Assessment
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src={servicesAi}
                alt="AI emotion analysis illustration"
                width={640}
                height={640}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding py-20">
        <div className="space-y-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-8 md:p-10 border border-border ${
                i % 2 === 0 ? "bg-card" : "bg-hero-bg"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-light flex items-center justify-center shrink-0">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
                <div className="space-y-3">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary rounded-3xl p-10 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl text-primary-foreground mb-4">
            Start Your Free Assessment Today
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8 leading-relaxed">
            Our AI-powered assessment takes just 5 minutes and provides personalized
            insights about your emotional wellbeing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="coral" size="lg" className="text-base px-10 py-6">
              Take Assessment
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Link to="/about">
              <Button variant="outline-hero" size="lg" className="text-base px-10 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn About Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Services;
