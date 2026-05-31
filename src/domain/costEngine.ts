/**
 * Cost Calculation Engine — implements FR-CC-01..05.
 * Pure functions. Framework-agnostic. Unit-testable in isolation.
 *
 *   labour    = hoursOnSite × operative.hourlyRate                 (FR-CC-01)
 *   plant     = Σ plant.ratePerHour × duration                     (FR-CC-02)
 *   materials = Σ material.unitCost × quantity                     (FR-CC-03)
 *   vehicle   = Σ vehicle.dailyRate                                (FR-CC-04)
 *   total     = labour + plant + materials + vehicle               (FR-CC-05)
 */

import type {
  CostBreakdown,
  JobEntryDraft,
  MaterialItem,
  OperativeRole,
  PlantItem,
  VehicleItem,
} from './entities';

const RATE_CARD_VERSION = '2026-Q2';

/** Round to 2 decimal places (currency safe enough for prototype). */
const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Convert two "HH:MM" strings to hours-on-site (returns 0 if invalid). */
export function hoursBetween(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if ([sh, sm, eh, em].some(isNaN)) return 0;
  const mins = eh * 60 + em - (sh * 60 + sm);
  return mins > 0 ? mins / 60 : 0;
}

export interface CostInputs {
  draft: JobEntryDraft;
  role: OperativeRole;
  plantCatalog: PlantItem[];
  materialsCatalog: MaterialItem[];
  vehiclesCatalog: VehicleItem[];
}

export function calculateCost(inputs: CostInputs): CostBreakdown {
  const { draft, role, plantCatalog, materialsCatalog, vehiclesCatalog } = inputs;

  const hoursOnSite = hoursBetween(draft.arrivalTime, draft.departureTime);

  // FR-CC-01
  const labour = hoursOnSite * role.hourlyRate;

  // FR-CC-02
  const plant = draft.plant.reduce((sum, sel) => {
    const item = plantCatalog.find((p) => p.id === sel.plantId);
    return sum + (item ? item.ratePerHour * sel.durationHours : 0);
  }, 0);

  // FR-CC-03
  const materials = draft.materials.reduce((sum, sel) => {
    const item = materialsCatalog.find((m) => m.id === sel.materialId);
    return sum + (item ? item.unitCost * sel.quantity : 0);
  }, 0);

  // FR-CC-04
  const vehicle = draft.vehicles.reduce((sum, sel) => {
    const item = vehiclesCatalog.find((v) => v.id === sel.vehicleId);
    return sum + (item ? item.dailyRate : 0);
  }, 0);

  // FR-CC-05
  const total = labour + plant + materials + vehicle;

  return {
    labour: round2(labour),
    plant: round2(plant),
    materials: round2(materials),
    vehicle: round2(vehicle),
    total: round2(total),
    hoursOnSite: round2(hoursOnSite),
    rateCardVersion: RATE_CARD_VERSION,
  };
}

/** Format £ with 2dp and thousands separator. */
export function formatGBP(n: number): string {
  return `£${n.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format a fractional-hours value as "1h 42m". */
export function formatHours(hrs: number): string {
  if (hrs <= 0) return '0m';
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}
