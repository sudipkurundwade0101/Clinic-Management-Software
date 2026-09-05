import React, { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  mockMedicinesList,
  FREQUENCY_OPTIONS,
  FOOD_OPTIONS,
  type MedicineSuggestion,
} from "@/data/medicines";
import type { PrescriptionMedicine } from "@/types/prescription";

interface MedicineFormProps {
  medicines: PrescriptionMedicine[];
  setMedicines: React.Dispatch<React.SetStateAction<PrescriptionMedicine[]>>;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({
  medicines,
  setMedicines,
}) => {
  // Autocomplete state for the currently active row
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const addEmptyMedicine = () => {
    const newMed: PrescriptionMedicine = {
      id: `MED-NEW-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      medicineName: "",
      dosage: "1 tablet",
      frequency: "1 - 0 - 1",
      duration: "",
      foodInstruction: "After food",
      instructions: "",
    };
    setMedicines((prev) => [...prev, newMed]);
    setActiveSearchIndex(medicines.length);
    setSearchQuery("");
  };

  const removeMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
    if (activeSearchIndex === index) {
      setActiveSearchIndex(null);
    }
  };

  const updateMedicine = (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const selectSuggestion = (index: number, suggestion: MedicineSuggestion) => {
    setMedicines((prev) =>
      prev.map((med, i) =>
        i === index
          ? {
              ...med,
              medicineName: suggestion.name,
              dosage: suggestion.dosage,
              frequency: suggestion.frequency,
              duration: suggestion.duration,
              foodInstruction: suggestion.food,
              instructions: suggestion.instructions,
            }
          : med
      )
    );
    setActiveSearchIndex(null);
    setSearchQuery("");
  };

  const filteredSuggestions = searchQuery.trim()
    ? mockMedicinesList.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockMedicinesList.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2">
            Prescribed Medicines
            <Badge variant="outline" className="text-xs font-mono font-normal">
              {medicines.length} {medicines.length === 1 ? "medicine" : "medicines"}
            </Badge>
          </h3>
          <p className="text-xs text-muted-foreground">
            Search from common drugs for auto-filling or type any custom medicine.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={addEmptyMedicine}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="size-4" /> Add Medicine
        </Button>
      </div>

      {medicines.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center bg-muted/20">
          <p className="text-sm font-medium text-muted-foreground">
            No medicines added to this prescription yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            At least one medicine is required to save a valid prescription.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={addEmptyMedicine} className="gap-1.5">
            <Plus className="size-4" /> Add First Medicine
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {medicines.map((med, index) => (
            <div
              key={med.id}
              className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-4 relative transition-all"
            >
              {/* Header with index number and delete button */}
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Medicine #{index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedicine(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs"
                >
                  <Trash2 className="size-3.5 mr-1" /> Remove
                </Button>
              </div>

              {/* Medicine Name with Autocomplete Search */}
              <div className="space-y-1.5 relative">
                <Label className="text-xs font-medium">
                  Medicine Name & Strength <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    value={med.medicineName}
                    onChange={(e) => {
                      updateMedicine(index, "medicineName", e.target.value);
                      setSearchQuery(e.target.value);
                      setActiveSearchIndex(index);
                    }}
                    onFocus={() => {
                      setActiveSearchIndex(index);
                      setSearchQuery(med.medicineName);
                    }}
                    placeholder="e.g. Paracetamol 500mg, Cetirizine 10mg..."
                    className="font-medium pr-8"
                  />
                  <Search className="absolute right-2.5 top-2.5 size-4 text-muted-foreground/60 pointer-events-none" />
                </div>

                {/* Autocomplete Dropdown */}
                {activeSearchIndex === index && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setActiveSearchIndex(null)}
                    />
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border bg-popover text-popover-foreground shadow-lg p-1.5 space-y-1">
                      <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                        <span>SUGGESTED MEDICINES ({filteredSuggestions.length})</span>
                        <span className="text-[10px] font-normal italic">Click to autofill dosage</span>
                      </div>
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onMouseDown={() => selectSuggestion(index, suggestion)}
                            className="flex flex-col px-2.5 py-1.5 text-xs rounded-md hover:bg-muted cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {suggestion.name}
                              </span>
                              <Badge variant="outline" className="text-[10px] py-0">
                                {suggestion.category}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-0.5">
                              {suggestion.dosage} • {suggestion.frequency} • {suggestion.food}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-muted-foreground italic">
                          No standard match. Custom medicine will be saved: &quot;{searchQuery}&quot;
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Dosage, Frequency, & Food Timing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Dosage */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Dosage *</Label>
                  <Input
                    value={med.dosage}
                    onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                    placeholder="e.g. 1 tablet, 10ml, 2 puffs"
                    className="text-xs"
                  />
                </div>

                {/* Food Timing */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Timing / Food</Label>
                  <select
                    value={FOOD_OPTIONS.includes(med.foodInstruction as any) ? med.foodInstruction : "Custom"}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateMedicine(index, "foodInstruction", val === "Custom" ? "" : val);
                    }}
                    className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs focus:ring-1 focus:ring-ring outline-none"
                  >
                    {FOOD_OPTIONS.map((food) => (
                      <option key={food} value={food}>
                        {food}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frequency */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Frequency *</Label>
                  <div className="space-y-1">
                    <select
                      value={FREQUENCY_OPTIONS.includes(med.frequency as any) ? med.frequency : "Custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateMedicine(index, "frequency", val === "Custom" ? "" : val);
                      }}
                      className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs focus:ring-1 focus:ring-ring outline-none"
                    >
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                    {!FREQUENCY_OPTIONS.filter((f) => f !== "Custom").includes(med.frequency as any) && (
                      <Input
                        value={med.frequency}
                        onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                        placeholder="Type custom frequency..."
                        className="text-xs h-7 mt-1"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Medicine-specific instructions */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Specific Instructions (Optional)</Label>
                <Input
                  value={med.instructions || ""}
                  onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                  placeholder="e.g. Take with warm water, avoid milk, only if fever > 100°F..."
                  className="text-xs"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEmptyMedicine}
            className="w-full border-dashed gap-1.5 py-4"
          >
            <Plus className="size-4" /> Add Another Medicine
          </Button>
        </div>
      )}
    </div>
  );
};
