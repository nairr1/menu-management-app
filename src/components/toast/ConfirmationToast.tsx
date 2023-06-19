import React from "react";
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
    checkMenuCategoryInfoAtom, 
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
    displayErrorAtom, 
    displayLoadingToastAtom,
    displayNameAtom,
    errorTextAtom,
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
    menuCategoryInfoAtom,
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

import { BsCheckAll, BsExclamation } from "react-icons/bs";
import { getNewPosition } from "~/utils/getNewPosition";
import { formatMenuTypeforServer } from "~/utils/formatMenuTypeForServer";
import { formatPriceLevelForServer } from "~/utils/formatPriceLevelForServer";

const ConfirmationToast = () => {
    const [, setDisplayError] = useAtom(displayErrorAtom);
    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);
    const [, setErrorText] = useAtom(errorTextAtom);

    const [cardId, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [displayName, setDisplayName] = useAtom(displayNameAtom);

    const [menuType, setMenuType] = useAtom(menuTypeAtom);
    const [priceLevel, setPriceLevel] = useAtom(priceLevelAtom);
    const [itemImage, setItemImage] = useAtom(itemImgAtom);
    const [itemEnergy, setItemEnergy] = useAtom(itemEnergyAtom);
    const [itemCategory, setItemCategory] = useAtom(itemCategoryAtom);
    const [itemCategoryId] = useAtom(itemCategoryIdAtom);
    const [itemClass, setItemClass] = useAtom(itemClassAtom);
    const [itemClassId] = useAtom(itemClassIdAtom);
    const [itemInfo, setItemInfo] = useAtom(itemInfoAtom);
    const [priceOne, setPriceOne] = useAtom(priceOneAtom);
    const [priceTwo, setPriceTwo] = useAtom(priceTwoAtom);
    const [priceThree, setPriceThree] = useAtom(priceThreeAtom);
    const [awardOne, setAwardOne] = useAtom(awardOneAtom);
    const [awardTwo, setAwardTwo] = useAtom(awardTwoAtom);
    const [awardThree, setAwardThree] = useAtom(awardThreeAtom);
    const [redeemOne, setRedeemOne] = useAtom(redeemOneAtom);
    const [redeemTwo, setRedeemTwo] = useAtom(redeemTwoAtom);
    const [redeemThree, setRedeemThree] = useAtom(redeemThreeAtom);
    const [itemChoiceSelections, setItemChoiceSelections] = useAtom(itemChoiceSelectionsAtom);
    const [itemChoiceRequired, setItemChoiceRequired] = useAtom(itemChoiceRequiredAtom);
    const [itemChoiceInfo, setItemChoiceInfo] = useAtom(itemChoiceInfoAtom);
    const [menuCategoryInfo, setMenuCategoryInfo] = useAtom(menuCategoryInfoAtom);

    const [, setCheckCardTitle] = useAtom(checkCardTitleAtom);
    const [, setCheckDisplayName] = useAtom(checkDisplayNameAtom);
    const [, setCheckMenuType] = useAtom(checkMenuTypeAtom);
    const [, setCheckPriceLevel] = useAtom(checkPriceLevelAtom);
    const [, setCheckItemCategory] = useAtom(checkItemCategoryAtom)
    const [, setCheckItemImage] = useAtom(checkItemImgAtom)
    const [, setCheckItemEnergy] = useAtom(checkItemEnergyAtom);
    const [, setCheckItemClass] = useAtom(checkItemClassAtom);
    const [, setCheckItemInfo] = useAtom(checkItemInfoAtom);
    const [, setCheckPriceOne] = useAtom(checkPriceOneAtom);
    const [, setCheckPriceTwo] = useAtom(checkPriceTwoAtom);
    const [, setCheckPriceThree] = useAtom(checkPriceThreeAtom);
    const [, setCheckAwardOne] = useAtom(checkAwardOneAtom);
    const [, setCheckAwardTwo] = useAtom(checkAwardTwoAtom);
    const [, setCheckAwardThree] = useAtom(checkAwardThreeAtom);
    const [, setCheckRedeemOne] = useAtom(checkRedeemOneAtom);
    const [, setCheckRedeemTwo] = useAtom(checkRedeemTwoAtom);
    const [, setCheckRedeemThree] = useAtom(checkRedeemThreeAtom);
    const [, setCheckItemChoiceSelections] = useAtom(checkItemChoiceSelectionsAtom);
    const [, setCheckItemChoiceRequired] = useAtom(checkItemChoiceRequiredAtom);
    const [, setCheckItemChoiceInfo] = useAtom(checkItemChoiceInfoAtom);
    const [, setCheckMenuCategoryInfo] = useAtom(checkMenuCategoryInfoAtom);

    const [confirmChanges, setConfirmChanges] = useAtom(confirmChangesAtom)
    const [confirmChangesAnimation, setConfirmChangesAnimation] = useAtom(confirmChangesAnimationAtom);

    const [newCard, setNewCard] = useAtom(newCardAtom);
    const [, setDisplayCard] = useAtom(displayCardAtom);
    const [, setCardTransition] = useAtom(cardTransitionAtom);

    const ctx = api.useContext();

    const router = useRouter();

    const { data: menuCategoryPosition } = api.menuCategory.getLatestMenuCategoryPosition.useQuery();
    const { data: itemChoicePosition } = api.itemChoice.getLatestItemChoicePosition.useQuery();
    const { data: itemClassPosition } = api.itemClass.getLatestItemClassPosition.useQuery();
    const { data: latestMenuId } = api.menu.getLatestMenuId.useQuery();
    const { data: latestMenuCategoryId } = api.menuCategory.getLatestMenuCategoryId.useQuery();
    const { data: latestItemId } = api.item.getLatestItemId.useQuery();
    const { data: latestItemChoiceId } = api.itemChoice.getLatestItemChoiceId.useQuery();
    const { data: latestItemCategoryId } = api.itemCategory.getLatestItemCategoryId.useQuery();
    const { data: latestItemClassId } = api.itemClass.getLatestItemClassId.useQuery();

    const { mutate: createMenu } = api.menu.createMenu.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setCheckCardTitle(cardTitle);
            setCheckDisplayName(displayName);
            setCheckMenuType(menuType);
            setCheckPriceLevel(priceLevel);
            void ctx.menu.getAllMenus.invalidate();
            void ctx.menu.getLatestMenuId.invalidate();
            if (latestMenuId && latestMenuId[0]?.id) {
                setCardId(latestMenuId[0]?.id + 1);
            } else {
                setCardId(0);
            }
        }
    });

    const { mutate: updateMenu } = api.menu.updateMenu.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setCardTitle("");
            setCheckCardTitle("");
            setDisplayName("");
            setCheckDisplayName("");
            setMenuType("");
            setCheckMenuType("");
            setPriceLevel("")
            setCheckPriceLevel("");
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setErrorText([""]);
            void ctx.menu.getAllMenus.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    })

    const { mutate: createMenuCategory } = api.menuCategory.createMenuCategory.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setCheckCardTitle(cardTitle);
            setCheckDisplayName(displayName);
            setCheckMenuCategoryInfo(menuCategoryInfo);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.menuCategory.getAllMenuCategories.invalidate();
            void ctx.menuCategory.getLatestMenuCategoryPosition.invalidate();
            void ctx.menuCategory.getLatestMenuCategoryId.invalidate();

            if (latestMenuCategoryId && latestMenuCategoryId[0]?.id) {
                setCardId(latestMenuCategoryId[0]?.id + 1);
            } else {
                setCardId(0);
            }
        }
    });

    const { mutate: updateMenuCategory } = api.menuCategory.updateMenuCategory.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setCardTitle("");
            setCheckCardTitle("");
            setDisplayName("");
            setCheckDisplayName("");
            setMenuCategoryInfo("");
            setCheckMenuCategoryInfo("");
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setErrorText([""]);
            void ctx.menuCategory.getAllMenuCategories.invalidate();
            void ctx.menuCategory.getLatestMenuCategoryPosition.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    });

    const { mutate: createItem } = api.item.createItem.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setCheckCardTitle(cardTitle);
            setCheckDisplayName(displayName);
            setCheckItemCategory(itemCategory)
            setCheckItemImage(itemImage);
            setCheckItemEnergy(itemEnergy);
            setCheckItemClass(itemClass);
            setCheckItemInfo(itemInfo);
            setCheckPriceOne(priceOne);
            setCheckPriceTwo(priceTwo);
            setCheckPriceThree(priceThree);
            setCheckAwardOne(awardOne)
            setCheckAwardTwo(awardTwo);
            setCheckAwardThree(awardThree);
            setCheckRedeemOne(redeemOne);
            setCheckRedeemTwo(redeemTwo);
            setCheckRedeemThree(redeemThree);
            void ctx.item.getAllItems.invalidate();
            void ctx.item.getLatestItemId.invalidate();

            if (latestItemId && latestItemId[0]?.id) {
                setCardId(latestItemId[0]?.id + 1);
            } else {
                setCardId(0);
            }
        }
    });

    const { mutate: updateItem } = api.item.updateItem.useMutation({
        onSuccess: () => {
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setErrorText([""]);
            setCardTitle("");
            setCheckCardTitle("");
            setDisplayName("");
            setCheckDisplayName("");
            setItemCategory("");
            setCheckItemCategory("");
            setItemImage("");
            setCheckItemImage("");
            setItemEnergy("");
            setCheckItemEnergy("");
            setItemClass("");
            setCheckItemClass("");
            setItemInfo("");
            setCheckItemInfo("");
            setPriceOne("");
            setCheckPriceOne("");
            setPriceTwo("");
            setCheckPriceTwo("");
            setPriceThree("");
            setCheckPriceThree("");
            setAwardOne("");
            setCheckAwardOne("")
            setAwardTwo("");
            setCheckAwardTwo("");
            setAwardThree("");
            setCheckAwardThree("");
            setRedeemOne("");
            setCheckRedeemOne("");
            setRedeemTwo("");
            setCheckRedeemTwo("");
            setRedeemThree("");
            setCheckRedeemThree("");
            void ctx.item.getAllItems.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    });

    const { mutate: createItemChoice } = api.itemChoice.createItemChoice.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setErrorText([""]);
            setCheckCardTitle(cardTitle);
            setCheckDisplayName(displayName);
            setCheckItemChoiceInfo(itemChoiceInfo);
            setCheckItemChoiceRequired(itemChoiceRequired);
            setCheckItemChoiceSelections(itemChoiceSelections);
            void ctx.itemChoice.getAllItemChoices.invalidate();
            void ctx.itemChoice.getLatestItemChoicePosition.invalidate();
            void ctx.itemChoice.getLatestItemChoiceId.invalidate();

            if (latestItemChoiceId && latestItemChoiceId[0]?.id) {
                setCardId(latestItemChoiceId[0]?.id + 1);
            } else {
                setCardId(0);
            }
        }
    });

    const { mutate: updateItemChoice } = api.itemChoice.updateItemChoice.useMutation({
        onSuccess: () => {
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setErrorText([""]);
            setCardTitle("");
            setCheckCardTitle("");
            setDisplayName("");
            setCheckDisplayName("");
            setItemChoiceInfo("");
            setCheckItemChoiceInfo("");
            setItemChoiceRequired("");
            setCheckItemChoiceRequired("");
            setItemChoiceSelections("");
            setCheckItemChoiceSelections("");
            void ctx.itemChoice.getAllItemChoices.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    });

    const { mutate: createItemCategory } = api.itemCategory.createItemCategory.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setErrorText([""]);
            setCheckCardTitle(cardTitle);
            void ctx.itemCategory.getAllItemCategories.invalidate();
            void ctx.itemCategory.getLatestItemCategoryId.invalidate();

            if (latestItemCategoryId && latestItemCategoryId[0]?.id) {
                setCardId(latestItemCategoryId[0]?.id + 1);
            } else {
                setCardId(0);
            }
        }
    });

    const { mutate: updateItemCategory } = api.itemCategory.updateItemCategory.useMutation({
        onSuccess: () => {
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setErrorText([""]);
            setCardTitle("")
            setCheckCardTitle("");
            void ctx.itemCategory.getAllItemCategories.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
                setCardTitle("");
                setCheckCardTitle("")
            }, 500);
        }
    });

    const { mutate: createItemClass } = api.itemClass.createItemClass.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setErrorText([""]);
            setCheckCardTitle(cardTitle);
            void ctx.itemClass.getAllItemClasses.invalidate();
            void ctx.itemClass.getLatestItemClassPosition.invalidate();
            void ctx.itemClass.getLatestItemClassId.invalidate();

            if (latestItemClassId && latestItemClassId[0]?.id) {
                setCardId(latestItemClassId[0]?.id + 1);
            } else {
                setCardId(0);
            }
        }
    });

    const { mutate: updateItemClass } = api.itemClass.updateItemClass.useMutation({
        onSuccess: () => {
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setErrorText([""]);
            setCardTitle("");
            setCheckCardTitle("");
            void ctx.itemClass.getAllItemClasses.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    });

    function formatPrice(price: string) {
        return (Math.round(Number(price) * 100) / 100).toFixed(2);
    }

    function updateCard(path: string) {
        switch(path) {
            case("/admin/menus"):
                if (newCard) {
                    if (cardTitle === "" || displayName === "" || menuType === "" || priceLevel === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Menu name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            menuType === "" ? "Menu type wasn't entered." : "",
                            priceLevel === "" ? "Price level wasn't entered." : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "" && menuType !== "" && priceLevel !== "") {
                        setDisplayError(false);
                        setConfirmChangesAnimation(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Menu...");
    
                        setTimeout(() => {
                            setConfirmChanges(false);
                        }, 750);
            
                        return createMenu({
                            name: cardTitle,
                            displayName: displayName,
                            menuType: formatMenuTypeforServer(menuType),
                            priceLevel: formatPriceLevelForServer(priceLevel),
                        });
                    }
                } else {
                    if (cardTitle === "" || displayName === "" || menuType === "" || priceLevel === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Menu name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            menuType === "" ? "Menu type wasn't entered." : "",
                            priceLevel === "" ? "Price level wasn't entered." : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }

                    if (cardTitle !== "" && displayName !== "" && menuType !== "" && priceLevel !== "") {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText(`Updating Menu ID: ${cardId}`);
            
                        return updateMenu({
                            id: cardId,
                            name: cardTitle,
                            displayName: displayName,
                            menuType: formatMenuTypeforServer(menuType),
                            priceLevel: formatPriceLevelForServer(priceLevel),
                        });
                    }
                }
                break;

            case("/admin/menu-categories"):
                if (newCard) {
                    if (cardTitle === "" || displayName === "" || menuCategoryInfo === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Menu category name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            menuCategoryInfo === "" ? "No description entered" : ""
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 500);
                    }
            
                    if (cardTitle !== "" && displayName !== "" && menuCategoryInfo !== "") {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Menu Category...");
            
                        return createMenuCategory({ 
                            name: cardTitle,
                            displayName: displayName,
                            position: getNewPosition(menuCategoryPosition),
                            description: menuCategoryInfo
                        });
                    }
                } else {
                    if (cardTitle === "" || displayName === "" || menuCategoryInfo === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Menu category name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            menuCategoryInfo === "" ? "No description entered" : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "" && menuCategoryInfo !== "") {
                        updateMenuCategory({
                            name: cardTitle,
                            displayName: displayName,
                            id: cardId,
                            description: menuCategoryInfo
                        });
    
                        setDisplayError(false);
                        setConfirmChangesAnimation(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText(`Updating Category ID: ${cardId}`);
    
                        setTimeout(() => {
                            setConfirmChanges(false);
                        }, 750);
                    }
                }
                break;

            case("/admin/items"):
                if (newCard) {
                    if (cardTitle === "" || displayName === "" || itemCategory === "" || itemInfo === "" || itemClass === "" || itemEnergy === "" || itemCategoryId === "" || itemClassId === "" || itemImage === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            itemCategory === "" ? "An item category wasn't entered." : "",
                            itemInfo === "" ? "No description was entered." : "",
                            itemClass === "" ? "PLU class wasn't entered." : "",
                            itemEnergy === "" ? "Item energy wasn't entered." : "",
                            itemImage === "" ? "Image URL wasn't entered." : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "" && itemCategory !== "" && itemInfo !== "" && itemClass !== "" && itemEnergy !== "" && itemCategoryId !== "" && itemImage !== "") {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Item...");
            
                        return createItem({ 
                            name: cardTitle,
                            displayName: displayName,
                            categoryId: Number(itemCategoryId),
                            image: itemImage,
                            description: itemInfo,
                            energy: Number(itemEnergy),
                            classId: Number(itemClassId),
                            priceLevelOne: formatPrice(priceOne),
                            priceLevelTwo: formatPrice(priceTwo),
                            priceLevelThree: formatPrice(priceThree),
                            awardedLevelOne: Number(awardOne),
                            awardedLevelTwo: Number(awardTwo),
                            awardedLevelThree: Number(awardThree),
                            redeemLevelOne: Number(redeemOne),
                            redeemLevelTwo: Number(redeemTwo),
                            redeemLevelThree: Number(redeemThree),
                        });
                    }
                } else {
                    if (cardTitle === "" || displayName === "" || itemCategory === "" || itemInfo === "" || itemClass === "" || itemEnergy === "" || itemCategoryId === "" || itemClassId === "" || itemImage === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            itemCategory === "" ? "An item category wasn't entered." : "",
                            itemInfo === "" ? "No description was entered." : "",
                            itemClass === "" ? "PLU class wasn't entered." : "",
                            itemEnergy === "" ? "Item energy wasn't entered." : "",
                            itemImage === "" ? "Image URL wasn't entered." : "",
                        ]);
            
            
                        setTimeout(() => {
                            setDisplayError(false);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "" && itemCategory !== "" && itemInfo !== "" && itemClass !== "" && itemEnergy !== "" && itemCategoryId !== "" && itemClassId !== "" && itemImage !== "") {
                        updateItem({
                            id: cardId,
                            name: cardTitle,
                            displayName: displayName,
                            categoryId: Number(itemCategoryId),
                            classId: Number(itemClassId),
                            description: itemInfo,
                            image: itemImage,
                            energy: Number(itemEnergy),
                            priceLevelOne: priceOne,
                            priceLevelTwo: priceTwo,
                            priceLevelThree: priceThree,
                            awardedLevelOne: Number(awardOne),
                            awardedLevelTwo: Number(awardTwo),
                            awardedLevelThree: Number(awardThree),
                            redeemLevelOne: Number(redeemOne),
                            redeemLevelTwo: Number(redeemTwo),
                            redeemLevelThree: Number(redeemThree),

                        });

                        setDisplayError(false);
                        setConfirmChangesAnimation(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText(`Updating Item ID: ${cardId}`);

                        setTimeout(() => {
                            setConfirmChanges(false);
                        }, 750);
                    }
                }
                break;

            case("/admin/item-choices"):
                if (newCard) {
                    if (cardTitle === "" || displayName === "" || itemChoiceRequired === "" || itemChoiceInfo === "" || itemChoiceSelections === "" || Number(itemChoiceSelections) < 1) {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item choice name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            itemChoiceRequired === "" ? "Required field wasn't entered." : "",
                            itemChoiceInfo === "" ? "Description wasn't entered." : "",
                            itemChoiceSelections === "" ? "Selection amount wasn't entered." : "",
                            Number(itemChoiceSelections) < 1 ? "Selection amount was less than zero." : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "") {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Item Choice...");
            
                        return createItemChoice({ 
                            name: cardTitle,
                            displayName: displayName,
                            description: itemChoiceInfo,
                            required: itemChoiceRequired === "Yes" ? true : false,
                            selections: Number(itemChoiceSelections),
                            position: getNewPosition(itemChoicePosition),
                        });
                    }
                } else {
                    if (cardTitle === "" || displayName === "" || itemChoiceRequired === "" || itemChoiceInfo === "" || itemChoiceSelections === "" || Number(itemChoiceSelections) < 1) {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item choice name wasn't entered." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            itemChoiceRequired === "" ? "Required field wasn't entered." : "",
                            itemChoiceInfo === "" ? "Description wasn't entered." : "",
                            itemChoiceSelections === "" ? "Selection amount wasn't entered." : "",
                            Number(itemChoiceSelections) < 1 ? "Selection amount was less than zero." : "",
                        ]);
            
            
                        setTimeout(() => {
                            setDisplayError(false);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "") {
                        updateItemChoice({
                            id: cardId,
                            name: cardTitle,
                            displayName: displayName,
                            description: itemChoiceInfo,
                            required: itemChoiceRequired === "Yes" ? true : false,
                            selections: Number(itemChoiceSelections),
                        });

                        setDisplayError(false);
                        setConfirmChangesAnimation(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText(`Updating Category ID: ${cardId}`);

                        setTimeout(() => {
                            setConfirmChanges(false);
                        }, 750);
                    }
                }
                break;

                case("/admin/item-categories"):
                if (newCard) {
                    if (cardTitle === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item Category name wasn't entered." : ""
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }
            
                    if (cardTitle !== "") {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Item Category...");
            
                        return createItemCategory({ 
                            name: cardTitle,
                        });
                    }
                } else {
                    if (cardTitle === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item category name wasn't entered." : "",
                        ]);
            
            
                        setTimeout(() => {
                            setDisplayError(false);
                        }, 2000);
                    }
            
                    if (cardTitle !== "") {
                        updateItemCategory({
                            name: cardTitle,
                            id: cardId,
                        });

                        setDisplayError(false);
                        setConfirmChangesAnimation(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText(`Updating Item Category ID: ${cardId}`);

                        setTimeout(() => {
                            setConfirmChanges(false);
                        }, 750);
                    }
                }
                break;

            case("/admin/item-classes"):
                if (newCard) {
                    if (cardTitle === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item class name wasn't entered." : ""
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }
            
                    if (cardTitle !== "") {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Item Class...");
            
                        return createItemClass({ 
                            name: cardTitle,
                            position: getNewPosition(itemClassPosition)
                        });
                    }
                } else {
                    if (cardTitle === "") {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Item class name wasn't entered." : "",
                        ]);
            
            
                        setTimeout(() => {
                            setDisplayError(false);
                        }, 2000);
                    }
            
                    if (cardTitle !== "") {
                        updateItemClass({
                            name: cardTitle,
                            id: cardId,
                        });

                        setDisplayError(false);
                        setConfirmChangesAnimation(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText(`Item PLU Class ID: ${cardId}`);

                        setTimeout(() => {
                            setConfirmChanges(false);
                        }, 750);
                    }
                }
                break;
        } 
    }

    const handleCancelChangesClick = () => {
        setCardTransition(false);
        setConfirmChangesAnimation(false);

        setTimeout(() => {
            setDisplayCard(false);
            setConfirmChanges(false);
            setNewCard(false);
        }, 750);
    };

    return (
        <div className={`fixed flex flex-col space-y-2 right-6 z-50 border dark:border-neutral-700 bg-white dark:bg-[#1b1b1c] shadow-md rounded-lg duration-[800ms] transition-all ease-in-out ${confirmChangesAnimation ? "top-2" : "top-0 -translate-y-full" || ""} ${confirmChanges ? "" : "hidden" || ""}`}>
            <h2 className="text-sm text-center w-full py-2 m-auto bg-neutral-100 dark:bg-[#202021] rounded-t-lg border-b dark:border-b-neutral-700">Changes Detected</h2>

            <div className="px-4 pb-3">
                <div 
                    className="flex items-center space-x-1 group hover:bg-slate-100 dark:hover:bg-neutral-700 px-2 py-1 rounded-lg w-fit cursor-pointer"
                    onClick={(() => updateCard(router.pathname))}
                >
                    <p className="text-xs font-light"><span className="font-medium">Save</span> your changes</p>

                    <BsCheckAll className="group-hover:text-green-500" />
                </div>

                <div 
                    className="flex items-center group hover:bg-slate-100 dark:hover:bg-neutral-700 px-2 py-1 rounded-lg w-fit cursor-pointer"
                    onClick={handleCancelChangesClick}
                >
                    <p className="text-xs font-light"><span className="font-medium">Cancel</span> your changes</p>

                    <BsExclamation className="group-hover:text-red-500" />
                </div>

            </div>
            
        </div>
    );
};

export default ConfirmationToast;