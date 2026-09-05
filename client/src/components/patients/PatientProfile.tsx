import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Eye, FileText, Pencil, Plus, Printer,
  Stethoscope, Trash2, Activity, Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { consultationRoutes } from "@/constants/routes";
import { fmtDate } from "./utils";
import type { Consultation, Patient } from "@/types/patient";
import type { Prescription } from "@/types/prescription";

// Import data directly as it was used in Patients.tsx
import { initialBills, initialDocuments } from "@/data/clinicalData";

export function PatientProfile({
  patient,
  consultations,
  prescriptions,
  onEdit,
  onEditConsultation,
  onDeleteConsultation,
  onViewConsultation,
  onCreatePrescription,
  onEditPrescription,
  onDeletePrescription,
  onViewPrescription,
}: {
  patient: Patient;
  consultations: Consultation[];
  prescriptions: Prescription[];
  onEdit: () => void;
  onEditConsultation: (c: Consultation) => void;
  onDeleteConsultation: (c: Consultation) => void;
  onViewConsultation: (c: Consultation) => void;
  onCreatePrescription: (consultationId?: string) => void;
  onEditPrescription: (p: Prescription) => void;
  onDeletePrescription: (p: Prescription) => void;
  onViewPrescription: (p: Prescription) => void;
}) {
  const navigate = useNavigate();
  const docs = initialDocuments.filter((d) => d.patientId === patient.id);
  const bills = initialBills.filter((b) => b.patientId === patient.id);
  const total = bills.reduce((n, b) => n + b.amount, 0);
  const paid = bills.reduce((n, b) => n + b.paidAmount, 0);
  const outstanding = total - paid;
  const latest = consultations[0];

  const goNewConsultation = () => navigate(consultationRoutes.newConsultation(patient.id));
  const goNewPrescription = () => onCreatePrescription();

  const initials = patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const bgColors: Record<string, string> = {
    "O+": "bg-red-500", "O-": "bg-red-700",
    "A+": "bg-blue-500", "A-": "bg-blue-700",
    "B+": "bg-green-500", "B-": "bg-green-700",
    "AB+": "bg-purple-500", "AB-": "bg-purple-700",
  };
  const bgColor = bgColors[patient.bloodGroup ?? ""] ?? "bg-slate-500";

  return (
    <div className="no-print min-h-screen bg-muted/30">
      {/* Sticky breadcrumb bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 h-14">
          <Link
            to="/patients"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            All Patients
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium truncate">{patient.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
              <Pencil className="size-3.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={goNewPrescription} className="gap-1.5">
              <Pill className="size-3.5" /> + Rx
            </Button>
            <Button size="sm" onClick={goNewConsultation} className="gap-1.5">
              <Plus className="size-3.5" /> New Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Cover banner collage */}
      <div className="relative h-32 sm:h-44 overflow-hidden bg-primary/20 grid grid-cols-2 sm:grid-cols-4 gap-1">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
          alt="Hospital Hallway" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay col-span-2 sm:col-span-2"
        />
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600" 
          alt="Laboratory" 
          className="w-full h-full object-cover opacity-50 mix-blend-overlay hidden sm:block"
        />
        <img 
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=600" 
          alt="Medical Equipment" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay hidden sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-color pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="flex gap-5 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-16">

            {/* Profile card */}
            <Card className="overflow-hidden shadow-md">
              <div className="flex flex-col items-center pt-10 pb-5 px-5">
                <div className="size-24 rounded-full ring-4 ring-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-lg -mt-10 mb-3 select-none">
                  {initials}
                </div>
                <h1 className="text-xl font-bold text-center leading-tight">{patient.name}</h1>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{patient.id}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center">
                  <Badge variant={patient.status === "Active" ? "default" : "secondary"} className="text-xs">
                    {patient.status}
                  </Badge>
                  {patient.bloodGroup && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${bgColor}`}>
                      {patient.bloodGroup}
                    </span>
                  )}
                </div>

                <Separator className="my-3 w-full" />

                <div className="w-full space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="font-medium text-foreground">{patient.age} years &middot; {patient.gender}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="font-medium text-foreground">{patient.phone}</span>
                  </div>
                  {patient.address && (
                    <div className="flex items-start gap-2.5 text-muted-foreground">
                      <svg className="size-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="font-medium text-foreground leading-snug">{patient.address}</span>
                    </div>
                  )}
                  {patient.lastVisit && (
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Last visit <strong className="text-foreground">{fmtDate(patient.lastVisit)}</strong></span>
                    </div>
                  )}
                </div>

                <Separator className="my-3 w-full" />

                <div className="w-full grid grid-cols-3 text-center divide-x divide-border">
                  <div className="px-2">
                    <p className="text-lg font-bold text-primary">{consultations.length}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">Visits</p>
                  </div>
                  <div className="px-2">
                    <p className="text-lg font-bold text-primary">{prescriptions.length}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">Rx Issued</p>
                  </div>
                  <div className="px-2">
                    <p className="text-lg font-bold text-primary">{docs.length}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">Docs</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Medical details */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold">Medical Details</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-3 text-sm">
                {patient.allergies.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Allergies</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((a) => (
                        <Badge key={a} variant="destructive" className="text-[10px] font-normal">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {patient.existingConditions.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.existingConditions.map((c) => (
                        <Badge key={c} variant="secondary" className="text-[10px] font-normal">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {patient.currentMedications.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Current Medications</p>
                    <div className="space-y-0.5">
                      {patient.currentMedications.map((m) => (
                        <p key={m} className="text-xs text-foreground flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-primary shrink-0" />{m}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {patient.existingConditions.length === 0 && patient.allergies.length === 0 && patient.currentMedications.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No medical details recorded.</p>
                )}
                {patient.emergencyContact && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Emergency Contact</p>
                      <p className="text-xs font-medium text-foreground">{patient.emergencyContact}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── CENTER COLUMN ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile header */}
            <Card className="lg:hidden mb-4 shadow-md">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="size-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow shrink-0 select-none">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold truncate">{patient.name}</h1>
                  <p className="text-xs text-muted-foreground font-mono">{patient.id}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{patient.age} yrs &middot; {patient.gender} &middot; {patient.phone}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={onEdit} className="gap-1 h-7 text-xs"><Pencil className="size-3" /> Edit</Button>
                    <Button size="sm" onClick={goNewConsultation} className="gap-1 h-7 text-xs"><Plus className="size-3" /> Visit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview">
              <div className="sticky top-14 z-20  pb-1">
                <TabsList className="w-full justify-start bg-background border border-border rounded-xl p-1 h-12 shadow-sm overflow-x-auto">
                  <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm px-3 py-1.5 data-active:!bg-primary data-active:!text-primary-foreground data-active:!shadow-md transition-all">Overview</TabsTrigger>
                  <TabsTrigger value="consultations" className="group rounded-lg text-xs sm:text-sm px-3 py-1.5 data-active:!bg-primary data-active:!text-primary-foreground data-active:!shadow-md transition-all">
                    Consultations
                    {consultations.length > 0 && <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 h-4 border-none group-data-active:!bg-primary-foreground group-data-active:!text-primary">{consultations.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="prescriptions" className="group rounded-lg text-xs sm:text-sm px-3 py-1.5 data-active:!bg-primary data-active:!text-primary-foreground data-active:!shadow-md transition-all">
                    Prescriptions
                    {prescriptions.length > 0 && <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 h-4 border-none group-data-active:!bg-primary-foreground group-data-active:!text-primary">{prescriptions.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="rounded-lg text-xs sm:text-sm px-3 py-1.5 data-active:!bg-primary data-active:!text-primary-foreground data-active:!shadow-md transition-all">Documents</TabsTrigger>
                  <TabsTrigger value="billing" className="rounded-lg text-xs sm:text-sm px-3 py-1.5 data-active:!bg-primary data-active:!text-primary-foreground data-active:!shadow-md transition-all">Billing</TabsTrigger>
                </TabsList>
              </div>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                {latest ? (
                  <Card className="shadow-sm border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Latest Visit</p>
                          <CardTitle className="text-base mt-0.5">{latest.chiefComplaint}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs font-mono">{fmtDate(latest.date)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {latest.diagnosis && (
                        <div className="flex flex-wrap gap-1.5">
                          {latest.diagnosis.split(",").map((d) => d.trim()).filter(Boolean).map((d) => (
                            <Badge key={d} className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">{d}</Badge>
                          ))}
                        </div>
                      )}
                      {latest.doctorNotes && (
                        <p className="text-sm text-muted-foreground line-clamp-2 bg-muted/30 rounded-lg px-3 py-2 border border-border/40 italic">
                          &ldquo;{latest.doctorNotes}&rdquo;
                        </p>
                      )}
                      {Object.values(latest.vitals).some(Boolean) && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                          {[
                            { label: "Temp", value: latest.vitals.temperature, unit: "F" },
                            { label: "BP", value: latest.vitals.bloodPressure, unit: "mmHg" },
                            { label: "Pulse", value: latest.vitals.pulse, unit: "bpm" },
                            { label: "SpO2", value: latest.vitals.spo2, unit: "%" },
                            { label: "Weight", value: latest.vitals.weight, unit: "kg" },
                            { label: "BMI", value: latest.vitals.bmi, unit: "" },
                          ].filter(({ value }) => value).map(({ label, value, unit }) => (
                            <div key={label} className="rounded-lg bg-muted/50 border border-border/50 p-2 text-center">
                              <p className="text-[10px] text-muted-foreground">{label}</p>
                              <p className="text-sm font-bold text-foreground">{value}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">{unit}</span></p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 pt-1 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => onViewConsultation(latest)} className="gap-1.5 text-xs">
                          <Eye className="size-3.5" /> View Full Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onCreatePrescription(latest.id)} className="gap-1.5 text-xs">
                          <Pill className="size-3.5" /> Prescribe Medicines
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-sm">
                    <CardContent className="py-10 text-center space-y-3">
                      <Stethoscope className="mx-auto size-10 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">No visits recorded yet</p>
                      <Button onClick={goNewConsultation}><Plus className="mr-2 size-4" /> Record First Visit</Button>
                    </CardContent>
                  </Card>
                )}

                {consultations.length > 1 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Visit History</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-3">
                      {consultations.slice(1, 4).map((c) => (
                        <button key={c.id} onClick={() => onViewConsultation(c)}
                          className="w-full text-left rounded-lg px-3 py-2.5 border border-border hover:bg-muted/40 transition-colors group">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.chiefComplaint}</p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{fmtDate(c.date)}</span>
                          </div>
                          {c.diagnosis && <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.diagnosis}</p>}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {prescriptions.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recent Prescriptions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-3">
                      {prescriptions.slice(0, 3).map((p) => (
                        <button key={p.id} onClick={() => onViewPrescription(p)}
                          className="w-full text-left rounded-lg px-3 py-2.5 border border-border hover:bg-muted/40 transition-colors group">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">
                              {p.medicines.length} medicine{p.medicines.length !== 1 ? "s" : ""}
                              <span className="text-muted-foreground font-normal ml-1.5 text-xs">
                                &mdash; {p.medicines.map((m) => m.medicineName || m.name).slice(0, 2).join(", ")}{p.medicines.length > 2 ? "..." : ""}
                              </span>
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{fmtDate(p.date)}</span>
                          </div>
                          {p.diagnosis.length > 0 && <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.diagnosis.join(", ")}</p>}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* CONSULTATIONS TAB */}
              <TabsContent value="consultations" className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">{consultations.length} consultations &middot; newest first</p>
                  <Button size="sm" onClick={goNewConsultation} className="gap-1.5"><Plus className="size-3.5" /> New Visit</Button>
                </div>
                {consultations.length ? consultations.map((c) => {
                  const diagnoses = c.diagnosis ? c.diagnosis.split(",").map((d) => d.trim()).filter(Boolean) : [];
                  const vitalsSummary = [
                    c.vitals.temperature && `${c.vitals.temperature}F`,
                    c.vitals.bloodPressure && `BP ${c.vitals.bloodPressure}`,
                    c.vitals.pulse && `Pulse ${c.vitals.pulse}`,
                    c.vitals.spo2 && `SpO2 ${c.vitals.spo2}%`,
                  ].filter(Boolean).join(" / ");
                  const matchedRx = prescriptions.find((p) => p.consultationId === c.id);
                  return (
                    <Card key={c.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-stretch">
                          <div className="w-1 bg-primary/60 shrink-0 rounded-l-xl" />
                          <div className="flex-1 p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-muted-foreground font-medium">{fmtDate(c.date)}</span>
                                  {matchedRx && (
                                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30 py-0">
                                      <Pill className="size-2.5 mr-1" />{matchedRx.medicines.length} med Rx
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-semibold text-sm">{c.chiefComplaint}</p>
                                {diagnoses.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {diagnoses.map((d) => <Badge key={d} variant="secondary" className="text-[10px]">{d}</Badge>)}
                                  </div>
                                )}
                                {vitalsSummary && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Activity className="size-3 shrink-0" />{vitalsSummary}
                                  </p>
                                )}
                              </div>
                              <Button variant="outline" size="sm" onClick={() => onViewConsultation(c)} className="gap-1.5 shrink-0 text-xs">
                                <Eye className="size-3.5" /> View
                              </Button>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onEditConsultation(c)}>
                                  <Pencil className="mr-1 size-3" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => onDeleteConsultation(c)}>
                                  <Trash2 className="mr-1 size-3" /> Delete
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm" className="text-xs h-7 text-primary hover:text-primary gap-1"
                                onClick={() => matchedRx ? onViewPrescription(matchedRx) : onCreatePrescription(c.id)}>
                                <Pill className="size-3" />{matchedRx ? "View Rx" : "+ Create Rx"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }) : (
                  <Card className="shadow-sm">
                    <CardContent className="py-14 text-center space-y-4">
                      <Stethoscope className="mx-auto size-12 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">No consultations recorded yet.</p>
                      <Button onClick={goNewConsultation}><Plus className="mr-2 size-4" /> New Consultation</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* PRESCRIPTIONS TAB */}
              <TabsContent value="prescriptions" className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">{prescriptions.length} prescriptions &middot; newest first</p>
                  <Button size="sm" onClick={goNewPrescription} className="gap-1.5"><Plus className="size-3.5" /> Create Rx</Button>
                </div>
                {prescriptions.length ? prescriptions.map((p) => (
                  <Card key={p.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        <div className="w-1 bg-emerald-500/70 shrink-0 rounded-l-xl" />
                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{fmtDate(p.date)}</span>
                                <Badge variant="outline" className="font-mono text-[10px]">{p.id}</Badge>
                              </div>
                              {p.diagnosis && p.diagnosis.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {p.diagnosis.map((d, i) => <Badge key={i} variant="secondary" className="text-[10px]">{d}</Badge>)}
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">{p.medicines.length}</span>{" "}
                                {p.medicines.length === 1 ? "medicine" : "medicines"} prescribed:{" "}
                                <span className="italic">{p.medicines.map((m) => m.medicineName || m.name).slice(0, 3).join(", ")}{p.medicines.length > 3 ? "..." : ""}</span>
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" variant="outline" onClick={() => onViewPrescription(p)} className="gap-1.5 text-xs">
                                <Eye className="size-3.5" /> View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { onViewPrescription(p); setTimeout(() => window.print(), 200); }} className="gap-1.5 text-xs">
                                <Printer className="size-3.5" /> Print
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-border/50">
                            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onEditPrescription(p)}>
                              <Pencil className="mr-1 size-3" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => onDeletePrescription(p)}>
                              <Trash2 className="mr-1 size-3" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="shadow-sm">
                    <CardContent className="py-14 text-center space-y-4">
                      <Pill className="mx-auto size-12 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">No prescriptions available.</p>
                      <Button onClick={goNewPrescription} className="gap-1.5"><Plus className="size-4" /> Create First Prescription</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* DOCUMENTS TAB */}
              <TabsContent value="documents" className="mt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm">Uploaded Documents</CardTitle>
                    <CardDescription>Patient files, lab reports and records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {docs.length ? (
                      <div className="space-y-1">
                        {docs.map((d) => (
                          <div key={d.id} className="flex items-center gap-3 rounded-lg px-4 py-3.5 border border-border hover:bg-muted/40 transition-colors">
                            <FileText className="size-5 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.type} &middot; {fmtDate(d.uploadedAt)} &middot; {d.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <FileText className="mx-auto size-10 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* BILLING TAB */}
              <TabsContent value="billing" className="mt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Billed</p>
                      <p className="text-2xl font-bold mt-1">Rs.{total.toLocaleString("en-IN")}</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Collected</p>
                      <p className="text-2xl font-bold mt-1 text-emerald-600">Rs.{paid.toLocaleString("en-IN")}</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Outstanding</p>
                      <p className={`text-2xl font-bold mt-1 ${outstanding > 0 ? "text-destructive" : "text-emerald-600"}`}>
                        Rs.{outstanding.toLocaleString("en-IN")}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                        <tr>
                          {["Date", "Description", "Amount", "Paid", "Method", "Status"].map((h) => (
                            <th key={h} className="px-5 py-4 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bills.length ? bills.map((b) => (
                          <tr key={b.id} className="border-t hover:bg-muted/20 transition-colors">
                            <td className="px-5 py-3.5 text-muted-foreground">{fmtDate(b.date)}</td>
                            <td className="px-5 py-3.5 font-medium">{b.description}</td>
                            <td className="px-5 py-3.5 font-semibold">Rs.{b.amount.toLocaleString("en-IN")}</td>
                            <td className="px-5 py-3.5">Rs.{b.paidAmount.toLocaleString("en-IN")}</td>
                            <td className="px-5 py-3.5 text-muted-foreground">{b.paymentMethod}</td>
                            <td className="px-5 py-3.5">
                              <Badge variant={b.status === "Paid" ? "default" : b.status === "Pending" ? "destructive" : "secondary"} className="text-xs">
                                {b.status}
                              </Badge>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">No billing records found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="hidden xl:flex flex-col gap-4 w-64 shrink-0 sticky top-16">
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9" onClick={goNewConsultation}>
                  <Stethoscope className="size-4 text-primary" /> New Consultation
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9" onClick={goNewPrescription}>
                  <Pill className="size-4 text-emerald-600" /> Create Prescription
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9" onClick={onEdit}>
                  <Pencil className="size-4 text-muted-foreground" /> Edit Patient Info
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Billing Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total billed</span>
                  <span className="font-semibold">Rs.{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Collected</span>
                  <span className="font-semibold text-emerald-600">Rs.{paid.toLocaleString("en-IN")}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className={`font-bold ${outstanding > 0 ? "text-destructive" : "text-emerald-600"}`}>
                    Rs.{outstanding.toLocaleString("en-IN")}
                  </span>
                </div>
                {total > 0 && (
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (paid / total) * 100).toFixed(0)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right">{Math.min(100, Math.round((paid / total) * 100))}% paid</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {consultations.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="relative space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                    {consultations.slice(0, 5).map((c) => (
                      <button key={c.id} onClick={() => onViewConsultation(c)}
                        className="flex gap-3 items-start text-left w-full group">
                        <div className="size-3.5 mt-0.5 rounded-full bg-primary/20 border-2 border-primary shrink-0 group-hover:bg-primary transition-colors" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{c.chiefComplaint}</p>
                          <p className="text-[10px] text-muted-foreground">{fmtDate(c.date)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}
