import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { atom } from "jotai";

interface LocalStorageStore {
    sidebarMenuDropdown: boolean;
    sidebarLocationsDropdown: boolean;
    toggleSidebarMenuDropdown: () => void;
    toggleSidebarLocationsDropdown: () => void;
}

export const useLocalStorageStore = create<LocalStorageStore>()(
    persist(
        (set) => ({
            sidebarMenuDropdown: false,
            sidebarLocationsDropdown: false,
            toggleSidebarMenuDropdown: () => set((state) =>({ sidebarMenuDropdown: !state.sidebarMenuDropdown })),
            toggleSidebarLocationsDropdown: () => set((state) =>({ sidebarLocationsDropdown: !state.sidebarLocationsDropdown })),
        }),
        {
            name: "global", 
            storage: createJSONStorage(() => sessionStorage),
        },
    )
);

// Global state with Jotai
export const displayCardAtom = atom(false);
export const cardTransitionAtom = atom(false);

// Global card state
export const cardIdAtom = atom(0);
export const cardTitleAtom = atom("");
export const createdUserNameAtom = atom("");
export const createdUserImageAtom = atom("");
export const createdAtAtom = atom("");
export const updatedUserNameAtom = atom("");
export const updatedUserImageAtom = atom("");
export const updatedAtAtom = atom("");

// Global menu state
export const menuTypeAtom = atom("");
export const priceLevelAtom = atom("");

// Global menu availability state
export const dayAtom = atom("");
export const availableAtom = atom("");
export const startTimeAtom = atom("");
export const endTimeAtom = atom("");

// Global menu location mapping state
export const searchLocationsAtom = atom("");