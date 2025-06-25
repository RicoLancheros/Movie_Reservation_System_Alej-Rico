import { create } from 'zustand';

interface UIState {
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
}

interface UIActions {
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // State
  authModalOpen: false,
  authModalTab: 'login',

  // Actions
  openAuthModal: (tab = 'login') => set({ 
    authModalOpen: true, 
    authModalTab: tab 
  }),
  
  closeAuthModal: () => set({ authModalOpen: false }),
  
  setAuthModalTab: (tab) => set({ authModalTab: tab }),
})); 