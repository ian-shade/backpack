import { create } from 'zustand';
import type {
  Job,
  JobEntryDraft,
  SelectedMaterial,
  SelectedPlant,
  SelectedVehicle,
} from '../../domain/entities';
import { jsonJobsRepo } from '../../data/repositories/jsonRepos';

interface JobsState {
  jobs: Job[];
  loaded: boolean;
  draft?: JobEntryDraft;
  submittedDraft?: JobEntryDraft; // the most recent submission, for the confirmation screen

  load: () => Promise<void>;
  startDraft: (jobId: string, arrivalTime: string) => void;
  setDeparture: (time: string) => void;

  togglePlant: (plantId: string, defaultDuration?: number) => void;
  setPlantDuration: (plantId: string, hours: number) => void;

  addMaterial: (materialId: string) => void;
  removeMaterial: (materialId: string) => void;
  setMaterialQty: (materialId: string, qty: number) => void;

  toggleVehicle: (vehicleId: string, arrivalTime?: string) => void;

  setNotes: (notes: string) => void;
  clearDraft: () => void;
  submitDraft: () => void;
}

const emptyDraft = (jobId: string, arrivalTime: string): JobEntryDraft => ({
  jobId,
  arrivalTime,
  departureTime: undefined,
  plant: [],
  materials: [],
  vehicles: [],
  notes: '',
});

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  loaded: false,
  draft: undefined,
  submittedDraft: undefined,

  load: async () => {
    if (get().loaded) return;
    const jobs = await jsonJobsRepo.list();
    set({ jobs, loaded: true });
  },

  startDraft: (jobId, arrivalTime) => {
    set({ draft: emptyDraft(jobId, arrivalTime) });
  },

  setDeparture: (time) => {
    const draft = get().draft;
    if (!draft) return;
    set({ draft: { ...draft, departureTime: time } });
  },

  togglePlant: (plantId, defaultDuration = 1) => {
    const draft = get().draft;
    if (!draft) return;
    const exists = draft.plant.some((p) => p.plantId === plantId);
    const plant: SelectedPlant[] = exists
      ? draft.plant.filter((p) => p.plantId !== plantId)
      : [...draft.plant, { plantId, durationHours: defaultDuration }];
    set({ draft: { ...draft, plant } });
  },

  setPlantDuration: (plantId, hours) => {
    const draft = get().draft;
    if (!draft) return;
    const clamped = Math.max(0.5, Math.round(hours * 2) / 2); // half-hour steps
    const plant = draft.plant.map((p) =>
      p.plantId === plantId ? { ...p, durationHours: clamped } : p,
    );
    set({ draft: { ...draft, plant } });
  },

  addMaterial: (materialId) => {
    const draft = get().draft;
    if (!draft) return;
    if (draft.materials.some((m) => m.materialId === materialId)) return;
    const materials: SelectedMaterial[] = [
      ...draft.materials,
      { materialId, quantity: 1 },
    ];
    set({ draft: { ...draft, materials } });
  },

  removeMaterial: (materialId) => {
    const draft = get().draft;
    if (!draft) return;
    set({
      draft: {
        ...draft,
        materials: draft.materials.filter((m) => m.materialId !== materialId),
      },
    });
  },

  setMaterialQty: (materialId, qty) => {
    const draft = get().draft;
    if (!draft) return;
    const clamped = Math.max(1, Math.round(qty));
    const materials = draft.materials.map((m) =>
      m.materialId === materialId ? { ...m, quantity: clamped } : m,
    );
    set({ draft: { ...draft, materials } });
  },

  toggleVehicle: (vehicleId, arrivalTime) => {
    const draft = get().draft;
    if (!draft) return;
    const exists = draft.vehicles.some((v) => v.vehicleId === vehicleId);
    const vehicles: SelectedVehicle[] = exists
      ? draft.vehicles.filter((v) => v.vehicleId !== vehicleId)
      : [...draft.vehicles, { vehicleId, arrivalTime }];
    set({ draft: { ...draft, vehicles } });
  },

  setNotes: (notes) => {
    const draft = get().draft;
    if (!draft) return;
    set({ draft: { ...draft, notes } });
  },

  clearDraft: () => set({ draft: undefined }),

  submitDraft: () => {
    const draft = get().draft;
    if (!draft) return;
    // Snapshot the draft so the confirmation screen can render after we clear
    set({ submittedDraft: draft, draft: undefined });
  },
}));
