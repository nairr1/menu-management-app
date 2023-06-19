import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { atom } from "jotai";

interface LocalStorageStore {
    sidebarMenuDropdown: boolean;
    sidebarLocationsDropdown: boolean;
    sidebarConfigurationDropdown: boolean;
    toggleSidebarMenuDropdown: () => void;
    toggleSidebarLocationsDropdown: () => void;
    toggleSidebarConfigurationDropdown: () => void;
}

export const useLocalStorageStore = create<LocalStorageStore>()(
    persist(
        (set) => ({
            sidebarMenuDropdown: false,
            sidebarLocationsDropdown: false,
            sidebarConfigurationDropdown: false,
            toggleSidebarMenuDropdown: () => set((state) => ({ sidebarMenuDropdown: !state.sidebarMenuDropdown })),
            toggleSidebarLocationsDropdown: () => set((state) => ({ sidebarLocationsDropdown: !state.sidebarLocationsDropdown })),
            toggleSidebarConfigurationDropdown: () => set((state) => ({ sidebarConfigurationDropdown: !state.sidebarConfigurationDropdown })),
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
export const displayErrorAtom = atom(false);
export const errorTextAtom = atom([""]);
export const displayLoadingToastAtom = atom(false);
export const loadingToastTextAtom = atom("");

// Global card state
export const uuidAtom = atom("");
export const newCardAtom = atom(false);
export const cardIdAtom = atom(0);
export const expandCardAtom = atom(false);
export const cardTitleAtom = atom("");
export const displayNameAtom = atom("")
export const checkCardTitleAtom = atom("");
export const checkDisplayNameAtom = atom("");
export const createdUserNameAtom = atom("");
export const createdUserImageAtom = atom("");
export const createdAtAtom = atom("");
export const updatedUserNameAtom = atom("");
export const updatedUserImageAtom = atom("");
export const updatedAtAtom = atom("");
export const confirmChangesAtom = atom(false);
export const confirmChangesAnimationAtom = atom(false);

// Global menu state
export const menuTypeAtom = atom("");
export const priceLevelAtom = atom("");
export const checkMenuTypeAtom = atom("");
export const checkPriceLevelAtom = atom("");

// GLobal menu category state
export const menuCategoryInfoAtom = atom("");
export const checkMenuCategoryInfoAtom = atom("");

// Global availability state
export const dayAtom = atom("");
export const startTimeAtom = atom("");
export const endTimeAtom = atom("");

// Global menu location mapping state
export const searchLocationsAtom = atom("");

// Global item state
export const itemCategoryAtom = atom("")
export const itemCategoryIdAtom = atom("");
export const itemImgAtom = atom("")
export const itemInfoAtom = atom("");
export const priceOneAtom = atom("");
export const priceTwoAtom = atom("");
export const priceThreeAtom = atom("");
export const awardOneAtom = atom("");
export const awardTwoAtom = atom("");
export const awardThreeAtom = atom("");
export const redeemOneAtom = atom("");
export const redeemTwoAtom = atom("");
export const redeemThreeAtom = atom("");
export const itemEnergyAtom = atom("");
export const itemClassAtom = atom("");
export const itemClassIdAtom = atom("");

export const checkItemCategoryAtom = atom("")
export const checkItemImgAtom = atom("")
export const checkItemInfoAtom = atom("");
export const checkPriceOneAtom = atom("");
export const checkPriceTwoAtom = atom("");
export const checkPriceThreeAtom = atom("");
export const checkAwardOneAtom = atom("");
export const checkAwardTwoAtom = atom("");
export const checkAwardThreeAtom = atom("");
export const checkRedeemOneAtom = atom("");
export const checkRedeemTwoAtom = atom("");
export const checkRedeemThreeAtom = atom("");
export const checkItemEnergyAtom = atom("");
export const checkItemClassAtom = atom("");

// Global item choices state
export const itemChoiceSelectionsAtom = atom("");
export const itemChoiceRequiredAtom = atom("");
export const itemChoiceInfoAtom = atom("");

export const checkItemChoiceSelectionsAtom = atom("");
export const checkItemChoiceRequiredAtom = atom("");
export const checkItemChoiceInfoAtom = atom("");
