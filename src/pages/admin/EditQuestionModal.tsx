import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QuestionApiService } from "@/services/QuestionApiService";


export const EditQuestionModal = ({ isOpen, data, onClose, onSuccess }: any) => {
  const [text, setText] = useState(data.text);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await QuestionApiService.update(data.id, { ...data, text });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Question</DialogTitle></DialogHeader>
        <div className="py-4">
          <label className="text-xs font-bold text-slate-500 mb-2 block">QUESTION TEXT</label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};