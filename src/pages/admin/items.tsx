import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";

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
    checkItemClassAtom,
    checkItemEnergyAtom,
    checkItemImgAtom,
    checkItemInfoAtom,
    checkPriceOneAtom,
    checkPriceThreeAtom,
    checkPriceTwoAtom,
    checkRedeemOneAtom,
    checkRedeemThreeAtom,
    checkRedeemTwoAtom,
    confirmChangesAnimationAtom,
    confirmChangesAtom,
    createdAtAtom,
    createdUserImageAtom,
    createdUserNameAtom,
    dayAtom,
    displayCardAtom,
    displayErrorAtom,
    displayLoadingToastAtom,
    displayNameAtom,
    endTimeAtom,
    errorTextAtom,
    itemCategoryAtom,
    itemCategoryIdAtom,
    itemClassAtom,
    itemClassIdAtom,
    itemEnergyAtom,
    itemImgAtom,
    itemInfoAtom,
    loadingToastTextAtom,
    newCardAtom,
    priceOneAtom,
    priceThreeAtom,
    priceTwoAtom,
    redeemOneAtom,
    redeemThreeAtom,
    redeemTwoAtom,
    searchLocationsAtom, 
    startTimeAtom, 
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom,
} from "~/store/store";

import Sidebar from "~/components/Sidebar";
import Input from "~/components/inputs/Input";
import LoadingToast from "~/components/toast/LoadingToast";
import ErrorToast from "~/components/toast/ErrorToast";
import MutateButton from "~/components/adminCard/MutateButton";
import MenuAvailability from "~/components/adminCard/MenuAvailability";
import LocationMapping from "~/components/adminCard/LocationMapping";
import AdminCardFunctions from "~/components/adminCard/AdminCardFunctions";
import AdminCard from "~/components/adminCard/AdminCard";

import { RouterOutputs, api } from "~/utils/api";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { formatUserName } from "~/utils/formatUserName";

import { BsPlusLg, BsTrash } from "react-icons/bs";
import InputSearchDropdown from "~/components/inputs/InputSearchDropdown";
import { getNewPosition } from "~/utils/getNewPosition";
import { RxUpdate } from "react-icons/rx";

type MappedItemChoices = RouterOutputs["itemChoiceMap"]["getMappedItemChoicesByItemId"];

const MapItemChoice = () => {
    const [toggleChoiceDropdown, setToggleChoiceDropdown] = useState(false);
    const [choiceInput, setChoiceInput] = useState("");
    const [choiceId, setChoiceId] = useState("");

    const [, setDisplayError] = useAtom(displayErrorAtom);
    const [, setErrorText] = useAtom(errorTextAtom);

    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const [cardId] = useAtom(cardIdAtom);
    
    const ctx = api.useContext();

    const { data: choiceData } = api.itemChoice.getAllChoicesForDropdown.useQuery();
    const { data: mappedItemChoices } = api.itemChoiceMap.getMappedItemChoicesByItemId.useQuery({ id: cardId });
    const { data: mappedItemChoicePostion } = api.itemChoiceMap.getLatestMappedItemChoicePosition.useQuery({ id: cardId });

    const { mutate: createMappedItemChoice } = api.itemChoiceMap.createMappedItemChoice.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setChoiceId("");
            setChoiceInput("");
            void ctx.itemChoiceMap.getMappedItemChoicesByItemId.invalidate({ id: cardId });
            void ctx.itemChoiceMap.getLatestMappedItemChoicePosition.invalidate();
        },
    });

    const { mutate: deleteMappedItemChoice } = api.itemChoiceMap.deleteMappedItemChoice.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            void ctx.itemChoiceMap.getMappedItemChoicesByItemId.invalidate({ id: cardId });
            void ctx.itemChoiceMap.getLatestMappedItemChoicePosition.invalidate();
        },
    });

    const { mutate: updateMappedItemChoicePosition } = api.itemChoiceMap.updateMappedItemChoicePosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.itemChoiceMap.getMappedItemChoicesByItemId.invalidate({ id: cardId });
        }
    });

    const [mappedItemChoicesState, setMappedItemChoicesState] = useState<MappedItemChoices>();

    useEffect(() => {
        if (mappedItemChoices !== undefined) {
            setMappedItemChoicesState(mappedItemChoices);
        }
    }, [mappedItemChoices]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    function handleSortPositions() {
        const _mappedItemChoices: MappedItemChoices = [];

        if (!mappedItemChoicesState) return null;
        mappedItemChoicesState.forEach(itemChoice => _mappedItemChoices.push(Object.assign({}, itemChoice)));

        const draggedItemContent = _mappedItemChoices.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _mappedItemChoices.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setMappedItemChoicesState(_mappedItemChoices);
    }

    function handleUpdatePositionsClick() {
        if (!mappedItemChoicesState) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        mappedItemChoicesState.map(({ itemChoice }, index) => {
            updateMappedItemChoicePosition({ id: itemChoice.id, position: index })
        });
    }

    function mapItemChoice() {
        if (choiceId === "") {
            setDisplayError(true);

            setErrorText([
                choiceId === "" ? "No choice entered." : "",
            ])

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (choiceId !== "") {
            setDisplayError(false);
            setDisplayLoadingToast(true);
            setLoadingToastText("Mapping Choice...");

            createMappedItemChoice({
                choiceId: Number(choiceId),
                itemId: cardId,
                position: getNewPosition(mappedItemChoicePostion)
            });
        }
    }

    function deleteMappedChoiceItem(id: number) {
        setDisplayLoadingToast(true);
        setLoadingToastText("Deleting Mapped Item...");

        deleteMappedItemChoice({
            id: id,
        });
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center mb-4">
                <h2 className="text-center capitalize">Assign Choices</h2>

                <p className="text-xs font-light">Assign choice sets to this item.</p>
            </div>

            <div className="flex flex-col space-y-4">
                <div>
                    <p className="p-1 font-light text-xs">Search choices to assign to this item, you must click the choice to assign.</p>

                    <InputSearchDropdown 
                        toggleDropdown={toggleChoiceDropdown}
                        setToggleDropdown={setToggleChoiceDropdown}
                        inputValue={choiceInput}
                        setInputValue={setChoiceInput}
                        labelName="Choice"    
                        choiceData={choiceData}
                        setDropdownItemsId={setChoiceId}
                    />
                </div>

                <div 
                    className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                    onClick={mapItemChoice}
                >
                    <BsPlusLg 
                        className="group-hover:text-blue-400 dark:group-hover:text-pink-300/70" 
                    />

                    <p className="group-hover:text-slate-800 dark:group-hover:text-neutral-300/70 text-xs">Add Item</p>
                </div>

                <div 
                    className="flex items-center space-x-1 w-fit text-zinc-500 group dark:hover:text-neutral-300/70 cursor-pointer px-0.5"
                    onClick={handleUpdatePositionsClick}
                >
                    <RxUpdate 
                        className="group-hover:text-blue-400 dark:group-hover:text-pink-300/70 group-hover:animate-spin text-xs"
                    />

                    <p className="group-hover:text-slate-800 dark:group-hover:text-neutral-300/70 text-xs">Update Positions</p>
                </div>

                <div className="flex flex-col border-slate-300 dark:border-neutral-800 shadow-md">
                    <table className="w-full text-xs font-light text-left relative">
                        <thead className="sticky top-0 text-xs bg-neutral-100 dark:bg-[#202021] uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    ID
                                </th>

                                <th scope="col" className=" px-6 py-3">
                                    Choice
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Selections
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Required
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {mappedItemChoicesState && mappedItemChoicesState.length > 0 && (
                                <>
                                    {mappedItemChoicesState.map(({ itemChoice, user }, index) => (
                                        <tr 
                                            key={itemChoice.id}
                                            className="relative bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800 group"
                                            draggable
                                            onDragStart={(() => dragItem.current = index)}
                                            onDragEnter={(() => dragOverItem.current = index)}
                                            onDragOver={((e) => e.preventDefault())}
                                            onDragEnd={handleSortPositions}
                                            aria-disabled={true}
                                        >
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {itemChoice.choice.id}
                                            </th>

                                            <td className="px-6 py-4">
                                                {itemChoice.choice.choiceName}
                                            </td>

                                            <td className="px-6 py-4">
                                                {itemChoice.choice.selections}
                                            </td>

                                            <td className="px-6 py-4">
                                                {itemChoice.choice.required ? "Yes" : "No"}
                                            </td>

                                            <td className="flex items-center space-x-2 px-6 py-4">
                                                <Image 
                                                    src={user?.profileImageUrl || ""}
                                                    className="rounded-full"
                                                    width={20}
                                                    height={20}
                                                    alt="User Profile Image"
                                                />

                                                <p className="text-[10px] text-zinc-500 font-light">{formatTimestamp(itemChoice.createdAt)}</p>
                                            </td>

                                            <td 
                                                className="invisible group-hover:visible absolute -top-2 -right-2 bg-red-500/80 p-1 rounded-full hover:scale-110"
                                                onClick={(() => deleteMappedChoiceItem(itemChoice.id))}
                                            >
                                                <BsTrash />
                                            </td>
                                        </tr>
                                    ))}
                                    
                                </>  
                            )}
                        </tbody>

                    </table>

                </div>

            </div>
            
        </div>    
    );
};

const ItemsConfiguration = () => {
    const [itemDisplayName, setItemDisplayName] = useAtom(displayNameAtom);
    const [itemImage, setItemImage] = useAtom(itemImgAtom);
    const [itemEnergy, setItemEnergy] = useAtom(itemEnergyAtom);
    const [itemCategory, setItemCategory] = useAtom(itemCategoryAtom);
    const [, setItemCategoryId] = useAtom(itemCategoryIdAtom);
    const [itemClass, setItemClass] = useAtom(itemClassAtom);
    const [, setItemClassId] = useAtom(itemClassIdAtom);
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

    const [itemClassDropdown, setItemClassDropdown] = useState(false);
    const [itemCategoryDropdown, setItemCategoryDropdown] = useState(false);

    const { data: itemClasses } = api.itemClass.getAllItemClassesForDropdown.useQuery();
    const { data: itemCategories } = api.itemCategory.getAllItemCategoriesForDropdown.useQuery();

    return (
        <div className="flex flex-col space-y-10 mt-8">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-center">PLU Configuration</h2>

                    <p className="text-xs font-light">Update item configuration settings.</p>
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the item name that will display on the UI.</p>

                    <Input 
                        inputValue={itemDisplayName}
                        setInputValue={setItemDisplayName}
                        labelName="Item Name"            
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the item image URL.</p>

                    <Input 
                        inputValue={itemImage}
                        setInputValue={setItemImage}
                        labelName="Image"            
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the item kilojule intake.</p>

                    <Input 
                        inputValue={itemEnergy}
                        setInputValue={setItemEnergy}
                        labelName="Kilojules"    
                        number={true}        
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Assign an item category, you must click an option to assign.</p>

                    <InputSearchDropdown 
                        toggleDropdown={itemCategoryDropdown}
                        setToggleDropdown={setItemCategoryDropdown}
                        inputValue={itemCategory}
                        setInputValue={setItemCategory}
                        labelName="Item Category"        
                        itemCategoryData={itemCategories}     
                        setDropdownItemsId={setItemCategoryId}
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Assign an item class, you must click an option to assign.</p>

                    <InputSearchDropdown 
                        toggleDropdown={itemClassDropdown}
                        setToggleDropdown={setItemClassDropdown}
                        inputValue={itemClass}
                        setInputValue={setItemClass}
                        labelName="Item Class"    
                        itemClassData={itemClasses}     
                        setDropdownItemsId={setItemClassId}
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Add a description.</p>

                    <textarea 
                        rows={5} 
                        className=" p-2.5 md:mt-1 2xl:mt-0 w-full text-xs rounded-lg border outline-none focus:border-slate-300 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:focus:border-neutral-600 dark:placeholder:text-zinc-500" 
                        placeholder="Item Description"
                        value={itemInfo}
                        onChange={((e) => setItemInfo(e.target.value))}
                    >
                    </textarea>
                </div>

                <div className="flex flex-col space-y-1">
                    <p className="p-1 font-light text-xs">Level one:</p>

                    <div className="flex space-x-6">
                        <Input 
                            inputValue={priceOne}
                            setInputValue={setPriceOne}
                            labelName="$ ~ Price 1" 
                            number={true}            
                        />

                        <Input 
                            inputValue={awardOne}
                            setInputValue={setAwardOne}
                            labelName="Awarded Points 1" 
                            number={true}            
                        />

                        <Input 
                            inputValue={redeemOne}
                            setInputValue={setRedeemOne}
                            labelName="Redemption Points 1" 
                            number={true}            
                        />
                    </div>

                </div>

                <div className="flex flex-col space-y-1">
                    <p className="p-1 font-light text-xs">Level two:</p>

                    <div className="flex space-x-6">
                        <Input 
                            inputValue={priceTwo}
                            setInputValue={setPriceTwo}
                            labelName="$ ~ Price 2" 
                            number={true}            
                        />

                        <Input 
                            inputValue={awardTwo}
                            setInputValue={setAwardTwo}
                            labelName="Awarded Points 2" 
                            number={true}            
                        />

                        <Input 
                            inputValue={redeemTwo}
                            setInputValue={setRedeemTwo}
                            labelName="Redemption Points 2" 
                            number={true}            
                        />
                    </div>

                </div>

                <div className="flex flex-col space-y-1">
                    <p className="p-1 font-light text-xs">Level three:</p>

                    <div className="flex space-x-6">
                        <Input 
                            inputValue={priceThree}
                            setInputValue={setPriceThree}
                            labelName="$ ~ Price 3" 
                            number={true}            
                        />

                        <Input 
                            inputValue={awardThree}
                            setInputValue={setAwardThree}
                            labelName="Awarded Points 3" 
                            number={true}            
                        />

                        <Input 
                            inputValue={redeemThree}
                            setInputValue={setRedeemThree}
                            labelName="Redemption Points 3" 
                            number={true}            
                        />
                    </div>

                </div>
                                
            </div>

        </div>  
    );
};

const Items = () => {
    const [displayError] = useAtom(displayErrorAtom);  
    const [displayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const [, setNewCard] = useAtom(newCardAtom);
    const [displayCard, setDisplayCard] = useAtom(displayCardAtom);
    const [cardTransition, setCardTransition] = useAtom(cardTransitionAtom);
    const [, setConfirmChanges] = useAtom(confirmChangesAtom);
    const [, setConfirmChangesAnimation] = useAtom(confirmChangesAnimationAtom);

    const [, setCreatedUserName] = useAtom(createdUserNameAtom);
    const [, setCreatedUserImage] = useAtom(createdUserImageAtom);
    const [, setCreatedAt] = useAtom(createdAtAtom);
    const [, setUpdatedUserName] = useAtom(updatedUserNameAtom);
    const [, setUpdatedUserImage] = useAtom(updatedUserImageAtom);
    const [, setUpdatedAt] = useAtom(updatedAtAtom);

    const [, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [displayName, setDisplayName] = useAtom(displayNameAtom);
    const [itemImg, setItemImg] = useAtom(itemImgAtom);
    const [itemEnergy, setItemEnergy] = useAtom(itemEnergyAtom);
    const [itemCategory, setItemCategory] = useAtom(itemCategoryAtom);
    const [, setItemCategoryId] = useAtom(itemCategoryIdAtom);
    const [itemClass, setItemClass] = useAtom(itemClassAtom);
    const [, setItemClassId] = useAtom(itemClassIdAtom);
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

    const [checkItemName, setCheckItemName] = useAtom(checkCardTitleAtom);
    const [checkDisplayName, setCheckDisplayName] = useAtom(checkDisplayNameAtom);
    const [checkItemCategory, setCheckItemCategory] = useAtom(checkItemCategoryAtom)
    const [checkItemImg, setCheckItemImg] = useAtom(checkItemImgAtom)
    const [checkItemEnergy, setCheckItemEnergy] = useAtom(checkItemEnergyAtom);
    const [checkItemClass, setCheckItemClass] = useAtom(checkItemClassAtom);
    const [checkItemInfo, setCheckItemInfo] = useAtom(checkItemInfoAtom);
    const [checkPriceOne, setCheckPriceOne] = useAtom(checkPriceOneAtom);
    const [checkPriceTwo, setCheckPriceTwo] = useAtom(checkPriceTwoAtom);
    const [checkPriceThree, setCheckPriceThree] = useAtom(checkPriceThreeAtom);
    const [checkAwardOne, setCheckAwardOne] = useAtom(checkAwardOneAtom);
    const [checkAwardTwo, setCheckAwardTwo] = useAtom(checkAwardTwoAtom);
    const [checkAwardThree, setCheckAwardThree] = useAtom(checkAwardThreeAtom);
    const [checkRedeemOne, setCheckRedeemOne] = useAtom(checkRedeemOneAtom);
    const [checkRedeemTwo, setCheckRedeemTwo] = useAtom(checkRedeemTwoAtom);
    const [checkRedeemThree, setCheckRedeemThree] = useAtom(checkRedeemThreeAtom);

    const [, setDay] = useAtom(dayAtom);
    const [, setStartTime] = useAtom(startTimeAtom);
    const [, setEndTime] = useAtom(endTimeAtom);

    const [, setSearchLocations] = useAtom(searchLocationsAtom);

    const user = useUser();

    const { data: items } = api.item.getAllItems.useQuery();

    function handleNewCardClick() {
        if (displayCard) return null;

        setNewCard(true);
        setDisplayCard(true); 
        setCardTitle("");
        setCheckItemName("");
        setDisplayName("");
        setCheckDisplayName("");
        setItemImg("");
        setCheckItemImg("");
        setItemEnergy("");
        setCheckItemEnergy("");
        setItemCategory("");
        setItemCategoryId("");
        setCheckItemCategory("");
        setItemClass("");
        setItemClassId("");
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
        setCheckAwardOne("");
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

        setDay("");
        setStartTime("");
        setEndTime("")
        setSearchLocations("");
        setCreatedUserName(user.user?.fullName || "");
        setCreatedUserImage(user.user?.profileImageUrl || "");
        setCreatedAt(formatTimestamp(new Date()));
        setUpdatedUserName(user.user?.fullName || "");
        setUpdatedUserImage(user.user?.profileImageUrl || "");
        setUpdatedAt(formatTimestamp(new Date()));

        setTimeout(() => {
            setCardTransition(true);
        }, 100);
    }

    function handleCardClick(
            id: number, 
            itemName: string, 
            itemDisplayName: string,
            itemImage: string,
            itemEnergy: number,
            itemCategory: string,
            itemCategoryId: number,
            itemClass: string,
            itemClassId: number,
            itemInfo: string,
            priceOne: string,
            priceTwo: string,
            priceThree: string,
            awardOne: number,
            awardTwo: number,
            awardThree: number,
            redeemOne: number,
            redeemTwo: number,
            redeemThree: number,
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) {
        if (displayCard) return null;

        setDisplayCard(true); 
        setCardTitle(itemName);
        setCheckItemName(itemName);
        setDisplayName(itemDisplayName);
        setCheckDisplayName(itemDisplayName);
        setItemImg(itemImage);
        setCheckItemImg(itemImage);
        setItemEnergy(itemEnergy.toString());
        setCheckItemEnergy(itemEnergy.toString());
        setItemCategory(itemCategory);
        setItemCategoryId(itemCategoryId.toString());
        setCheckItemCategory(itemCategory);
        setItemClass(itemClass);
        setItemClassId(itemClassId.toString());
        setCheckItemClass(itemClass);
        setItemInfo(itemInfo);
        setCheckItemInfo(itemInfo);
        setPriceOne(priceOne);
        setCheckPriceOne(priceOne);
        setPriceTwo(priceTwo);
        setCheckPriceTwo(priceTwo);
        setPriceThree(priceThree);
        setCheckPriceThree(priceThree);
        setAwardOne(awardOne.toString());
        setCheckAwardOne(awardOne.toString());
        setAwardTwo(awardTwo.toString());
        setCheckAwardTwo(awardTwo.toString());
        setAwardThree(awardThree.toString());
        setCheckAwardThree(awardThree.toString());
        setRedeemOne(redeemOne.toString());
        setCheckRedeemOne(redeemOne.toString());
        setRedeemTwo(redeemTwo.toString());
        setCheckRedeemTwo(redeemTwo.toString());
        setRedeemThree(redeemThree.toString());
        setCheckRedeemThree(redeemThree.toString());

        setDay("");
        setStartTime("");
        setEndTime("")
        setSearchLocations("");
        setCardId(id);
        setCreatedUserName(createdUserName);
        setCreatedUserImage(createdUserImage);
        setCreatedAt(createdAt);
        setUpdatedUserName(updatedUserName);
        setUpdatedUserImage(updatedUserImage);
        setUpdatedAt(updatedAt);

        setTimeout(() => {
            setCardTransition(true);
        }, 100);
    }

    const handleCloseAdminCardClick = () => {
        if (checkItemName !== cardTitle || checkDisplayName !== displayName || itemCategory !== checkItemCategory || itemImg !== checkItemImg || itemEnergy !== checkItemEnergy || itemClass !== checkItemClass || itemInfo !== checkItemInfo || priceOne !== checkPriceOne || priceTwo !== checkPriceTwo || priceThree !== checkPriceThree || awardOne !== checkAwardOne || awardTwo !== checkAwardTwo || awardThree !== checkAwardThree || redeemOne !== checkRedeemOne || redeemTwo !== checkRedeemTwo || redeemThree !== checkRedeemThree) {
            setConfirmChanges(true);

            setTimeout(() => {
                setConfirmChangesAnimation(true);
            }, 100);

        } else {
            setCardTransition(false);
            setConfirmChanges(false);
            setCardTitle("");
            setCheckItemName("");
            setDisplayName("");
            setCheckDisplayName("");
            setItemImg("");
            setCheckItemImg("");
            setItemEnergy("");
            setCheckItemEnergy("");
            setItemCategory("");
            setItemCategoryId("");
            setCheckItemCategory("");
            setItemClass("");
            setItemClassId("");
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
            setCheckAwardOne("");
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
    
            setTimeout(() => {
                setDisplayCard(false);
                setNewCard(false);
            }, 750);
        }
    };

    if (!items) {
        setLoadingToastText("Loading...");
        return <LoadingToast />;
    } 

    return (
        <div className="flex">
            <Sidebar />

            {displayLoadingToast && (
                <LoadingToast />
            )}

            {displayError && (
                <ErrorToast />
            )}  

            <div 
                className={`sticky top-0 flex-1 h-screen scrollbar w-fit px-6 ${displayCard && cardTransition && "opacity-30"}`} 
                onClick={displayCard ? handleCloseAdminCardClick : undefined}
            >
                <div className="flex-1 flex flex-col space-y-4 py-10 px-8">
                    <div className="flex flex-col space-y-1  py-2">
                        <h1 className="text-[2rem] font-medium">PLUs</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                                <div className="items-center space-y-1">
                                    <p className="dark:text-neutral-200">
                                        Create items that can be assigned to menu categories, which are applied to menus for web ordering and the POS.
                                    </p>
                                </div>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className={`flex flex-col space-y-4 px-2 border-b dark:border-b-neutral-700 pb-4`}>
                            <div className="flex flex-col space-y-2 text-xs">
                                <div 
                                    className={`flex items-center space-x-1 w-fit text-zinc-500 group dark:hover:text-neutral-300/70 ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                    onClick={handleNewCardClick}
                                >
                                    <BsPlusLg 
                                        className={`${displayCard ? "" : "group-hover:text-blue-400 dark:group-hover:text-pink-300/70" || ""}`} 
                                    />

                                    <p className={`${displayCard ? "" : "group-hover:text-slate-800 dark:group-hover:text-neutral-300/70" || ""}`}>Add Item</p>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-col border-slate-300 dark:border-neutral-800 shadow-md">
                            <table className="w-full text-xs font-light text-left relative">
                                <thead className="sticky top-0 text-xs bg-neutral-100 dark:bg-[#202021] uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            ID
                                        </th>

                                        <th scope="col" className=" px-6 py-3">
                                            Item
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Display name
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Category
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Class
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Price
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Created
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items && items.length > 0 && (
                                        <>
                                            {items.map(({ item, user, updatedUser }) => (
                                                <tr 
                                                    key={item.id}
                                                    className="bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800"
                                                    onClick={(() => 
                                                        handleCardClick(
                                                            item.id,
                                                            item.itemName,
                                                            item.itemDisplayName,
                                                            item.image,
                                                            item.energy,
                                                            item.category.categoryName,
                                                            item.categoryId,
                                                            item.class.className,
                                                            item.classId,
                                                            item.description,
                                                            item.priceLevelOne,
                                                            item.priceLevelTwo,
                                                            item.priceLevelThree,
                                                            item.awardedPointsOne,
                                                            item.awardedPointsTwo,
                                                            item.awardedPointsThree,
                                                            item.redemptionPointsOne,
                                                            item.redemptionPointsTwo,
                                                            item.redemptionPointsThree,
                                                            formatUserName(user?.firstName || "", user?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(item.createdAt),
                                                            formatUserName(updatedUser?.firstName || "", updatedUser?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(item.updatedAt)
                                                        )
                                                    )}
                                                >
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {item.id}
                                                    </th>

                                                    <td className="px-6 py-4">
                                                        {item.itemName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item.itemDisplayName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item.category.categoryName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {item.class.className}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        ${item.priceLevelOne}
                                                    </td>

                                                    <td className="flex items-center space-x-2 px-6 py-4">
                                                        <Image 
                                                            src={user?.profileImageUrl || ""}
                                                            className="rounded-full"
                                                            width={20}
                                                            height={20}
                                                            alt="User Profile Image"
                                                        />

                                                        <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(item.createdAt)}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>  
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
            
                </div>

            </div>

            <AdminCard
                adminCardFunctions={<AdminCardFunctions />}
                configuration={<ItemsConfiguration />} 
                locationMapping={
                    <LocationMapping 
                        headerTitle="item" 
                        paragraphTitle="items"
                    />
                }
                menuAvailability={
                    <MenuAvailability 
                        title="item" 
                    />
                }
                mappedItemChoice={<MapItemChoice />}
                mutateButton={<MutateButton />}
            />

        </div>
    );
};

export default Items;