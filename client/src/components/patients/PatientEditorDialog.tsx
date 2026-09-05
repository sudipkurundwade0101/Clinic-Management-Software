import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { splitCsv } from "./utils";
import type { Patient } from "@/types/patient";

export function PatientEditorDialog({
  open,
  close,
  patient,
  onSave,
}: {
  open: boolean;
  close: () => void;
  patient?: Patient;
  onSave: (p: Patient) => void;
}) {
  const [form, setForm] = useState({
    name: patient?.name ?? "",
    age: String(patient?.age ?? ""),
    gender: patient?.gender ?? "",
    phone: patient?.phone ?? "",
    address: patient?.address ?? "",
    bloodGroup: patient?.bloodGroup ?? "",
    allergies: patient?.allergies.join(", ") ?? "",
    conditions: patient?.existingConditions.join(", ") ?? "",
    medications: patient?.currentMedications.join(", ") ?? "",
    emergency: patient?.emergencyContact ?? "",
  });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((x) => ({ ...x, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.name || !form.age || !form.gender || phoneDigits.length < 10) {
      setError("Please provide a name, valid age, gender, and 10-digit mobile number.");
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    onSave({
      id: patient?.id ?? `PAT-2026-${Date.now().toString().slice(-4)}`,
      name: form.name,
      age: +form.age,
      gender: form.gender as Patient["gender"],
      phone: phoneDigits,
      address: form.address || undefined,
      bloodGroup: form.bloodGroup || undefined,
      allergies: splitCsv(form.allergies),
      existingConditions: splitCsv(form.conditions),
      currentMedications: splitCsv(form.medications),
      emergencyContact: form.emergency || undefined,
      status: patient?.status ?? "Active",
      createdAt: patient?.createdAt ?? now,
      updatedAt: now,
      lastVisit: patient?.lastVisit,
    });
    close();
  };

  const fields: [keyof typeof form, string][] = [
    ["name", "Full name *"],
    ["age", "Age *"],
    ["gender", "Gender (Male / Female / Other) *"],
    ["phone", "Mobile number * (10 digits)"],
    ["bloodGroup", "Blood group"],
    ["emergency", "Emergency contact"],
    ["allergies", "Allergies (comma separated)"],
    ["conditions", "Existing conditions (comma separated)"],
    ["medications", "Current medications (comma separated)"],
  ];

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit Patient" : "Add Patient"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <p className="text-xs text-muted-foreground">Fields marked * are required.</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                <Input value={form[key]} onChange={(e) => set(key, e.target.value)} />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">{patient ? "Save changes" : "Add patient"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
