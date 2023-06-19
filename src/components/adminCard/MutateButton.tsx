import React from "react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

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
import { getNewPosition } from "~/utils/getNewPosition";
import { formatMenuTypeforServer } from "~/utils/formatMenuTypeForServer";
import { formatPriceLevelForServer } from "~/utils/formatPriceLevelForServer";
import { formatPrice } from "~/utils/formatPrice";

const MutateButton = () => {
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
    const [, setCheckMenuCategoryInfo] = useAtom(menuCategoryInfoAtom);

    const [, setConfirmChanges] = useAtom(confirmChangesAtom)
    const [, setConfirmChangesAnimation] = useAtom(confirmChangesAnimationAtom);

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

    const { data: menuNames } = api.menu.getAllMenuNames.useQuery();

    let isUnique = true;

    if (menuNames && menuNames.length > 0) {
        if (menuNames.filter(function({ menuName }) { return menuName.toLowerCase() === cardTitle.toLowerCase(); }).length > 0) {
            isUnique = false;
        }
    }

    const { mutate: createMenu } = api.menu.createMenu.useMutation({
        onSuccess: () => {
            setNewCard(false);
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            setCheckCardTitle(cardTitle);
            setCheckDisplayName(displayName);
            setCheckMenuType(menuType);
            setCheckPriceLevel(priceLevel);
            setErrorText([""]);
            void ctx.menu.getAllMenus.invalidate();
            void ctx.menu.getLatestMenuId.invalidate();

            if (latestMenuId && latestMenuId[0]?.id) {
                setCardId(latestMenuId[0]?.id + 1);
            } else {
                setCardId(1);
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
            setErrorText([""]);
            void ctx.menuCategory.getAllMenuCategories.invalidate();
            void ctx.menuCategory.getLatestMenuCategoryPosition.invalidate();
            void ctx.menuCategory.getLatestMenuCategoryId.invalidate();

            if (latestMenuCategoryId && latestMenuCategoryId[0]?.id) {
                setCardId(latestMenuCategoryId[0]?.id + 1);
            } else {
                setCardId(1);
            }
        }
    });

    const { mutate: updateMenuCategory } = api.menuCategory.updateMenuCategory.useMutation({
        onSuccess: () => {
            setCardTransition(false);
            setDisplayLoadingToast(false);
            setCardTitle("");
            setCheckCardTitle("");
            setDisplayName("");
            setCheckDisplayName("");
            setMenuCategoryInfo("");
            setCheckMenuCategoryInfo("");
            setErrorText([""]);
            void ctx.menuCategory.getAllMenuCategories.invalidate();

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
            setErrorText([""]);
            setCheckCardTitle(cardTitle);
            setCheckDisplayName(displayName);
            setCheckItemCategory(itemCategory);
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
                setCardId(1);
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
                setCardId(1);
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
                setCardId(1);
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
                setCardId(1);
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


    function mutateCard(path: string) {
        switch(path) {
            case("/admin/menus"):
                if (newCard) {
                    if (cardTitle === "" || displayName === "" || menuType === "" || priceLevel === "" || !isUnique) {
                        setDisplayError(true);
                        setErrorText([
                            cardTitle === "" ? "Menu name wasn't entered." : "",
                            !isUnique ? "Menu name already exists." : "",
                            displayName === "" ? "Display name wasn't entered." : "",
                            menuType === "" ? "Menu type wasn't entered." : "",
                            priceLevel === "" ? "Price level wasn't entered." : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
                    }
            
                    if (cardTitle !== "" && displayName !== "" && menuType !== "" && priceLevel !== "" && isUnique) {
                        setDisplayError(false);
                        setDisplayLoadingToast(true);
                        setLoadingToastText("Creating Menu...");
            
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
                            menuCategoryInfo === "" ? "No description entered" : "",
                        ]);
            
                        setTimeout(() => {
                            setDisplayError(false);
                            setErrorText([""]);
                        }, 2000);
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
            
                    if (cardTitle !== "" && displayName !== "" && itemCategory !== "" && itemInfo !== "" && itemClass !== "" && itemEnergy !== "" && itemCategoryId !== "" && itemClassId !== "" && itemImage !== "") {
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
            
                    if (cardTitle !== "" && displayName !== "" && itemChoiceRequired !== "" && itemChoiceInfo !== "" && itemChoiceSelections !== "" && Number(itemChoiceSelections) > 0) {
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
            
                    if (cardTitle !== "" && displayName !== "" && itemChoiceRequired !== "" && itemChoiceInfo !== "" && itemChoiceSelections !== "" && Number(itemChoiceSelections) > 0) {
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
                        setLoadingToastText(`Updating Item Choice ID: ${cardId}`);

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

    return (
        <>            
            <button 
                className="relative m-auto w-fit text-sm inline-flex items-center justify-center px-3 py-1.5 overflow-hidden font-medium text-[#2f334a] transition duration-300 ease-out border-2 dark:border border-[#2f334a] dark:border-neutral-500 dark:hover:border-[#2f334a] rounded-md shadow-md group"
                onClick={(() => mutateCard(router.pathname))}
            >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[#2f334a] group-hover:translate-x-0 ease">
                    <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </span>
                
                <span className="absolute flex items-center justify-center w-full h-full dark:text-neutral-500 text-[#2f334a]  transition-all duration-300 transform group-hover:translate-x-full ease">{newCard ? "Submit" : "Update"}</span>
                
                <span className="relative invisible">{newCard ? "Submit" : "Update"}</span>

            </button> 
        </>

    );
};

export default MutateButton;