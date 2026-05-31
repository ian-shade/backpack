/**
 * Domain entities — pure data models, framework-agnostic.
 * Aligned with FR-OP, FR-QS, FR-CC identifiers from Requirements Spec v1.0.
 */

export type JobStatus = 'live' | 'queued' | 'done' | 'pending' | 'approved' | 'flagged';

export interface Job {
  id: string;          // e.g. "JOB-2026-04812"
  title: string;
  location: string;
  road: string;
  status: JobStatus;
  arrivedAt?: string;  // ISO; undefined until logged
  vehiclesCount?: number;
  etaTime?: string;    // "11:30"
  durationMins?: number;
}

export interface PlantItem {
  id: string;
  name: string;
  ratePerHour: number; // £/hr
}

export interface MaterialItem {
  id: string;
  name: string;
  unitCost: number;    // £
  unit: string;        // "each", "metre"
}

export interface VehicleItem {
  id: string;
  name: string;
  dailyRate: number;   // £/day
}

export interface OperativeRole {
  id: string;
  name: string;
  hourlyRate: number;  // £/hr
}

export interface Operative {
  id: string;
  initials: string;
  fullName: string;
  roleId: string;
}

/* ---------- Form working state (in-progress entry) ---------- */

export interface SelectedPlant {
  plantId: string;
  durationHours: number;
}

export interface SelectedMaterial {
  materialId: string;
  quantity: number;
}

export interface SelectedVehicle {
  vehicleId: string;
  arrivalTime?: string;
}

export interface JobEntryDraft {
  jobId: string;
  arrivalTime?: string;    // "08:14"
  departureTime?: string;  // "09:56" or undefined
  plant: SelectedPlant[];
  materials: SelectedMaterial[];
  vehicles: SelectedVehicle[];
  notes: string;
}

/* ---------- Cost breakdown (FR-CC-01..05) ---------- */

export interface CostBreakdown {
  labour: number;
  plant: number;
  materials: number;
  vehicle: number;
  total: number;
  hoursOnSite: number;
  rateCardVersion: string;
}
