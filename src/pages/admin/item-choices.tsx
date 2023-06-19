import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";

import { useAtom } from "jotai";
import { 
    cardIdAtom,
    cardTitleAtom,
    cardTransitionAtom,
    checkCardTitleAtom,
    checkDisplayNameAtom,
    itemChoiceSelectionsAtom,
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
    loadingToastTextAtom,
    newCardAtom,
    searchLocationsAtom, 
    startTimeAtom, 
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom,
    uuidAtom,
    itemChoiceRequiredAtom,
    itemChoiceInfoAtom,
    checkItemChoiceSelectionsAtom,
    checkItemChoiceRequiredAtom,
    checkItemChoiceInfoAtom,
    priceOneAtom,
    priceTwoAtom,
    priceThreeAtom
} from "~/store/store";

import Sidebar from "~/components/Sidebar";
import Input from "~/components/inputs/Input";
import LoadingToast from "~/components/toast/LoadingToast";
import ErrorToast from "~/components/toast/ErrorToast";
import MutateButton from "~/components/adminCard/MutateButton";
import LocationMapping from "~/components/adminCard/LocationMapping";
import AdminCardFunctions from "~/components/adminCard/AdminCardFunctions";
import AdminCard from "~/components/adminCard/AdminCard";
import InputForDropdown from "~/components/inputs/InputForDropdown";
import InputSearchDropdown from "~/components/inputs/InputSearchDropdown";

import { RouterOutputs, api } from "~/utils/api";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { formatUserName } from "~/utils/formatUserName";

import { BsPlusLg, BsTrash } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { formatPrice } from "~/utils/formatPrice";
import { getNewPosition } from "~/utils/getNewPosition";

type ItemChoices = RouterOutputs["itemChoice"]["getAllItemChoices"];
type ChoiceItems = RouterOutputs["choiceItem"]["getChoiceItemsByItemChoiceId"];

const MapItem = () => {
    const [toggleItemDropdown, setToggleItemDropdown] = useState(false);
    const [itemInput, setItemInput] = useState("");
    const [itemId, setItemId] = useState("");
    const [priceOne, setPriceOne] = useAtom(priceOneAtom);
    const [priceTwo, setPriceTwo] = useAtom(priceTwoAtom);
    const [priceThree, setPriceThree] = useAtom(priceThreeAtom);

    const [, setDisplayError] = useAtom(displayErrorAtom);
    const [, setErrorText] = useAtom(errorTextAtom);

    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const [cardId] = useAtom(cardIdAtom);
    
    const ctx = api.useContext();

    const { data: itemData } = api.item.getAllItemsForDropdown.useQuery();
    const { data: choiceItems } = api.choiceItem.getChoiceItemsByItemChoiceId.useQuery({ id: cardId });
    const { data: choiceItemPosition } = api.choiceItem.getLatestChoiceItemPosition.useQuery({ id: cardId });

    const { mutate: createChoiceItem } = api.choiceItem.createChoiceItem.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setPriceOne("");
            setPriceTwo("");
            setPriceThree("");
            setItemId("");
            setItemInput("");
            void ctx.choiceItem.getChoiceItemsByItemChoiceId.invalidate({ id: cardId });
            void ctx.choiceItem.getLatestChoiceItemPosition.invalidate();
        },
    });

    const { mutate: deleteChoiceItem } = api.choiceItem.deleteChoiceItem.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            void ctx.choiceItem.getChoiceItemsByItemChoiceId.invalidate({ id: cardId });
            void ctx.choiceItem.getLatestChoiceItemPosition.invalidate();
        },
    });

    const { mutate: updateChoiceItemPosition } = api.choiceItem.updateChoiceItemPosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.choiceItem.getChoiceItemsByItemChoiceId.invalidate({ id: cardId });
        }
    });

    const [choiceItemsState, setChoiceItemsState] = useState<ChoiceItems>();

    useEffect(() => {
        if (choiceItems !== undefined) {
            setChoiceItemsState(choiceItems);
        }
    }, [choiceItems]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    function handleSortPositions() {
        const _choiceItems: ChoiceItems = [];

        if (!choiceItemsState) return null;
        choiceItemsState.forEach(choiceItem => _choiceItems.push(Object.assign({}, choiceItem)));

        const draggedItemContent = _choiceItems.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _choiceItems.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setChoiceItemsState(_choiceItems);
    }

    function handleUpdatePositionsClick() {
        if (!choiceItemsState) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        choiceItemsState.map(({ choiceItem }, index) => {
            updateChoiceItemPosition({ id: choiceItem.id, position: index })
        });
    }

    function mapChoiceItem() {
        if (itemId === "") {
            setDisplayError(true);

            setErrorText([
                itemId === "" ? "No item entered." : "",
            ])

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (itemId !== "") {
            setDisplayError(false);
            setDisplayLoadingToast(true);
            setLoadingToastText("Mapping Item...");

            createChoiceItem({
                choiceId: cardId,
                childItemId: Number(itemId),
                priceOne: formatPrice(priceOne),
                priceTwo: formatPrice(priceTwo),
                priceThree: formatPrice(priceThree),
                position: getNewPosition(choiceItemPosition),
            });
        }
    }

    function deleteMappedChoiceItem(id: number) {
        setDisplayLoadingToast(true);
        setLoadingToastText("Deleting Mapped Item...");

        deleteChoiceItem({
            id: id,
        });
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center mb-4">
                <h2 className="text-center capitalize">Assign Items</h2>

                <p className="text-xs font-light">Assign items to this choice set.</p>
            </div>

            <div className="flex flex-col space-y-4">
                <div>
                    <p className="p-1 font-light text-xs">Search items to assign to this choice set, you must click the item to assign.</p>

                    <InputSearchDropdown 
                        toggleDropdown={toggleItemDropdown}
                        setToggleDropdown={setToggleItemDropdown}
                        inputValue={itemInput}
                        setInputValue={setItemInput}
                        labelName="Item"    
                        itemData={itemData}
                        setDropdownItemsId={setItemId}
                    />
                </div>

                <div>
                    <p className="p-1 font-light text-xs">Update the price of the item within this choice set.</p>

                    <div className="flex space-x-6">
                        <Input 
                            inputValue={priceOne}
                            setInputValue={setPriceOne}
                            labelName="$ ~ Price Level 1" 
                            number={true}            
                        />

                        <Input 
                            inputValue={priceTwo}
                            setInputValue={setPriceTwo}
                            labelName="$ ~ Price Level 2" 
                            number={true}            
                        />

                        <Input 
                            inputValue={priceThree}
                            setInputValue={setPriceThree}
                            labelName="$ ~ Price Level 3" 
                            number={true}            
                        />
                    </div>
                </div>

                <div 
                    className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                    onClick={mapChoiceItem}
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
                                    Item
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    PL1
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    PL2
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    PL3
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {choiceItemsState && choiceItemsState.length > 0 && (
                                <>
                                    {choiceItemsState.map(({ choiceItem, user }, index) => (
                                        <tr 
                                            key={choiceItem.id}
                                            className="relative bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800 group"
                                            draggable
                                            onDragStart={(() => dragItem.current = index)}
                                            onDragEnter={(() => dragOverItem.current = index)}
                                            onDragOver={((e) => e.preventDefault())}
                                            onDragEnd={handleSortPositions}
                                            aria-disabled={true}
                                        >
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {choiceItem.childItem.id}
                                            </th>

                                            <td className="px-6 py-4">
                                                {choiceItem.childItem.itemName}
                                            </td>

                                            <td className="px-6 py-4">
                                                ${choiceItem.updatedPriceLevelOne}
                                            </td>

                                            <td className="px-6 py-4">
                                                ${choiceItem.updatedPriceLevelTwo}
                                            </td>

                                            <td className="px-6 py-4">
                                                ${choiceItem.updatedPriceLevelThree}
                                            </td>

                                            <td className="flex items-center space-x-2 px-6 py-4">
                                                <Image 
                                                    src={user?.profileImageUrl || ""}
                                                    className="rounded-full"
                                                    width={20}
                                                    height={20}
                                                    alt="User Profile Image"
                                                />

                                                <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(choiceItem.createdAt)}</p>
                                            </td>

                                            <td 
                                                className="invisible group-hover:visible absolute -top-2 -right-2 bg-red-500/80 p-1 rounded-full hover:scale-110"
                                                onClick={(() => deleteMappedChoiceItem(choiceItem.id))}
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

const ItemChoiceConfiguration = () => {
    const [displayName, setDisplayName] = useAtom(displayNameAtom);
    const [itemChoiceSelections, setItemChoiceSelections] = useAtom(itemChoiceSelectionsAtom);
    const [itemChoiceRequired, setItemChoiceRequired] = useAtom(itemChoiceRequiredAtom);
    const [itemChoiceInfo, setItemChoiceInfo] = useAtom(itemChoiceInfoAtom);

    const [toggleRequiredDropdown, setToggleRequiredDropdown] = useState(false);

    return (
        <div className="flex flex-col space-y-10 mt-8">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-center">Item Choice Configuration</h2>

                    <p className="text-xs font-light">Update item choice configuration settings.</p>
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the item choice name that will display on the UI.</p>

                    <Input 
                        inputValue={displayName}
                        setInputValue={setDisplayName}
                        labelName="Display Name"           
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the number of selections for this choice.</p>

                    <Input 
                        inputValue={itemChoiceSelections}
                        setInputValue={setItemChoiceSelections}
                        labelName="Selections"
                        number={true}           
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Determine whether the current choice set is required or optional.</p>

                    <InputForDropdown 
                        toggleDropdown={toggleRequiredDropdown}
                        setToggleDropdown={setToggleRequiredDropdown}
                        inputValue={itemChoiceRequired}
                        setInputValue={setItemChoiceRequired}
                        dropdownItems={["Yes", "No"]}
                        labelName="Required"
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Add a description.</p>

                    <textarea 
                        rows={5} 
                        className=" p-2.5 md:mt-1 2xl:mt-0 w-full text-xs rounded-lg border outline-none focus:border-slate-300 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:focus:border-neutral-600 dark:placeholder:text-zinc-500" 
                        placeholder="Choice Description"
                        value={itemChoiceInfo}
                        onChange={((e) => setItemChoiceInfo(e.target.value))}
                    >
                    </textarea>
                </div>

            </div>

        </div>  
    );
};

const ItemChoices = () => {
    const [displayError, setDisplayError] = useAtom(displayErrorAtom);  
    const [displayLoadingToast, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
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
    const [itemChoiceSelections, setItemChoiceSelections] = useAtom(itemChoiceSelectionsAtom);
    const [itemChoiceRequired, setItemChoiceRequired] = useAtom(itemChoiceRequiredAtom);
    const [itemChoiceInfo, setItemChoiceInfo] = useAtom(itemChoiceInfoAtom);

    const [checkCardTitle, setCheckCardTitle] = useAtom(checkCardTitleAtom);
    const [checkDisplayName, setCheckDisplayName] = useAtom(checkDisplayNameAtom);
    const [checkItemChoiceSelections, setCheckItemChoiceSelections] = useAtom(checkItemChoiceSelectionsAtom);
    const [checkItemChoiceRequired, setCheckItemChoiceRequired] = useAtom(checkItemChoiceRequiredAtom);
    const [checkItemChoiceInfo, setCheckItemChoiceInfo] = useAtom(checkItemChoiceInfoAtom);

    const [, setDay] = useAtom(dayAtom);
    const [, setStartTime] = useAtom(startTimeAtom);
    const [, setEndTime] = useAtom(endTimeAtom);

    const [, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const user = useUser();

    const { mutate: updateItemChoicePosition } = api.itemChoice.updateItemChoicePosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.itemChoice.getAllItemChoices.invalidate();
        }
    });

    const { data: itemChoices } = api.itemChoice.getAllItemChoices.useQuery();

    const [itemChoicesState, setItemChoicesState] = useState<ItemChoices>();

    useEffect(() => {
        if (itemChoices !== undefined) {
            setItemChoicesState(itemChoices);
        }
    }, [itemChoices]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    function handleNewCardClick() {
        if (displayCard) return null;

        setNewCard(true);
        setDisplayCard(true); 
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
            itemChoiceName: string, 
            itemChoiceDisplayName: string,
            itemChoiceSelections: number,
            itemChoiceRequired: boolean,
            itemChoiceInfo: string,
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) {
        if (displayCard) return null;

        setDisplayCard(true); 
        setCardTitle(itemChoiceName);
        setCheckCardTitle(itemChoiceName);
        setDisplayName(itemChoiceDisplayName);
        setCheckDisplayName(itemChoiceDisplayName);
        setItemChoiceSelections(itemChoiceSelections.toString())
        setCheckItemChoiceSelections(itemChoiceSelections.toString());
        setItemChoiceRequired(itemChoiceRequired ? "Yes" : "No");
        setCheckItemChoiceRequired(itemChoiceRequired ? "Yes" : "No")
        setItemChoiceInfo(itemChoiceInfo);
        setCheckItemChoiceInfo(itemChoiceInfo);
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

    function handleSortPositions() {
        const _itemChoices: ItemChoices = [];

        if (!itemChoicesState) return null;
        itemChoicesState.forEach(itemChoice => _itemChoices.push(Object.assign({}, itemChoice)));

        const draggedItemContent = _itemChoices.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _itemChoices.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setItemChoicesState(_itemChoices);
    }

    function handleUpdatePositionsClick() {
        if (!itemChoicesState) return null;
        if (displayCard) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        itemChoicesState.map(({ itemChoice }, index) => {
            updateItemChoicePosition({ id: itemChoice.id, position: index })
        });
    }

    const handleCloseAdminCardClick = () => {
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
    };

    if (!itemChoicesState) {
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
                    <div className="flex flex-col space-y-1 py-2">
                        <h1 className="text-[2rem] font-medium">PLU Choices</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                                <div className="items-center space-y-1">
                                    <p className="dark:text-neutral-200">
                                        Create PLU choice sets, position them from top to bottom to give certain choicesets precedence over others.
                                    </p>

                                    <p className="dark:text-neutral-200">
                                        Simply drag and drop to update positions, choices positioned higher in the list take greater precedence when rendering to the UI.
                                    </p>
                                </div>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className={`flex flex-col space-y-4 px-2 border-b dark:border-b-neutral-700 pb-4`}>
                            <div 
                                className={`flex text-xs items-center space-x-1 w-fit text-zinc-500 group dark:hover:text-neutral-300/70 ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                onClick={handleNewCardClick}
                            >
                                <BsPlusLg 
                                    className={`${displayCard ? "" : "group-hover:text-blue-400 dark:group-hover:text-pink-300/70" || ""}`} 
                                />

                                <p className={`${displayCard ? "" : "group-hover:text-slate-800 dark:group-hover:text-neutral-300/70" || ""}`}>Add Choice</p>
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
                                            Choice
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Display name
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Selections
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Required
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Description
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Created
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {itemChoicesState && itemChoicesState.length > 0 && (
                                        <>
                                            {itemChoicesState.map(({ itemChoice, user, updatedUser }, index) => (
                                                <tr 
                                                    key={itemChoice.id}
                                                    className="bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800"
                                                    onClick={(() => 
                                                        handleCardClick(
                                                            itemChoice.id,
                                                            itemChoice.choiceName,
                                                            itemChoice.choiceDisplayName,
                                                            itemChoice.selections,
                                                            itemChoice.required,
                                                            itemChoice.description,
                                                            formatUserName(user?.firstName || "", user?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(itemChoice.createdAt),
                                                            formatUserName(updatedUser?.firstName || "", updatedUser?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(itemChoice.updatedAt)
                                                        )
                                                    )}
                                                    draggable
                                                    onDragStart={(() => dragItem.current = index)}
                                                    onDragEnter={(() => dragOverItem.current = index)}
                                                    onDragOver={((e) => e.preventDefault())}
                                                    onDragEnd={handleSortPositions}
                                                    aria-disabled={true}
                                                >
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {itemChoice.id}
                                                    </th>

                                                    <td className="px-6 py-4">
                                                        {itemChoice.choiceName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {itemChoice.choiceDisplayName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {itemChoice.selections}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {itemChoice.required ? "Yes" : "No"}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {itemChoice.description}
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
                configuration={<ItemChoiceConfiguration />} 
                itemChoiceItemMap={<MapItem />}
                mutateButton={<MutateButton />}
            />

        </div>
    );
};

export default ItemChoices;