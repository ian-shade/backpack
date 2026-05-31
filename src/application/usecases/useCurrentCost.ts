/**
 * useCurrentCost — derives the live CostBreakdown from the active draft
 * by composing the auth, catalog, and jobs stores with the cost engine.
 *
 * This is the "use case" that ties domain logic to UI state.
 */

import { useMemo } from 'react';
import { calculateCost } from '../../domain/costEngine';
import type { CostBreakdown, JobEntryDraft } from '../../domain/entities';
import { useAuthStore } from '../stores/authStore';
import { useCatalogStore } from '../stores/catalogStore';
import { useJobsStore } from '../stores/jobsStore';

export function useCurrentCost(): CostBreakdown | undefined {
  const draft = useJobsStore((s) => s.draft);
  return useCostFor(draft);
}

export function useSubmittedCost(): CostBreakdown | undefined {
  const submitted = useJobsStore((s) => s.submittedDraft);
  return useCostFor(submitted);
}

function useCostFor(draft?: JobEntryDraft): CostBreakdown | undefined {
  const role = useAuthStore((s) => s.role);
  const plant = useCatalogStore((s) => s.plant);
  const materials = useCatalogStore((s) => s.materials);
  const vehicles = useCatalogStore((s) => s.vehicles);

  return useMemo(() => {
    if (!draft || !role) return undefined;
    return calculateCost({
      draft,
      role,
      plantCatalog: plant,
      materialsCatalog: materials,
      vehiclesCatalog: vehicles,
    });
  }, [draft, role, plant, materials, vehicles]);
}
