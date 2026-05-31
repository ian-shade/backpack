import { create } from 'zustand';
import type {
  MaterialItem,
  PlantItem,
  VehicleItem,
} from '../../domain/entities';
import { jsonCatalogRepo } from '../../data/repositories/jsonRepos';

interface CatalogState {
  loaded: boolean;
  plant: PlantItem[];
  materials: MaterialItem[];
  vehicles: VehicleItem[];
  load: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  loaded: false,
  plant: [],
  materials: [],
  vehicles: [],

  load: async () => {
    if (get().loaded) return;
    const [plant, materials, vehicles] = await Promise.all([
      jsonCatalogRepo.plant(),
      jsonCatalogRepo.materials(),
      jsonCatalogRepo.vehicles(),
    ]);
    set({ plant, materials, vehicles, loaded: true });
  },
}));
