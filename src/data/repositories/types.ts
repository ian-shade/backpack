/**
 * Repository interfaces — the boundary between the app and its data source.
 *
 * Today these are backed by static JSON. To swap in Firestore later, implement
 * the same interfaces with Firebase SDK calls; nothing in the domain or
 * presentation layers needs to change.
 */

import type {
  Job,
  MaterialItem,
  Operative,
  OperativeRole,
  PlantItem,
  VehicleItem,
} from '../../domain/entities';

export interface JobsRepository {
  list(): Promise<Job[]>;
  findById(id: string): Promise<Job | undefined>;
}

export interface CatalogRepository {
  plant(): Promise<PlantItem[]>;
  materials(): Promise<MaterialItem[]>;
  vehicles(): Promise<VehicleItem[]>;
}

export interface OperativeRepository {
  current(): Promise<Operative>;
  roleFor(operative: Operative): Promise<OperativeRole>;
}
