/**
 * JSON-backed repositories. Async signatures preserved so swapping to
 * Firestore later is a drop-in change.
 */

import jobsJson from '../json/jobs.json';
import plantJson from '../json/plant.json';
import materialsJson from '../json/materials.json';
import vehiclesJson from '../json/vehicles.json';
import operativesJson from '../json/operatives.json';

import type {
  Job,
  MaterialItem,
  Operative,
  OperativeRole,
  PlantItem,
  VehicleItem,
} from '../../domain/entities';
import type {
  CatalogRepository,
  JobsRepository,
  OperativeRepository,
} from './types';

export const jsonJobsRepo: JobsRepository = {
  list: async () => jobsJson as Job[],
  findById: async (id) => (jobsJson as Job[]).find((j) => j.id === id),
};

export const jsonCatalogRepo: CatalogRepository = {
  plant: async () => plantJson as PlantItem[],
  materials: async () => materialsJson as MaterialItem[],
  vehicles: async () => vehiclesJson as VehicleItem[],
};

export const jsonOperativeRepo: OperativeRepository = {
  current: async () => (operativesJson.operatives as Operative[])[0],
  roleFor: async (op) => {
    const role = (operativesJson.roles as OperativeRole[]).find(
      (r) => r.id === op.roleId,
    );
    if (!role) throw new Error(`Role not found for operative ${op.id}`);
    return role;
  },
};
