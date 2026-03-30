import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClassRangeApiService } from "@/components/services/AssessmentClassRangeApiService";

export const EditRangeModal = ({ isOpen, data, onClose, onSuccess }: any) => {
  const [form, setForm] = useState({
    label: data.label,
    min_score: data.min_score,
    max_score: data.max_score,
    recommendation: data.recommendation || ""
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ClassRangeApiService.update(data.id, {
        ...form,
        category_id: data.category_id
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit Score Range</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Interpretation Label</label>
            <Input value={form.label} onChange={(e) => setForm({...form, label: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Min Score</label>
              <Input type="number" value={form.min_score} onChange={(e) => setForm({...form, min_score: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Max Score</label>
              <Input type="number" value={form.max_score} onChange={(e) => setForm({...form, max_score: parseInt(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">Recommendation</label>
            <Textarea value={form.recommendation} onChange={(e) => setForm({...form, recommendation: e.target.value})} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Updating..." : "Save Range"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};