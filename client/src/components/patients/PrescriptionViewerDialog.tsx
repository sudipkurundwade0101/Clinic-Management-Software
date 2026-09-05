import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PrescriptionPreview } from "@/components/prescriptions/PrescriptionPreview";
import { defaultDoctorInfo } from "@/data/doctorInfo";
import type { Prescription } from "@/types/prescription";
import type { Patient } from "@/types/patient";

export function PrescriptionViewerDialog({
  prescription,
  patient,
  close,
  onEdit,
  onDelete,
}: {
  prescription: Prescription | null;
  patient?: Patient;
  close: () => void;
  onEdit: (p: Prescription) => void;
  onDelete: (p: Prescription) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!prescription) return null;

  return (
    <>
      <Dialog open={!!prescription} onOpenChange={close}>
        <DialogContent className="max-h-[92vh] w-[95vw] max-w-7xl overflow-auto p-4 sm:p-6">
          <DialogHeader className="no-print">
            <DialogTitle className="flex items-center justify-between">
              <span>Prescription Details</span>
              <Badge variant="outline" className="font-mono text-xs">
                {prescription.id}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <PrescriptionPreview
            prescription={prescription}
            patient={patient}
            doctor={defaultDoctorInfo}
            onEdit={() => {
              close();
              onEdit(prescription);
            }}
            onDelete={() => setConfirmDelete(true)}
            showActions={true}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prescription?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The prescription record will be removed from history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                close();
                onDelete(prescription);
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
