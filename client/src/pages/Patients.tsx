import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Search, Eye, Trash2, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GooeyInput } from "@/components/ui/gooey-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

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
          <div className="w-full sm:max-w-md z-10">
            <GooeyInput
              placeholder="Search by name, phone, or ID..."
              value={search}
              onValueChange={(v) => { setSearch(v); setCurrentPage(1); }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length ? (
            <>
              <div className="hidden overflow-hidden rounded-lg border md:block">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPatients.map((p) => (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate(`/patients/${p.id}`)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 border">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-medium">{p.id}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell>{p.gender}</TableCell>
                        <TableCell>{p.phone}</TableCell>
                        <TableCell>{fmtDate(p.lastVisit)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon-sm" onClick={() => navigate(`/patients/${p.id}`)}><Eye className="size-4" /></Button>
                            <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => setDeletePatientTarget(p)}><Trash2 className="size-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-2 md:hidden">
                {paginatedPatients.map((p) => (
                  <button key={p.id} className="w-full rounded-lg border p-4 text-left hover:bg-muted/30 transition-colors" onClick={() => navigate(`/patients/${p.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <b>{p.name}</b>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                    <small className="block mt-2 text-muted-foreground">{p.id} · {p.age} years · {p.phone}</small>
                  </button>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pt-4 border-t mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
                  </p>
                  <Pagination className="justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i} className="hidden sm:inline-block">
                          <PaginationLink 
                            href="#" 
                            isActive={currentPage === i + 1}
                            onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                            className={currentPage === i + 1 ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary" : ""}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                <User className="size-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold">{search ? "No patients found" : "No patients yet"}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                {search 
                  ? "We couldn't find any patients matching your search. Try adjusting your filters." 
                  : "Get started by adding a new patient to your clinic's directory."}
              </p>
              {!search && (
                <Button onClick={() => setEditingPatient("add")} className="gap-2">
                  <Plus className="size-4" /> Add First Patient
                </Button>
              )}
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
