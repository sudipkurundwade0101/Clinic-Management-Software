import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialPatients } from "@/data/patients";
import { defaultDoctorInfo } from "@/data/doctorInfo";
import { consultationService } from "@/services/consultationService";
import { prescriptionService } from "@/services/prescriptionService";
import { MedicineForm } from "@/components/prescriptions/MedicineForm";
import { PrescriptionPreview } from "@/components/prescriptions/PrescriptionPreview";
import type { Prescription, PrescriptionMedicine } from "@/types/prescription";

export const PrescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { patientId, prescriptionId } = useParams<{
    patientId: string;
    prescriptionId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const queryConsultationId = searchParams.get("consultationId");

  const isEdit = Boolean(prescriptionId);
  const existingPrescription = prescriptionId
    ? prescriptionService.getPrescriptionById(prescriptionId)
    : undefined;

  // Retrieve patient
  const patient = initialPatients.find((p) => p.id === patientId);

  // Retrieve patient's consultations for context
  const patientConsultations = useMemo(
    () => (patientId ? consultationService.getConsultationsByPatientId(patientId) : []),
    [patientId]
  );

  // Determine selected consultation
  const initialConsultationId =
    existingPrescription?.consultationId ||
    queryConsultationId ||
    (patientConsultations.length > 0 ? patientConsultations[0].id : "");

  const [selectedConsultationId, setSelectedConsultationId] = useState<string>(
    initialConsultationId
  );

  const selectedConsultation = useMemo(
    () => patientConsultations.find((c) => c.id === selectedConsultationId),
    [patientConsultations, selectedConsultationId]
  );

  // ── Form State ──
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(existingPrescription?.date || selectedConsultation?.date || today);

  // Extract diagnosis from existing prescription or active consultation
  const defaultDiagnoses = useMemo(() => {
    if (existingPrescription?.diagnosis && existingPrescription.diagnosis.length > 0) {
      return existingPrescription.diagnosis;
    }
    if (selectedConsultation?.diagnosis) {
      return selectedConsultation.diagnosis.split(",").map((d) => d.trim()).filter(Boolean);
    }
    return [];
  }, [existingPrescription, selectedConsultation]);

  const [diagnoses, setDiagnoses] = useState<string[]>(defaultDiagnoses);

  // When consultation selection changes in new mode, update default diagnosis & date
  useEffect(() => {
    if (!isEdit && selectedConsultation) {
      if (selectedConsultation.diagnosis) {
        setDiagnoses(
          selectedConsultation.diagnosis.split(",").map((d) => d.trim()).filter(Boolean)
        );
      }
      if (selectedConsultation.date) {
        setDate(selectedConsultation.date);
      }
    }
  }, [selectedConsultation, isEdit]);

  // Medicines state
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>(
    existingPrescription?.medicines || [
      {
        id: `MED-INIT-${Date.now()}`,
        medicineName: "Paracetamol 500mg",
        dosage: "1 tablet",
        frequency: "Twice daily",
        duration: "3 days",
        foodInstruction: "After food",
        instructions: "Take for fever or pain",
      },
    ]
  );

  // General Instructions & Follow-up
  const [generalInstructions, setGeneralInstructions] = useState(
    existingPrescription?.generalInstructions || "Drink plenty of water and take adequate rest."
  );
  const [followUpInstructions, setFollowUpInstructions] = useState(
    existingPrescription?.followUpInstructions ||
    selectedConsultation?.followUpInstructions ||
    "Follow up after 5 days if symptoms persist."
  );

  const [validationError, setValidationError] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Construct draft prescription for preview
  const draftPrescription: Prescription = useMemo(
    () => ({
      id: existingPrescription?.id || `RX-${Date.now()}`,
      patientId: patientId!,
      consultationId: selectedConsultationId || "GENERAL",
      date,
      diagnosis: diagnoses.length > 0 ? diagnoses : ["General Assessment"],
      doctorName: defaultDoctorInfo.name,
      medicines: medicines.filter((m) => m.medicineName.trim() !== ""),
      generalInstructions: generalInstructions.trim() || undefined,
      followUpInstructions: followUpInstructions.trim() || undefined,
      createdAt: existingPrescription?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [
      existingPrescription,
      patientId,
      selectedConsultationId,
      date,
      diagnoses,
      medicines,
      generalInstructions,
      followUpInstructions,
    ]
  );

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
    if (medicines.length === 0) {
      setValidationError("Please add at least one medicine to the prescription.");
      return false;
    }
    const emptyMed = medicines.find((m) => !m.medicineName.trim());
    if (emptyMed) {
      setValidationError("Please provide a medicine name for all medicine entries.");
      return false;
    }
    const missingDosage = medicines.find((m) => !m.dosage.trim());
    if (missingDosage) {
      setValidationError("Please specify dosage for all medicines.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSave = () => {
    if (!validate()) {
      setActiveTab("edit");
      return;
    }

    const payload: Prescription = {
      ...draftPrescription,
      medicines: medicines.map((m) => ({
        ...m,
        medicineName: m.medicineName.trim(),
        name: m.medicineName.trim(),
        dosage: m.dosage.trim(),
        frequency: m.frequency.trim() || "As directed",
        duration: m.duration.trim() || "3 days",
        foodInstruction: m.foodInstruction || "After food",
        food: m.foodInstruction || "After food",
        instructions: m.instructions?.trim() || undefined,
      })),
    };

    if (isEdit && prescriptionId) {
      prescriptionService.updatePrescription(prescriptionId, payload);
    } else {
      prescriptionService.createPrescription(payload);
      // Link prescription ID to consultation if not already linked
      if (selectedConsultation) {
        consultationService.updateConsultation(selectedConsultation.id, {
          ...selectedConsultation,
          prescriptionId: payload.id,
        });
      }
    }

    navigate(`/patients/${patientId}`, {
      state: {
        notification: isEdit
          ? "Prescription updated successfully."
          : "Prescription created and saved successfully.",
      },
    });
  };

  const handleSaveAndPrint = () => {
    if (!validate()) {
      setActiveTab("edit");
      return;
    }

    const payload: Prescription = {
      ...draftPrescription,
      medicines: medicines.map((m) => ({
        ...m,
        medicineName: m.medicineName.trim(),
        name: m.medicineName.trim(),
        dosage: m.dosage.trim(),
        frequency: m.frequency.trim() || "As directed",
        duration: m.duration.trim() || "3 days",
        foodInstruction: m.foodInstruction || "After food",
        food: m.foodInstruction || "After food",
        instructions: m.instructions?.trim() || undefined,
      })),
    };

    if (isEdit && prescriptionId) {
      prescriptionService.updatePrescription(prescriptionId, payload);
    } else {
      prescriptionService.createPrescription(payload);
      if (selectedConsultation) {
        consultationService.updateConsultation(selectedConsultation.id, {
          ...selectedConsultation,
          prescriptionId: payload.id,
        });
      }
    }

    setActiveTab("preview");
    // Short delay to allow the preview tab to render before calling print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      {/* ── Back Navigation Link ── */}
      <Link
        to={`/patients/${patientId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors no-print"
      >
        <ArrowLeft className="mr-1 size-4" />
        Back to Patient Profile
      </Link>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Prescription" : "Create Prescription"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Prescribe medicines and clinical directions for {patient.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/patients/${patientId}`)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-1.5">
            <CheckCircle2 className="size-4" />
            {isEdit ? "Save Changes" : "Save Prescription"}
          </Button>
        </div>
      </div>

      {/* ── Header Summary Card (Doctor + Patient Details) ── */}
      <Card className="no-print border shadow-xs bg-card">
        <CardContent className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doctor Info */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              <Stethoscope className="size-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-foreground text-sm">{defaultDoctorInfo.name}</p>
              <p className="text-muted-foreground">{defaultDoctorInfo.qualification}</p>
              <p className="text-muted-foreground font-mono text-[11px]">
                Reg: {defaultDoctorInfo.registrationNumber} • {defaultDoctorInfo.clinicName}
              </p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              <User className="size-4" />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-foreground text-sm">{patient.name}</p>
              <p className="text-muted-foreground font-mono text-[11px]">
                {patient.id} • {patient.age}y • {patient.gender} • Ph: {patient.phone}
              </p>
              {patient.allergies.length > 0 && (
                <p className="text-destructive font-medium text-[11px]">
                  Allergies: {patient.allergies.join(", ")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tab Selector: Form Editor vs Live Printable Preview ── */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
        className="w-full no-print"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="gap-2">
            <Edit3 className="size-4" /> Prescription Form
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="size-4" /> Print & Document Preview
          </TabsTrigger>
        </TabsList>

        {/* ── Form Tab Content ── */}
        <TabsContent value="edit" className="space-y-6 mt-4">
          <Card className="border shadow-sm">
            <CardContent className="space-y-6 p-5 sm:p-6">
              {/* Consultation Linkage & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patientConsultations.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Associated Consultation Visit</Label>
                    <select
                      value={selectedConsultationId}
                      onChange={(e) => setSelectedConsultationId(e.target.value)}
                      disabled={isEdit}
                      className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-ring outline-none"
                    >
                      {patientConsultations.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.date} — {c.chiefComplaint} ({c.diagnosis || "No diagnosis"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Prescription Date</Label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-ring outline-none font-medium"
                  />
                </div>
              </div>

              {/* Consultation Context Banner */}
              {selectedConsultation && (
                <div className="p-3.5 rounded-xl bg-muted/40 border text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                    <Calendar className="size-3" /> Consultation Summary
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                    <p>
                      <span className="text-muted-foreground">Chief Complaint: </span>
                      <span className="font-medium text-foreground">{selectedConsultation.chiefComplaint}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Diagnosis: </span>
                      <span className="font-semibold text-primary">{selectedConsultation.diagnosis || "—"}</span>
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              {/* ── Medicine Entry Section ── */}
              <MedicineForm medicines={medicines} setMedicines={setMedicines} />

              <Separator />

              {/* ── Additional Instructions ── */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">General Instructions & Advice</Label>
                  <Textarea
                    value={generalInstructions}
                    onChange={(e) => setGeneralInstructions(e.target.value)}
                    placeholder="e.g. Drink plenty of water and take adequate rest. Avoid cold food."
                    rows={3}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Follow-up Instructions</Label>
                  <Textarea
                    value={followUpInstructions}
                    onChange={(e) => setFollowUpInstructions(e.target.value)}
                    placeholder="e.g. Review after 5 days if symptoms persist or fever does not settle."
                    rows={2}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Validation alert */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                  <AlertCircle className="size-4 shrink-0" />
                  {validationError}
                </div>
              )}

              {/* Bottom Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("preview")}
                  className="gap-1.5"
                >
                  <Eye className="size-4" /> Preview Printable Document
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate(`/patients/${patientId}`)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-1.5">
                    <CheckCircle2 className="size-4" />
                    {isEdit ? "Save Changes" : "Save Prescription"}
                  </Button>
                  <Button onClick={handleSaveAndPrint} className="gap-1.5" variant="secondary">
                    <Printer className="size-4" />
                    Save & Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Preview Tab Content ── */}
        <TabsContent value="preview" className="mt-4">
          <PrescriptionPreview
            prescription={draftPrescription}
            patient={patient}
            doctor={defaultDoctorInfo}
            showActions={false}
          />

          <div className="flex justify-end gap-3 pt-4 no-print">
            <Button variant="outline" onClick={() => setActiveTab("edit")}>
              Back to Editing Form
            </Button>
            <Button onClick={handleSave} className="gap-1.5">
              <CheckCircle2 className="size-4" /> Save
            </Button>
            <Button onClick={handleSaveAndPrint} className="gap-1.5" variant="secondary">
              <Printer className="size-4" /> Save & Print
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionPage;
