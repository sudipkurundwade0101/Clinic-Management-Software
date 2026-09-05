import React from "react";
import logoImg from "../../assets/image.png";
import { Printer, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DoctorInfo } from "@/data/doctorInfo";
import type { Prescription } from "@/types/prescription";
import type { Patient } from "@/types/patient";

const translateToMarathi = (text: string | undefined | null) => {
  if (!text) return "";

  const translations: Record<string, string> = {
    "before food": "जेवणाआधी",
    "after food": "जेवणानंतर",
    "empty stomach": "रिकाम्या पोटी",
    "with food": "जेवणासोबत",
    "once daily": "1 - 0 - 0",
    "twice daily": "1 - 0 - 1",
    "three times daily": "1 - 1 - 1",
    "four times daily": "1 - 1 - 1 - 1",
    "as needed": "गरजेनुसार",
    "sos": "गरजेनुसार",
  };

  const lowerText = text.toLowerCase().trim();
  if (translations[lowerText]) {
    return translations[lowerText];
  }

  // Replace duration parts
  let result = text;
  result = result.replace(/days/gi, "दिवस")
    .replace(/day/gi, "दिवस")
    .replace(/weeks/gi, "आठवडे")
    .replace(/week/gi, "आठवडा")
    .replace(/months/gi, "महिने")
    .replace(/month/gi, "महिना");

  return result;
};

interface PrescriptionPreviewProps {
  prescription: Prescription;
  patient?: Patient;
  doctor?: DoctorInfo;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
  prescription,
  patient,
  doctor,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const formattedDateTime = prescription.date
    ? new Date(prescription.date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (hidden when printing) */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/40 rounded-xl border no-print">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {prescription.id}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Prescription for {patient?.name || "Patient"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="size-4" /> Print / Save as PDF
            </Button>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
      {/* ── Printable Prescription Document ── */}
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&display=swap');

  @media print {
    @page { 
      size: A5 portrait; 
      margin: 0; 
    }

    html, body {
      visibility: hidden !important;
      background: white !important;
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
      overflow: visible !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Kill the dialog overlay/backdrop entirely */
    [data-radix-dialog-overlay],
    [data-state="open"] ~ div[style*="pointer-events"] {
      display: none !important;
    }

    /* Let the dialog wrapper and all ancestors expand fully, no clipping */
    [role="dialog"],
    [role="dialog"] * {
      overflow: visible !important;
      max-height: none !important;
    }

    [role="dialog"] {
      position: static !important;
      transform: none !important;
      inset: auto !important;
      width: auto !important;
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
      padding: 0 !important;
    }

    .prescription-print-area,
    .prescription-print-area * {
      visibility: visible !important;
    }

    .prescription-print-area {
      position: absolute !important;   /* not fixed — avoids print clipping */
      left: 0 !important;
      top: 0 !important;
      width: 148mm !important;
      min-height: 210mm !important;
      height: auto !important;         /* let content grow past one page if needed */
      margin: 0 !important;
      padding: 15px !important;
      border: none !important;
      box-shadow: none !important;
      background: white !important;
      z-index: 999999 !important;
    }

    ::-webkit-scrollbar { display: none !important; }
  }
`}</style>
      <div
        className="prescription-print-area mx-auto bg-white border shadow-sm rounded-md"
        style={{
          fontFamily: "'Mukta', 'Noto Sans Devanagari', 'Inter', 'Arial', sans-serif",
          maxWidth: "148mm", /* A5 Width approx */
          color: "#334155", /* Slate Grey/Black */
        }}
      >
        <div className="p-4 sm:p-5 space-y-3 relative">

          {/* Header Section */}
          <div className="flex flex-col gap-3">
            {/* Clinic Name */}
            <div className="flex flex-row items-center justify-center gap-3">
              <img src={logoImg} alt="Clinic Logo" className="w-16 h-16 object-contain" />
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#B22222" }}>
                धन्वंतरी क्लिनिक
              </h1>
            </div>

            <div className="flex justify-between items-start">
              {/* Left: Doctor 1 */}
              <div className="space-y-0.5">
                <h2 className="text-[13px] font-bold" style={{ color: "#B22222" }}>
                  डॉ. एस. बी. कांबळे
                </h2>
                <p className="font-semibold text-[11px] text-slate-700">
                  (बी.एच.एम.एस., सी.सी.एम.पी.)
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  MUHS NASHIK
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  REGD. NO.: 69865
                </p>
              </div>

              {/* Right: Doctor 2 */}
              <div className="space-y-0.5 text-right">
                <h2 className="text-[13px] font-bold" style={{ color: "#B22222" }}>
                  डॉ. प्रज्ञा एस. कांबळे
                </h2>
                <p className="font-semibold text-[11px] text-slate-700">
                  (बी.एन.वाय.एस., डी.जी.एन.एम.)
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  MUMBAI
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  REGD. NO.: 02096
                </p>
              </div>
            </div>

            {/* Clinic Location & Timing */}
            <div className="text-[10px] font-medium text-slate-800 leading-snug mt-1 text-center">
              <p>संभाजीनगर, कोरोची. ता. हातकणंगले, जि. कोल्हापूर. मो. 7837731111</p>
              <p className="mt-0.5">वेळ : सकाळी १०.०० ते दुपारी १.००, सायं. ६.०० ते रात्री ९.००</p>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-slate-300 mt-1"></div>
          </div>

          {/* Patient Details Section */}
          <div className="border-y border-slate-300 py-2 my-1 flex justify-between items-center text-[10px] font-medium">
            <div className="font-bold text-slate-800">
              {prescription.patientId || "ID"}: {(patient?.name || "Patient").toUpperCase()} ({patient?.age ? `${patient.age}y` : ""}, {patient?.gender || ""}) - {patient?.phone || ""}
            </div>
            <div className="text-right whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
              <span className="font-bold text-slate-700">Date & Time :</span> {formattedDateTime}
            </div>
          </div>

          {/* Prescription Content / Medicine Table */}
          <div className="pt-2 min-h-[300px]">
            <div className="text-xl font-serif font-black italic mb-2 text-slate-800">Rx</div>

            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-300 text-slate-800">
                  <th className="pb-1 font-bold w-[45%] pl-1">Medicine</th>
                  <th className="pb-1 font-bold w-[40%] text-center">Timing</th>
                  <th className="pb-1 font-bold w-[40%] text-center"> Freq.</th>
                  <th className="pb-1 font-bold w-[15%] text-center">Dosage</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, idx) => (
                  <tr key={idx} className="border-b border-slate-200/60 last:border-0">
                    <td className="py-2 pr-1 align-top pl-1">
                      <div className="flex gap-1.5">
                        <span className="font-bold">{idx + 1})</span>
                        <div>
                          <div className="font-bold uppercase text-slate-900">{med.medicineName || med.name}</div>
                          <div className="text-[8px] text-slate-500 mt-0.5">Composition : {med.instructions || "..."}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-1 align-top text-center text-slate-700">
                      {med.foodInstruction || med.food ? `${translateToMarathi(med.foodInstruction || med.food)} ` : ""}
                    </td>
                    <td className="py-2 px-1 align-top text-center text-slate-700">
                      <span className="font-bold">{translateToMarathi(med.frequency)}</span>
                      {/* {med.duration ? ` - ${translateToMarathi(med.duration)}` : ""} */}
                    </td>
                    <td className="py-2 pl-1 align-top text-center font-medium">
                      {med.dosage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doctor Signature Area */}
          <div className="pt-8 flex justify-end">
            <div className="text-center w-36">
              <div className="h-10 flex items-end justify-center mb-1">
                {/* Signature placeholder */}
                <span className="font-['Brush_Script_MT',_cursive] text-lg text-slate-600 opacity-70">SBK</span>
              </div>
              <div className="border-t border-slate-300 mx-auto w-full mb-1"></div>
              <p className="text-[10px] font-bold text-slate-800">डॉ. एस. बी. कांबळे</p>
              <p className="text-[9px] font-bold text-slate-700">(बी.एच.एम.एस., सी.सी.एम.पी.)</p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-8 pt-4 pb-2 text-center flex flex-col items-center justify-center">
            <p className="text-[7px] text-slate-400">Powered by HealthPlix EMR, www.healthplix.com</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: "#B22222" }}>
              Please do not Substitute.
            </p>
            <div className="w-full h-px bg-[#008000] mt-2 mb-2 opacity-50"></div>
            <p className="text-[11px] font-semibold text-slate-700">
              वरील औषधे डॉक्टरांना दाखवून घ्यावीत.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
