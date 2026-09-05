import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { initialPatients } from "@/data/patients";
import { consultationService } from "@/services/consultationService";
import type { Consultation } from "@/types/patient";

// ─── Helper components ──────────────────────────────────────────────────────

function Section({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ChipInput({
  label,
  chips,
  setChips,
  placeholder,
}: {
  label: string;
  chips: string[];
  setChips: (items: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const add = () => {
    const trimmed = value.trim();
    if (trimmed && !chips.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setChips([...chips, trimmed]);
    }
    setValue("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Badge key={chip} variant="secondary" className="gap-1 py-1 pl-3 pr-2">
              {chip}
              <button
                type="button"
                aria-label={`Remove ${chip}`}
                onClick={() => setChips(chips.filter((c) => c !== chip))}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}

function VitalsGrid({
  vitals,
  setVitals,
}: {
  vitals: Record<string, string>;
  setVitals: (v: Record<string, string>) => void;
}) {
  const fields: [string, string, string][] = [
    ["temperature", "Temperature", "°F"],
    ["bloodPressure", "Blood Pressure", "mmHg"],
    ["pulse", "Pulse Rate", "bpm"],
    ["spo2", "SpO2", "%"],
    ["weight", "Weight", "kg"],
    ["height", "Height", "cm"],
  ];
  const bmi = useMemo(() => {
    const w = Number(vitals.weight);
    const h = Number(vitals.height);
    return w && h ? (w / (h / 100) ** 2).toFixed(1) : "";
  }, [vitals.weight, vitals.height]);

  // Keep BMI in sync
  useEffect(() => {
    setVitals({ ...vitals, bmi });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmi]);

  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold">Vital Signs</p>
        <p className="text-xs text-muted-foreground">All vitals are optional. BMI is calculated automatically from weight and height.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {fields.map(([key, label, unit]) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {label}
              <span className="ml-1 text-[10px]">({unit})</span>
            </Label>
            <Input
              value={vitals[key] ?? ""}
              onChange={(e) => setVitals({ ...vitals, [key]: e.target.value })}
              placeholder={unit}
            />
          </div>
        ))}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            BMI
            <span className="ml-1 text-[10px]">(auto)</span>
          </Label>
          <Input value={bmi} readOnly placeholder="Auto calculated" className="bg-muted/40 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

// ─── Summary preview ─────────────────────────────────────────────────────────

function SummaryPreview({
  chiefComplaint,
  symptoms,
  vitals,
  diagnoses,
  notes,
  followUp,
  date,
}: {
  chiefComplaint: string;
  symptoms: string[];
  vitals: Record<string, string>;
  diagnoses: string[];
  notes: string;
  followUp: string;
  date: string;
}) {
  const vitalEntries = Object.entries(vitals).filter(([, v]) => v);
  const fmtDate = date ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Check className="size-4 text-primary" />
          Consultation Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <Row label="Date" value={fmtDate} />
          <Row label="Chief complaint" value={chiefComplaint || "—"} />
          <Row label="Symptoms" value={symptoms.length ? symptoms.join(", ") : "—"} />
          {vitalEntries.length > 0 && (
            <Row
              label="Vitals"
              value={vitalEntries
                .map(([k, v]) => {
                  const units: Record<string, string> = { temperature: "°F", bloodPressure: " mmHg", pulse: " bpm", spo2: "%", weight: " kg", height: " cm", bmi: " BMI" };
                  return `${v}${units[k] ?? ""}`;
                })
                .join(" · ")}
            />
          )}
          <Row label="Diagnosis" value={diagnoses.length ? diagnoses.join(", ") : "—"} />
          {notes && <Row label="Doctor notes" value={notes} />}
          {followUp && <Row label="Follow-up" value={followUp} />}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConsultationPage() {
  const { patientId, consultationId } = useParams<{ patientId: string; consultationId?: string }>();
  const navigate = useNavigate();

  const patient = initialPatients.find((p) => p.id === patientId);
  const isEdit = Boolean(consultationId);
  const existing = consultationId ? consultationService.getConsultationById(consultationId) : undefined;

  // ── Form state ──────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(existing?.date ?? today);
  const [chiefComplaint, setChiefComplaint] = useState(existing?.chiefComplaint ?? "");
  const [symptoms, setSymptoms] = useState<string[]>(existing?.symptoms ?? []);
  const [vitals, setVitals] = useState<Record<string, string>>({
    temperature: existing?.vitals.temperature ?? "",
    bloodPressure: existing?.vitals.bloodPressure ?? "",
    pulse: existing?.vitals.pulse ?? "",
    spo2: existing?.vitals.spo2 ?? "",
    weight: existing?.vitals.weight ?? "",
    height: existing?.vitals.height ?? "",
    bmi: existing?.vitals.bmi ?? "",
  });
  const [diagnoses, setDiagnoses] = useState<string[]>(
    existing?.diagnosis ? existing.diagnosis.split(",").map((d) => d.trim()).filter(Boolean) : []
  );
  const [notes, setNotes] = useState(existing?.doctorNotes ?? "");
  const [followUp, setFollowUp] = useState(existing?.followUpInstructions ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
        <p className="font-medium text-muted-foreground">Patient not found.</p>
        <Button variant="outline" onClick={() => navigate("/patients")}>
          Back to Patients
        </Button>
      </div>
    );
  }

  const validate = (): boolean => {
    if (!chiefComplaint.trim()) {
      setError("Chief complaint is required.");
      return false;
    }
    if (!date) {
      setError("Consultation date is required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    const now = new Date().toISOString();
    const payload: Consultation = {
      id: existing?.id ?? `CON-${Date.now()}`,
      patientId: patientId!,
      date,
      chiefComplaint: chiefComplaint.trim(),
      symptoms,
      vitals: {
        temperature: vitals.temperature || undefined,
        bloodPressure: vitals.bloodPressure || undefined,
        pulse: vitals.pulse || undefined,
        spo2: vitals.spo2 || undefined,
        weight: vitals.weight || undefined,
        height: vitals.height || undefined,
        bmi: vitals.bmi || undefined,
      },
      diagnosis: diagnoses.join(", "),
      doctorNotes: notes.trim(),
      followUpInstructions: followUp.trim(),
      prescriptionId: existing?.prescriptionId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (isEdit && existing) {
      consultationService.updateConsultation(existing.id, payload);
    } else {
      consultationService.createConsultation(payload);
    }

    // Navigate back with success flag in state so Patients page can show toast
    navigate(`/patients/${patientId}`, {
      state: { notification: isEdit ? "Consultation updated successfully." : "Consultation saved successfully." },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      {/* ── Back link ── */}
      <Link
        to={`/patients/${patientId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-1 size-4" />
        Back to Patient
      </Link>

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Consultation" : "New Consultation"}</h1>
        <div className="mt-1 space-y-0.5">
          <p className="text-sm font-medium text-foreground">Patient: {patient.name}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {patient.id} · {patient.age} years · {patient.gender} · {patient.phone}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-7 p-5 sm:p-6">
          {/* ── Consultation Date ── */}
          <Section label="Consultation Date" required>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="w-52"
            />
          </Section>

          <Separator />

          {/* ── Chief Complaint ── */}
          <Section label="Chief Complaint" required>
            <Textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Why is the patient visiting today?"
              rows={3}
            />
          </Section>

          <Separator />

          {/* ── Symptoms ── */}
          <ChipInput
            label="Symptoms"
            chips={symptoms}
            setChips={setSymptoms}
            placeholder="Enter symptom and press Enter or Add…"
          />

          <Separator />

          {/* ── Vitals ── */}
          <VitalsGrid vitals={vitals} setVitals={setVitals} />

          <Separator />

          {/* ── Diagnosis ── */}
          <ChipInput
            label="Diagnosis"
            chips={diagnoses}
            setChips={setDiagnoses}
            placeholder="Enter diagnosis and press Enter or Add…"
          />

          <Separator />

          {/* ── Doctor Notes ── */}
          <Section label="Doctor Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private clinical notes for this visit…"
              rows={4}
            />
          </Section>

          <Separator />

          {/* ── Follow-up ── */}
          <Section label="Follow-up Instructions">
            <Textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="e.g. Take adequate rest and drink plenty of fluids."
              rows={3}
            />
          </Section>

          <Separator />

          {/* ── Summary Preview ── */}
          <SummaryPreview
            chiefComplaint={chiefComplaint}
            symptoms={symptoms}
            vitals={vitals}
            diagnoses={diagnoses}
            notes={notes}
            followUp={followUp}
            date={date}
          />

          {/* ── Validation error ── */}
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate(`/patients/${patientId}`)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {isEdit ? "Update Consultation" : "Save Consultation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
