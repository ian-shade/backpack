import { create } from 'zustand';
import type { Operative, OperativeRole } from '../../domain/entities';
import { jsonOperativeRepo } from '../../data/repositories/jsonRepos';

interface AuthState {
  isAuthenticated: boolean;
  operative?: Operative;
  role?: OperativeRole;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  operative: undefined,
  role: undefined,

  signIn: async () => {
    const operative = await jsonOperativeRepo.current();
    const role = await jsonOperativeRepo.roleFor(operative);
    set({ isAuthenticated: true, operative, role });
  },

  signOut: () => set({ isAuthenticated: false, operative: undefined, role: undefined }),
}));
