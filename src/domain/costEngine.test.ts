import { describe, expect, it } from 'vitest';
import { calculateCost, formatGBP, formatHours, hoursBetween } from './costEngine';
import type {
  JobEntryDraft,
  MaterialItem,
  OperativeRole,
  PlantItem,
  VehicleItem,
} from './entities';

const role: OperativeRole = { id: 'role-op', name: 'Operative', hourlyRate: 28 };

const plant: PlantItem[] = [
  { id: 'plt-001', name: 'Cherry Picker', ratePerHour: 45 },
  { id: 'plt-002', name: 'Generator', ratePerHour: 25 },
];

const materials: MaterialItem[] = [
  { id: 'mat-001', name: 'LED Lantern', unitCost: 85, unit: 'each' },
];

const vehicles: VehicleItem[] = [
  { id: 'veh-002', name: 'MEWP Vehicle', dailyRate: 150 },
];

const baseDraft: JobEntryDraft = {
  jobId: 'JOB-TEST-0001',
  arrivalTime: '08:14',
  departureTime: '09:56',
  plant: [],
  materials: [],
  vehicles: [],
  notes: '',
};

describe('hoursBetween', () => {
  it('computes duration in fractional hours', () => {
    expect(hoursBetween('08:00', '09:30')).toBe(1.5);
  });

  it('returns 0 when end precedes start (FR-OP-04 invariant)', () => {
    expect(hoursBetween('10:00', '09:00')).toBe(0);
  });

  it('returns 0 when either bound missing', () => {
    expect(hoursBetween(undefined, '09:00')).toBe(0);
    expect(hoursBetween('08:00', undefined)).toBe(0);
  });
});

describe('calculateCost', () => {
  it('FR-CC-01: labour = hours × rate', () => {
    const cost = calculateCost({
      draft: baseDraft,
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    // 08:14 → 09:56 is 1h 42m = 1.7h ; 1.7 × 28 = 47.60
    expect(cost.hoursOnSite).toBe(1.7);
    expect(cost.labour).toBe(47.6);
  });

  it('FR-CC-02: plant cost sums rate × duration', () => {
    const cost = calculateCost({
      draft: {
        ...baseDraft,
        plant: [
          { plantId: 'plt-001', durationHours: 1.5 }, // 45 × 1.5 = 67.50
          { plantId: 'plt-002', durationHours: 2.0 }, // 25 × 2.0 = 50.00
        ],
      },
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    expect(cost.plant).toBe(117.5);
  });

  it('FR-CC-03: materials cost sums unitCost × quantity', () => {
    const cost = calculateCost({
      draft: {
        ...baseDraft,
        materials: [{ materialId: 'mat-001', quantity: 2 }],
      },
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    expect(cost.materials).toBe(170);
  });

  it('FR-CC-04: vehicle cost sums daily rates', () => {
    const cost = calculateCost({
      draft: {
        ...baseDraft,
        vehicles: [{ vehicleId: 'veh-002' }],
      },
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    expect(cost.vehicle).toBe(150);
  });

  it('FR-CC-05: grand total sums all categories', () => {
    const cost = calculateCost({
      draft: {
        ...baseDraft,
        plant: [
          { plantId: 'plt-001', durationHours: 1.5 },
          { plantId: 'plt-002', durationHours: 2.0 },
        ],
        materials: [{ materialId: 'mat-001', quantity: 2 }],
        vehicles: [{ vehicleId: 'veh-002' }],
      },
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    // 47.60 + 117.50 + 170.00 + 150.00 = 485.10
    // (NB the example in the UI sketch used a 65.00 vehicle row;
    //  this test uses the actual MEWP daily rate of 150.)
    expect(cost.total).toBe(485.1);
  });

  it('ignores unknown plant/material/vehicle ids gracefully', () => {
    const cost = calculateCost({
      draft: {
        ...baseDraft,
        plant: [{ plantId: 'nope', durationHours: 1 }],
        materials: [{ materialId: 'nope', quantity: 5 }],
        vehicles: [{ vehicleId: 'nope' }],
      },
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    expect(cost.plant).toBe(0);
    expect(cost.materials).toBe(0);
    expect(cost.vehicle).toBe(0);
  });

  it('FR-CC-06: stamps the rate-card version on every breakdown', () => {
    const cost = calculateCost({
      draft: baseDraft,
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
    expect(cost.rateCardVersion).toBe('2026-Q2');
  });
});

describe('formatters', () => {
  it('formatGBP formats currency with 2 decimal places', () => {
    expect(formatGBP(400.1)).toBe('£400.10');
    expect(formatGBP(1234.5)).toBe('£1,234.50');
  });

  it('formatHours renders "1h 42m" style strings', () => {
    expect(formatHours(1.7)).toBe('1h 42m');
    expect(formatHours(2)).toBe('2h');
    expect(formatHours(0.5)).toBe('30m');
    expect(formatHours(0)).toBe('0m');
  });
});
