import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SurveyOptionApiService } from "@/components/services/SurveyOptionApiService";

export const EditOptionModal = ({ isOpen, data, onClose, onSuccess }: any) => {
  const [form, setForm] = useState({ text: data.option_text, weight: data.weightage });

  const handleSave = async () => {
    try {
      await SurveyOptionApiService.update(data.id, { 
          option_text: form.text, 
          weightage: form.weight,
          category_id: data.category_id 
      });
      onSuccess();
      onClose();
    } catch (err) { /* Toast error */ }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Option Scale</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-xs font-bold">LABEL</label>
            <Input value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold">WEIGHTAGE</label>
            <Input type="number" value={form.weight} onChange={(e) => setForm({...form, weight: parseFloat(e.target.value)})} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Update Option</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};