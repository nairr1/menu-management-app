import React, { useState } from "react";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { 
    awardOneAtom,
    awardThreeAtom,
    awardTwoAtom,
    cardIdAtom, 
    cardTitleAtom, 
    cardTransitionAtom, 
    checkAwardOneAtom, 
    checkAwardThreeAtom, 
    checkAwardTwoAtom, 
    checkCardTitleAtom, 
    checkDisplayNameAtom, 
    checkItemCategoryAtom, 
    checkItemChoiceInfoAtom, 
    checkItemChoiceRequiredAtom, 
    checkItemChoiceSelectionsAtom, 
    checkItemClassAtom, 
    checkItemEnergyAtom, 
    checkItemImgAtom, 
    checkItemInfoAtom, 
    checkMenuTypeAtom, 
    checkPriceLevelAtom, 
    checkPriceOneAtom, 
    checkPriceThreeAtom, 
    checkPriceTwoAtom, 
    checkRedeemOneAtom, 
    checkRedeemThreeAtom, 
    checkRedeemTwoAtom, 
    confirmChangesAnimationAtom, 
    confirmChangesAtom, 
    displayCardAtom, 
    displayLoadingToastAtom, 
    displayNameAtom, 
    expandCardAtom, 
    itemCategoryAtom, 
    itemCategoryIdAtom, 
    itemChoiceInfoAtom, 
    itemChoiceRequiredAtom, 
    itemChoiceSelectionsAtom, 
    itemClassAtom, 
    itemClassIdAtom, 
    itemEnergyAtom, 
    itemImgAtom, 
    itemInfoAtom, 
    loadingToastTextAtom,
    menuTypeAtom,
    newCardAtom,
    priceLevelAtom,
    priceOneAtom,
    priceThreeAtom,
    priceTwoAtom,
    redeemOneAtom,
    redeemThreeAtom,
    redeemTwoAtom,
} from "~/store/store";

import { api } from "~/utils/api";

import { BsCheckAll, BsTrash } from "react-icons/bs";
import { CgArrowsExpandLeft } from "react-icons/cg";
import { RxDoubleArrowRight } from "react-icons/rx";
import { IoDuplicateOutline } from "react-icons/io5";

const AdminCardFunctions = () => {
    const [displayDeletePrompt, setDisplayDeletePrompt] = useState(false);

    const [expandCard, setExpandCard] = useAtom(expandCardAtom);

    const [cardId, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [displayName] = useAtom(displayNameAtom);

    const [checkCardTitle, setCheckCardTitle] = useAtom(checkCardTitleAtom);
    const [checkDisplayName] = useAtom(checkDisplayNameAtom);

    const [menuType] = useAtom(menuTypeAtom);
    const [priceLevel] = useAtom(priceLevelAtom);
    const [checkMenuType] = useAtom(checkMenuTypeAtom);
    const [checkPriceLevel] = useAtom(checkPriceLevelAtom);

    const [itemImg, setItemImg] = useAtom(itemImgAtom);
    const [itemEnergy, setItemEnergy] = useAtom(itemEnergyAtom);
    const [itemCategory, setItemCategory] = useAtom(itemCategoryAtom);
    const [, setItemCategoryId] = useAtom(itemCategoryIdAtom);
    const [itemClass, setItemClass] = useAtom(itemClassAtom);
    const [, setItemClassId] = useAtom(itemClassIdAtom);
    const [itemInfo] = useAtom(itemInfoAtom);
    const [priceOne] = useAtom(priceOneAtom);
    const [priceTwo] = useAtom(priceTwoAtom);
    const [priceThree] = useAtom(priceThreeAtom);
    const [awardOne] = useAtom(awardOneAtom);
    const [awardTwo] = useAtom(awardTwoAtom);
    const [awardThree] = useAtom(awardThreeAtom);
    const [redeemOne] = useAtom(redeemOneAtom);
    const [redeemTwo] = useAtom(redeemTwoAtom);
    const [redeemThree] = useAtom(redeemThreeAtom);
    const [itemChoiceSelections] = useAtom(itemChoiceSelectionsAtom);
    const [itemChoiceRequired] = useAtom(itemChoiceRequiredAtom);
    const [itemChoiceInfo] = useAtom(itemChoiceInfoAtom);

    const [checkItemCategory] = useAtom(checkItemCategoryAtom)
    const [checkItemImg] = useAtom(checkItemImgAtom)
    const [checkItemEnergy] = useAtom(checkItemEnergyAtom);
    const [checkItemClass] = useAtom(checkItemClassAtom);
    const [checkItemInfo] = useAtom(checkItemInfoAtom);
    const [checkPriceOne] = useAtom(checkPriceOneAtom);
    const [checkPriceTwo] = useAtom(checkPriceTwoAtom);
    const [checkPriceThree] = useAtom(checkPriceThreeAtom);
    const [checkAwardOne] = useAtom(checkAwardOneAtom);
    const [checkAwardTwo] = useAtom(checkAwardTwoAtom);
    const [checkAwardThree] = useAtom(checkAwardThreeAtom);
    const [checkRedeemOne] = useAtom(checkRedeemOneAtom);
    const [checkRedeemTwo] = useAtom(checkRedeemTwoAtom);
    const [checkRedeemThree] = useAtom(checkRedeemThreeAtom);
    const [checkItemChoiceSelections] = useAtom(checkItemChoiceSelectionsAtom);
    const [checkItemChoiceRequired] = useAtom(checkItemChoiceRequiredAtom);
    const [checkItemChoiceInfo] = useAtom(checkItemChoiceInfoAtom);

    const [, setNewCard] = useAtom(newCardAtom);
    const [, setDisplayCard] = useAtom(displayCardAtom);
    const [, setCardTransition] = useAtom(cardTransitionAtom);
    const [, setConfirmChanges] = useAtom(confirmChangesAtom)
    const [, setConfirmChangesAnimation] = useAtom(confirmChangesAnimationAtom);

    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const ctx = api.useContext();

    const router = useRouter();

    const { mutate: deleteMenu } = api.menu.deleteMenu.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDisplayDeletePrompt(false);
            void ctx.menu.getAllMenus.invalidate();
            void ctx.menu.getLatestMenuPosition.invalidate();
        },
    })

    const { mutate: deleteMenuCategory } = api.menuCategory.deleteMenuCategory.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDisplayDeletePrompt(false);
            void ctx.menuCategory.getAllMenuCategories.invalidate();
            void ctx.menuCategory.getLatestMenuCategoryPosition.invalidate();
        },
    });

    const { mutate: deleteItemChoice } = api.itemChoice.deleteItemChoice.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDisplayDeletePrompt(false);
            void ctx.itemChoice.getAllItemChoices.invalidate();
            void ctx.itemChoice.getLatestItemChoicePosition.invalidate();
        },
    });

    const { mutate: deleteItemCategory } = api.itemCategory.deleteItemCategory.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDisplayDeletePrompt(false);
            void ctx.itemCategory.getAllItemCategories.invalidate();
        },
    });

    const { mutate: deleteItemClass } = api.itemClass.deleteItemClass.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDisplayDeletePrompt(false);
            void ctx.itemClass.getAllItemClasses.invalidate();
            void ctx.itemClass.getLatestItemClassPosition.invalidate();
        },
    });

    function deleteCard(path: string) {
        switch(path) {
            case("/admin/menus"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName || checkMenuType !== menuType || checkPriceLevel !== priceLevel) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    deleteMenu({ id: cardId });
                    setCardTransition(false);
                    setCardId(0);
                    setConfirmChanges(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText(`Deleting Menu ID: ${cardId}`);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;

            case("/admin/menu-categories"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    deleteMenuCategory({ id: cardId });
                    setCardTransition(false);
                    setCardId(0);
                    setConfirmChanges(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText(`Deleting Menu Category ID: ${cardId}`);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;

            case("/admin/item-choices"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName || checkItemChoiceInfo !== itemChoiceInfo || checkItemChoiceRequired !== itemChoiceRequired || itemChoiceSelections !== checkItemChoiceSelections) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    deleteItemChoice({ id: cardId });
                    setCardTransition(false);
                    setCardId(0);
                    setConfirmChanges(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText(`Deleting Item Choice ID: ${cardId}`);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;

            case("/admin/item-categories"):
                if (checkCardTitle !== cardTitle) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    deleteItemCategory({ id: cardId });
                    setCardTransition(false);
                    setCardId(0);
                    setConfirmChanges(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText(`Deleting Item Category ID: ${cardId}`);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;

            case("/admin/item-classes"):
                if (checkCardTitle !== cardTitle) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    deleteItemClass({ id: cardId });
                    setCardTransition(false);
                    setCardId(0);
                    setConfirmChanges(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText(`Deleting Item Class ID: ${cardId}`);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;
        } 
    }

    function closeAdminCard(path: string) {
        switch(path) {
            case("/admin/menus"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName || checkMenuType !== menuType || checkPriceLevel !== priceLevel) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    setCardTransition(false);
                    setConfirmChanges(false);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;

            case("/admin/menu-categories"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    setCardTransition(false);
                    setConfirmChanges(false);
                    setDisplayDeletePrompt(false);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;

            case("/admin/items"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName || itemCategory !== checkItemCategory || itemImg !== checkItemImg || itemEnergy !== checkItemEnergy || itemClass !== checkItemClass || itemInfo !== checkItemInfo || priceOne !== checkPriceOne || priceTwo !== checkPriceTwo || priceThree !== checkPriceThree || awardOne !== checkAwardOne || awardTwo !== checkAwardTwo || awardThree !== checkAwardThree || redeemOne !== checkRedeemOne || redeemTwo !== checkRedeemTwo || redeemThree !== checkRedeemThree) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    setCardTransition(false);
                    setConfirmChanges(false);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                    }, 750);
                }
                break;
            
            case("/admin/item-choices"):
                if (checkCardTitle !== cardTitle || checkDisplayName !== displayName || checkItemChoiceInfo !== itemChoiceInfo || checkItemChoiceRequired !== itemChoiceRequired || itemChoiceSelections !== checkItemChoiceSelections) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    setCardTransition(false);
                    setConfirmChanges(false);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                        setNewCard(false);
                    }, 750);
                }

            case("/admin/item-categories"):
                if (checkCardTitle !== cardTitle) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    setCardTransition(false);
                    setConfirmChanges(false);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                        setNewCard(false);
                    }, 750);
                }

            case("/admin/item-classes"):
                if (checkCardTitle !== cardTitle) {
                    setConfirmChanges(true);
        
                    setTimeout(() => {
                        setConfirmChangesAnimation(true);
                    }, 100);
        
                } else {
                    setCardTransition(false);
                    setConfirmChanges(false);
            
                    setTimeout(() => {
                        setDisplayCard(false);
                        setNewCard(false);
                    }, 750);
                }
        } 
    }

    function handleNewFromClick() {
        setNewCard(true);
        setCardTitle("");
        setCheckCardTitle("");
    }

    return (
        <div className="sticky dark:bg-[#1b1b1c] top-0 z-30 bg-white flex space-x-2 py-2 px-3">
            <RxDoubleArrowRight 
                className="p-1 text-[1.5rem] cursor-pointer text-zinc-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md" 
                onClick={(() => closeAdminCard(router.pathname))}
            />

            <CgArrowsExpandLeft 
                className={`p-1 text-[1.5rem] cursor-pointer text-zinc-500 rounded-md ${expandCard ? "bg-neutral-20 dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`} 
                onClick={(() => setExpandCard(!expandCard))}
            />

            <IoDuplicateOutline 
                className="p-1 text-[1.5rem] cursor-pointer text-zinc-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md" 
                onClick={handleNewFromClick}
            />

            <BsTrash 
                className={`p-1 text-[1.5rem] cursor-pointer text-zinc-500 rounded-md ${displayDeletePrompt ? "bg-neutral-200 dark:bg-neutral-800" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`} 
                onClick={(() => setDisplayDeletePrompt(!displayDeletePrompt))}
            />

            {displayDeletePrompt && (
                <div    
                    className={`flex items-center space-x-1 p-1 text-[1.5rem] cursor-pointer text-zinc-500 rounded-md group hover:bg-neutral-100 dark:hover:bg-neutral-800`} 
                    onClick={(() => deleteCard(router.pathname))}
                >
                    <p className="text-xs">Are you sure?</p>

                    <BsCheckAll className="text-sm group-hover:text-green-500" />
                </div>
            )}
        </div>
    )
}

export default AdminCardFunctions;