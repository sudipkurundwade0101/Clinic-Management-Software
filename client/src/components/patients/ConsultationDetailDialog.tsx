import { useState } from "react";
import { Eye, Plus, Pencil, Printer, Trash2, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fmtDate } from "./utils";
import type { Consultation, Patient } from "@/types/patient";

export function ConsultationDetailDialog({
  consultation,
  patient,
  close,
  onEdit,
  onDelete,
  onCreatePrescription,
  onViewPrescription,
  hasPrescription,
}: {
  consultation: Consultation | null;
  patient: Patient | undefined;
  close: () => void;
  onEdit: (c: Consultation) => void;
  onDelete: (c: Consultation) => void;
  onCreatePrescription: (c: Consultation) => void;
  onViewPrescription?: () => void;
  hasPrescription?: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!consultation) return null;

  const vitalRows: [string, string | undefined][] = [
    ["Temperature", consultation.vitals.temperature ? `${consultation.vitals.temperature} °F` : undefined],
    ["Blood Pressure", consultation.vitals.bloodPressure ? `${consultation.vitals.bloodPressure} mmHg` : undefined],
    ["Pulse Rate", consultation.vitals.pulse ? `${consultation.vitals.pulse} bpm` : undefined],
    ["SpO2", consultation.vitals.spo2 ? `${consultation.vitals.spo2}%` : undefined],
    ["Weight", consultation.vitals.weight ? `${consultation.vitals.weight} kg` : undefined],
    ["Height", consultation.vitals.height ? `${consultation.vitals.height} cm` : undefined],
    ["BMI", consultation.vitals.bmi],
  ];
  const recordedVitals = vitalRows.filter(([, v]) => v);
  const diagnoses = consultation.diagnosis
    ? consultation.diagnosis.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  return (
    <>
      <Dialog open={!!consultation} onOpenChange={close}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm">
            {/* Patient summary */}
            {patient && (
              <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-0.5">
                <p className="font-semibold text-foreground">{patient.name}</p>
                <p className="text-muted-foreground font-mono">{patient.id} · {patient.age} years · {patient.gender}</p>
              </div>
            )}

            {/* Date */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Consultation Date</p>
              <p className="font-semibold">{fmtDate(consultation.date)}</p>
            </div>

            <Separator />

            {/* Chief complaint */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Chief Complaint</p>
              <p className="font-medium text-foreground">{consultation.chiefComplaint}</p>
            </div>

            {/* Symptoms */}
            {consultation.symptoms.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {consultation.symptoms.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Vitals */}
            {recordedVitals.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Vital Signs</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                    {recordedVitals.map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Diagnosis */}
            {diagnoses.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Diagnosis</p>
                  <div className="flex flex-wrap gap-1.5">
                    {diagnoses.map((d) => (
                      <Badge key={d} variant="outline" className="text-primary border-primary/30 font-medium">{d}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Doctor notes */}
            {consultation.doctorNotes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Doctor Notes</p>
                  <p className="leading-relaxed bg-muted/20 p-2.5 rounded border border-border/50">{consultation.doctorNotes}</p>
                </div>
              </>
            )}

            {/* Follow-up */}
            {consultation.followUpInstructions && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Follow-up Instructions</p>
                  <p className="leading-relaxed">{consultation.followUpInstructions}</p>
                </div>
              </>
            )}

            {/* ── Prescription CTA Section inside Consultation Details ── */}
            <Separator />
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  <Pill className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-foreground">
                    {hasPrescription ? "Prescription Attached" : "Prescription Management"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {hasPrescription
                      ? "A prescription is attached to this visit."
                      : "Prescribe medicines for this diagnosis."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {hasPrescription && onViewPrescription ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      close();
                      onViewPrescription();
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <Eye className="size-3.5" /> View Rx
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  onClick={() => {
                    close();
                    onCreatePrescription(consultation);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Plus className="size-3.5" />
                  {hasPrescription ? "New Rx" : "Create Prescription"}
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <Separator />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete Visit
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="mr-2 size-4" />
                  Print
                </Button>
                <Button size="sm" onClick={() => { close(); onEdit(consultation); }}>
                  <Pencil className="mr-2 size-4" />
                  Edit Visit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Consultation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The consultation record will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                close();
                onDelete(consultation);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
