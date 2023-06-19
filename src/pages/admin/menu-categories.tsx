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
    checkMenuCategoryInfoAtom,
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
    menuCategoryInfoAtom,
    newCardAtom,
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
import { RxUpdate } from "react-icons/rx";
import { getNewPosition } from "~/utils/getNewPosition";
import InputSearchDropdown from "~/components/inputs/InputSearchDropdown";

type MenuCategories = RouterOutputs["menuCategory"]["getAllMenuCategories"];
type MappedMenuCategoryItems = RouterOutputs["menuCategoryItemMap"]["getMappedMenuCategoryItemsByMenuCategoryId"];

const MapItem = () => {
    const [toggleItemDropdown, setToggleItemDropdown] = useState(false);
    const [itemInput, setItemInput] = useState("");
    const [itemId, setItemId] = useState("");

    const [, setDisplayError] = useAtom(displayErrorAtom);
    const [, setErrorText] = useAtom(errorTextAtom);

    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const [cardId] = useAtom(cardIdAtom);
    
    const ctx = api.useContext();

    const { data: itemData } = api.item.getAllItemsForDropdown.useQuery();
    const { data: menuCategoryItems } = api.menuCategoryItemMap.getMappedMenuCategoryItemsByMenuCategoryId.useQuery({ id: cardId });
    const { data: menuCategoryItemPosition } = api.menuCategoryItemMap.getLatestMappedMenuCategoryItemPosition.useQuery({ id: cardId });

    const { mutate: createMenuCategoryItem } = api.menuCategoryItemMap.createMappedMenuCategoryItem.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setItemId("");
            setItemInput("");
            void ctx.menuCategoryItemMap.getMappedMenuCategoryItemsByMenuCategoryId.invalidate({ id: cardId });
            void ctx.menuCategoryItemMap.getLatestMappedMenuCategoryItemPosition.invalidate({ id: cardId });
        },
    });

    const { mutate: deleteMenuCategoryItem } = api.menuCategoryItemMap.deleteMappedMenuCategoryItem.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            void ctx.menuCategoryItemMap.getMappedMenuCategoryItemsByMenuCategoryId.invalidate({ id: cardId });
            void ctx.menuCategoryItemMap.getLatestMappedMenuCategoryItemPosition.invalidate({ id: cardId });
        },
    });

    const { mutate: updateMenuCategoryItemPosition } = api.menuCategoryItemMap.updateMappedMenuCategoryItemPosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.menuCategoryItemMap.getMappedMenuCategoryItemsByMenuCategoryId.invalidate({ id: cardId });
        }
    });

    const [menuCategoryItemsState, setMenuCategoryItemsState] = useState<MappedMenuCategoryItems>();

    useEffect(() => {
        if (menuCategoryItems !== undefined) {
            setMenuCategoryItemsState(menuCategoryItems);
        }
    }, [menuCategoryItems]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    function handleSortPositions() {
        const _menuCategoryItems: MappedMenuCategoryItems = [];

        if (!menuCategoryItemsState) return null;
        menuCategoryItemsState.forEach(item => _menuCategoryItems.push(Object.assign({}, item)));

        const draggedItemContent = _menuCategoryItems.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _menuCategoryItems.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setMenuCategoryItemsState(_menuCategoryItems);
    }

    function handleUpdatePositionsClick() {
        if (!menuCategoryItemsState) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        menuCategoryItemsState.map(({ menuCategoryItem }, index) => {
            updateMenuCategoryItemPosition({ id: menuCategoryItem.id, position: index })
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

            createMenuCategoryItem({
                menuCategoryId: cardId,
                itemId: Number(itemId),
                position: getNewPosition(menuCategoryItemPosition),
            });
        }
    }

    function deleteMappedChoiceItem(id: number) {
        setDisplayLoadingToast(true);
        setLoadingToastText("Deleting Item...");

        deleteMenuCategoryItem({
            id: id,
        });
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center mb-4">
                <h2 className="text-center capitalize">Assign Items</h2>

                <p className="text-xs font-light">Assign items to this menu category.</p>
            </div>

            <div className="flex flex-col space-y-4">
                <div>
                    <p className="p-1 font-light text-xs">Search items to assign to this menu category, you must click the item to assign.</p>

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
                                    Price
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Class
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {menuCategoryItemsState && menuCategoryItemsState.length > 0 && (
                                <>
                                    {menuCategoryItemsState.map(({ menuCategoryItem, user }, index) => (
                                        <tr 
                                            key={menuCategoryItem.id}
                                            className="relative bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800 group"
                                            draggable
                                            onDragStart={(() => dragItem.current = index)}
                                            onDragEnter={(() => dragOverItem.current = index)}
                                            onDragOver={((e) => e.preventDefault())}
                                            onDragEnd={handleSortPositions}
                                            aria-disabled={true}
                                        >
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {menuCategoryItem.item.id}
                                            </th>

                                            <td className="px-6 py-4">
                                                {menuCategoryItem.item.itemName}
                                            </td>

                                            <td className="px-6 py-4">
                                                ${menuCategoryItem.item.priceLevelOne}
                                            </td>

                                            <td className="px-6 py-4">
                                                {menuCategoryItem.item.category.categoryName}
                                            </td>

                                            <td className="px-6 py-4">
                                                {menuCategoryItem.item.class.className}
                                            </td>

                                            <td className="flex items-center space-x-2 px-6 py-4">
                                                <Image 
                                                    src={user?.profileImageUrl || ""}
                                                    className="rounded-full"
                                                    width={20}
                                                    height={20}
                                                    alt="User Profile Image"
                                                />

                                                <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(menuCategoryItem.createdAt)}</p>
                                            </td>

                                            <td 
                                                className="invisible group-hover:visible absolute -top-2 -right-2 bg-red-500/80 p-1 rounded-full hover:scale-110"
                                                onClick={(() => deleteMappedChoiceItem(menuCategoryItem.id))}
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

const MenuCategoryConfiguration = () => {
    const [menuCategoryDisplayName, setMenuCategoryDisplayName] = useAtom(displayNameAtom);
    const [menuCategoryInfo, setMenuCategoryInfo] = useAtom(menuCategoryInfoAtom);

    return (
        <div className="flex flex-col space-y-10 mt-8">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-center">Menu Category Configuration</h2>

                    <p className="text-xs font-light">Update menu category configuration settings.</p>
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the menu category name that will display on the UI.</p>

                    <Input 
                        inputValue={menuCategoryDisplayName}
                        setInputValue={setMenuCategoryDisplayName}
                        labelName="Display Name"           
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Add a description.</p>

                    <textarea 
                        rows={5} 
                        className=" p-2.5 md:mt-1 2xl:mt-0 w-full text-xs rounded-lg border outline-none focus:border-slate-300 bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:focus:border-neutral-600 dark:placeholder:text-zinc-500" 
                        placeholder="Category Description"
                        value={menuCategoryInfo}
                        onChange={((e) => setMenuCategoryInfo(e.target.value))}
                    >
                    </textarea>
                </div>

            </div>

        </div>  
    );
};

const MenuCategories = () => {
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

    const [cardId, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [displayName, setDisplayName] = useAtom(displayNameAtom);
    const [menuCategoryInfo, setMenuCategoryInfo] = useAtom(menuCategoryInfoAtom)

    const [checkMenuCategoryName, setCheckMenuCategoryName] = useAtom(checkCardTitleAtom);
    const [checkDisplayName, setCheckDisplayName] = useAtom(checkDisplayNameAtom);
    const [checkMenuCategoryInfo, setCheckMenuCategoryInfo] = useAtom(checkMenuCategoryInfoAtom);

    const [, setDay] = useAtom(dayAtom);
    const [, setStartTime] = useAtom(startTimeAtom);
    const [, setEndTime] = useAtom(endTimeAtom);

    const [, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const user = useUser();

    const { mutate: updateMenuCategoryPositions } = api.menuCategory.updateMenuCategoryPosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.menuCategory.getAllMenuCategories.invalidate();
        }
    });

    const { data: menuCategories } = api.menuCategory.getAllMenuCategories.useQuery();
    const { data: availabilityRules } = api.menuCategory.getMenuCategoryAvailabilityRuleById.useQuery({ id: cardId });


    const [menuCategoriesState, setMenusCategoriesState] = useState<MenuCategories>();

    useEffect(() => {
        if (menuCategories !== undefined) {
            setMenusCategoriesState(menuCategories);
        }
    }, [menuCategories]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    function handleNewCardClick() {
        if (displayCard) return null;

        setNewCard(true);
        setDisplayCard(true); 
        setCardTitle("");
        setCheckMenuCategoryName("");
        setDisplayName("");
        setCheckDisplayName("");
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
            menuCategoryName: string, 
            menuCategoryDisplayName: string,
            menuCategoryDescription: string,
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) {
        if (displayCard) return null;

        setDisplayCard(true); 
        setCardTitle(menuCategoryName);
        setCheckMenuCategoryName(menuCategoryName);
        setDisplayName(menuCategoryDisplayName);
        setCheckDisplayName(menuCategoryDisplayName);
        setMenuCategoryInfo(menuCategoryDescription);
        setCheckMenuCategoryInfo(menuCategoryDescription);
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
        const _menuCategories: MenuCategories = [];

        if (!menuCategoriesState) return null;
        menuCategoriesState.forEach(menuCategory => _menuCategories.push(Object.assign({}, menuCategory)));

        const draggedItemContent = _menuCategories.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _menuCategories.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setMenusCategoriesState(_menuCategories);
    }

    function handleUpdatePositionsClick() {
        if (!menuCategoriesState) return null;
        if (displayCard) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        menuCategoriesState.map(({ menuCategory }, index) => {
            updateMenuCategoryPositions({ id: menuCategory.id, position: index })
        });
    }

    const handleCloseAdminCardClick = () => {
        if (checkMenuCategoryName !== cardTitle || checkDisplayName !== displayName || menuCategoryInfo !== checkMenuCategoryInfo) {
            setConfirmChanges(true);

            setTimeout(() => {
                setConfirmChangesAnimation(true);
            }, 100);

        } else {
            setCardTransition(false);
            setConfirmChanges(false);
    
            setTimeout(() => {
                setDisplayCard(false);
                setConfirmChanges(false);
                setNewCard(false);
            }, 750);
        }
    };

    if (!menuCategoriesState) {
        setLoadingToastText("Loading...");
        return <LoadingToast />;
    } 

    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = `${hour.toString().length === 1 ? `0${hour}` : hour}:
    ${minute.toString().length === 1 ? `0${minute}` : minute}`;

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
                        <h1 className="text-[2rem] font-medium">Menus Categories</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                                <div className="items-center space-y-1">
                                    <p className="dark:text-neutral-200">
                                        Create menu categories, position them from top to bottom to give certain categories precedence over others.
                                    </p>

                                    <p className="dark:text-neutral-200">
                                        Simply drag and drop to update positions, categories positioned higher in the list take greater precedence when rendering to the UI.
                                    </p>
                                </div>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className={`flex flex-col space-y-4 px-2 border-b dark:border-b-neutral-700 pb-4`}>
                            <div 
                                className={`text-xs flex items-center space-x-1 w-fit text-zinc-500 group dark:hover:text-neutral-300/70 ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                onClick={handleNewCardClick}
                            >
                                <BsPlusLg 
                                    className={`${displayCard ? "" : "group-hover:text-blue-400 dark:group-hover:text-pink-300/70" || ""}`} 
                                />

                                <p className={`${displayCard ? "" : "group-hover:text-slate-800 dark:group-hover:text-neutral-300/70" || ""}`}>Add Category</p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            {menuCategoriesState?.map(({ menuCategory, user, updatedUser }, index) => (
                                <div 
                                    key={menuCategory.id}
                                    className={`flex flex-col justify-start border dark:border-neutral-800 border-neutral-200 dark:bg-zinc-800/50 p-4 rounded-md shadow-md ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                    onClick={(() => 
                                        handleCardClick(
                                            menuCategory.id, 
                                            menuCategory.menuCategoryName, 
                                            menuCategory.menuCategoryDisplayName,
                                            menuCategory.description,
                                            formatUserName(user?.firstName || "", user?.lastName || ""),
                                            user?.profileImageUrl || "",
                                            formatTimestamp(menuCategory.createdAt),
                                            formatUserName(updatedUser?.firstName || "", updatedUser?.lastName || ""),
                                            user?.profileImageUrl || "",
                                            formatTimestamp(menuCategory.updatedAt)
                                        )
                                    )}
                                    draggable
                                    onDragStart={(() => dragItem.current = index)}
                                    onDragEnter={(() => dragOverItem.current = index)}
                                    onDragOver={((e) => e.preventDefault())}
                                    onDragEnd={handleSortPositions}
                                    aria-disabled={true}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex flex-col space-y-2 mb-2">
                                            <div className="flex items-center space-x-1.5">
                                                <Image 
                                                    src={user?.profileImageUrl || ""}
                                                    className="rounded-full"
                                                    width={20}
                                                    height={20}
                                                    alt="User Profile Image"
                                                />

                                                <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(menuCategory.createdAt)}</p>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <h1 className="text-lg">{menuCategory.menuCategoryName}</h1>

                                                {(menuCategory.menuCategoryAvailability.filter(function(e) { return e.dayOfWeek === day && e.startTime <= time && e.endTime >= time; }).length > 0) ? (
                                                    <div className="flex items-center space-x-1">
                                                        <span className="border border-green-500 rounded-full h-1 w-1 bg-green-500">{" "}</span>

                                                        <p className="text-xs font-light text-green-500">Available</p>
                                                    </div>

                                                ) : (
                                                    <div className="flex items-center space-x-1">
                                                        <span className="border border-red-500 rounded-full h-1 w-1 bg-red-500">{" "}</span>

                                                        <p className="text-xs font-light text-red-500">Unavailable</p>
                                                    </div>       
                                                )}

                                            </div>
                                            
                                        </div>

                                    </div>

                                    {menuCategory.menuCategoryItems.length === 0 && (
                                        <p className="text-xs font-light italic">No Items</p>
                                    )}

                                    <div className="flex flex-wrap gap-4">
                                        {menuCategory.menuCategoryItems.map(({ item }) => (
                                            <div className="flex flex-col space-y-0.5 items-center">
                                                <p className="text-[10px] 2xl:text-xs w-16 2xl:w-20 text-center truncate">{item.itemName}</p>

                                                <img 
                                                    src={item.image} 
                                                    alt="" 
                                                    className="object-cover w-16 h-16 2xl:w-20 2xl:h-20 rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                
                                </div>

                            ))}

                        </div>

                    </div>
            
                </div>

            </div>

            <AdminCard
            adminCardFunctions={<AdminCardFunctions />}
                configuration={<MenuCategoryConfiguration />} 
                locationMapping={
                    <LocationMapping 
                        headerTitle="menu category" 
                        paragraphTitle="menu categories"
                    />
                }
                menuAvailability={
                    <MenuAvailability 
                        title="menu category" 
                        menuCategoryAvailabilityData={availabilityRules} 
                    />
                }
                menuCategoryItems={<MapItem />}
                mutateButton={<MutateButton />}
            />

        </div>
    );
};

export default MenuCategories;