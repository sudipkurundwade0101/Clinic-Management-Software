import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Eye, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { initialPatients } from "@/data/patients";
import { consultationService } from "@/services/consultationService";
import { prescriptionService } from "@/services/prescriptionService";
import { consultationRoutes, prescriptionRoutes } from "@/constants/routes";
import type { Consultation, Patient } from "@/types/patient";
import type { Prescription } from "@/types/prescription";

import { Toast, fmtDate } from "@/components/patients/utils";
import { PatientEditorDialog } from "@/components/patients/PatientEditorDialog";
import { ConsultationDetailDialog } from "@/components/patients/ConsultationDetailDialog";
import { PrescriptionViewerDialog } from "@/components/patients/PrescriptionViewerDialog";
import { PatientProfile } from "@/components/patients/PatientProfile";

export default function Patients() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState("");
  const [editingPatient, setEditingPatient] = useState<Patient | "add" | null>(null);
  const [deletePatientTarget, setDeletePatientTarget] = useState<Patient | null>(null);
  const [notification, setNotification] = useState("");

  // Detail views state
  const [viewConsultation, setViewConsultation] = useState<Consultation | null>(null);
  const [deleteConsultTarget, setDeleteConsultTarget] = useState<Consultation | null>(null);
  const [viewPrescription, setViewPrescription] = useState<Prescription | null>(null);
  const [deletePrescriptionTarget, setDeletePrescriptionTarget] = useState<Prescription | null>(null);

  // Derived active patient
  const activePatient = useMemo(() => {
    return patientId ? patients.find((p) => p.id === patientId) : null;
  }, [patientId, patients]);

  const activeConsultations = useMemo(() => {
    return activePatient ? consultationService.getConsultationsByPatientId(activePatient.id) : [];
  }, [activePatient]);

  const activePrescriptions = useMemo(() => {
    return activePatient ? prescriptionService.getPrescriptionsByPatientId(activePatient.id) : [];
  }, [activePatient]);

  const consultationRx = useMemo(() => {
    return viewConsultation ? activePrescriptions.find((p) => p.consultationId === viewConsultation.id) : null;
  }, [viewConsultation, activePrescriptions]);

  // Actions: Patient
  const handleSavePatient = (p: Patient) => {
    if (editingPatient === "add") {
      setPatients([p, ...patients]);
      setNotification("Patient added successfully");
      navigate(`/patients/${p.id}`);
    } else {
      setPatients(patients.map((x) => (x.id === p.id ? p : x)));
      setNotification("Patient updated successfully");
    }
    setEditingPatient(null);
  };

  const handleDeletePatient = (p: Patient) => {
    setPatients(patients.filter((x) => x.id !== p.id));
    setDeletePatientTarget(null);
    setNotification("Patient deleted");
    if (patientId === p.id) navigate("/patients");
  };

  // Actions: Consultation
  const handleEditConsultation = (c: Consultation) => {
    setViewConsultation(null);
    navigate(consultationRoutes.editConsultation(c.patientId, c.id));
  };

  const handleDeleteConsultation = (c: Consultation) => {
    consultationService.deleteConsultation(c.id);
    setDeleteConsultTarget(null);
    setNotification("Consultation deleted");
    // force re-render via a dummy state update or just let React handle it 
    // (since activeConsultations is derived from service which relies on localStorage, 
    // we might need to trigger a refresh. In this simple demo, we just navigate to self)
    navigate(`/patients/${c.patientId}`);
  };

  const handleCreatePrescription = (consultationId?: string) => {
    setViewConsultation(null);
    if (!activePatient) return;
    navigate(prescriptionRoutes.newPrescription(activePatient.id, consultationId));
  };

  // Actions: Prescription
  const handleEditPrescription = (p: Prescription) => {
    setViewPrescription(null);
    navigate(prescriptionRoutes.editPrescription(p.patientId, p.id));
  };

  const handleDeletePrescription = (p: Prescription) => {
    prescriptionService.deletePrescription(p.id);
    setDeletePrescriptionTarget(null);
    setNotification("Prescription deleted");
    if (activePatient) navigate(`/patients/${activePatient.id}`);
  };

  const filteredPatients = useMemo(() => {
    const s = search.toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(s) || p.phone.includes(s) || p.id.toLowerCase().includes(s)
    );
  }, [patients, search]);

  // Render Patient Profile View
  if (patientId && activePatient) {
    return (
      <>
        <PatientProfile
          patient={activePatient}
          consultations={activeConsultations}
          prescriptions={activePrescriptions}
          onEdit={() => setEditingPatient(activePatient)}
          onEditConsultation={handleEditConsultation}
          onDeleteConsultation={(c) => setDeleteConsultTarget(c)}
          onViewConsultation={setViewConsultation}
          onCreatePrescription={handleCreatePrescription}
          onEditPrescription={handleEditPrescription}
          onDeletePrescription={(p) => setDeletePrescriptionTarget(p)}
          onViewPrescription={setViewPrescription}
        />

        {editingPatient && (
          <PatientEditorDialog
            open
            close={() => setEditingPatient(null)}
            patient={editingPatient !== "add" ? editingPatient : undefined}
            onSave={handleSavePatient}
          />
        )}

        <ConsultationDetailDialog
          consultation={viewConsultation}
          patient={activePatient}
          close={() => setViewConsultation(null)}
          onEdit={handleEditConsultation}
          onDelete={(c) => { setViewConsultation(null); setDeleteConsultTarget(c); }}
          onCreatePrescription={(c) => handleCreatePrescription(c.id)}
          onViewPrescription={consultationRx ? () => setViewPrescription(consultationRx) : undefined}
          hasPrescription={Boolean(consultationRx)}
        />

        <AlertDialog open={!!deleteConsultTarget} onOpenChange={() => setDeleteConsultTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Consultation?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The consultation record will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => deleteConsultTarget && handleDeleteConsultation(deleteConsultTarget)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deletePrescriptionTarget} onOpenChange={() => setDeletePrescriptionTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prescription?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The prescription will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => deletePrescriptionTarget && handleDeletePrescription(deletePrescriptionTarget)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <PrescriptionViewerDialog
          prescription={viewPrescription}
          patient={activePatient}
          close={() => setViewPrescription(null)}
          onEdit={handleEditPrescription}
          onDelete={(p) => { setViewPrescription(null); setDeletePrescriptionTarget(p); }}
        />

        {notification && <Toast text={notification} onDone={() => setNotification("")} />}
      </>
    );
  }

  // Render Not Found
  if (patientId && !activePatient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
        <p className="font-medium text-muted-foreground">Patient not found.</p>
        <Button variant="outline" onClick={() => navigate("/patients")}>Back to Patients</Button>
      </div>
    );
  }

  // Render Directory
  return (
    <div className="space-y-6 p-4 sm:p-6 no-print">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground">Manage patient records and medical history</p>
        </div>
        <Button onClick={() => setEditingPatient("add")}>
          <Plus className="mr-2 size-4" /> Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <CardTitle>Patient Directory</CardTitle>
            <CardDescription>{patients.length} registered patients</CardDescription>
          </div>
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name, phone, or patient ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length ? (
            <>
              <div className="hidden overflow-hidden rounded-lg border md:block">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                    <tr>
                      {["Patient ID", "Name", "Age", "Gender", "Phone", "Last Visit", "Status", ""].map((h) => (
                        <th key={h} className="px-3 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((p) => (
                      <tr key={p.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                        <td className="px-3 py-3 font-mono text-xs">{p.id}</td>
                        <td className="px-3 py-3 font-medium">{p.name}</td>
                        <td className="px-3 py-3">{p.age}</td>
                        <td className="px-3 py-3">{p.gender}</td>
                        <td className="px-3 py-3">{p.phone}</td>
                        <td className="px-3 py-3">{fmtDate(p.lastVisit)}</td>
                        <td className="px-3 py-3"><Badge variant="secondary">{p.status}</Badge></td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon-sm" onClick={() => navigate(`/patients/${p.id}`)}><Eye className="size-4" /></Button>
                            <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => setDeletePatientTarget(p)}><Trash2 className="size-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-2 md:hidden">
                {filteredPatients.map((p) => (
                  <button key={p.id} className="w-full rounded-lg border p-4 text-left hover:bg-muted/30 transition-colors" onClick={() => navigate(`/patients/${p.id}`)}>
                    <div className="flex items-center justify-between">
                      <b>{p.name}</b><ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                    <small className="block text-muted-foreground">{p.id} · {p.age} years · {p.phone}</small>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center space-y-2">
              <Search className="mx-auto mb-3 size-8 text-muted-foreground/40" />
              <p className="font-medium">{search ? "No patients match your search" : "No patients yet"}</p>
              {!search && <Button className="mt-2" onClick={() => setEditingPatient("add")}><Plus className="mr-2 size-4" /> Add First Patient</Button>}
            </div>
          )}
        </CardContent>
      </Card>

      {editingPatient === "add" && (
        <PatientEditorDialog open close={() => setEditingPatient(null)} onSave={handleSavePatient} />
      )}

      <AlertDialog open={!!deletePatientTarget} onOpenChange={() => setDeletePatientTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the local patient record and cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => deletePatientTarget && handleDeletePatient(deletePatientTarget)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {notification && <Toast text={notification} onDone={() => setNotification("")} />}
    </div>
  );
}
