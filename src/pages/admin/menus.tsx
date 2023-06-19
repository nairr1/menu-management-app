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
    checkMenuTypeAtom,
    checkPriceLevelAtom,
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
    menuTypeAtom,
    newCardAtom,
    priceLevelAtom,
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
import InputForDropdown from "~/components/inputs/InputForDropdown";
import InputSearchDropdown from "~/components/inputs/InputSearchDropdown";
import { getNewPosition } from "~/utils/getNewPosition";

type Menus = RouterOutputs["menu"]["getAllMenus"];
type MappedMenuCategories = RouterOutputs["menuCategoryMap"]["getMappedMenuCategoriesByMenuId"];

const MappedMenuCategories = () => {
    const [toggleMenuCategoryDropdown, setToggleMenuCategoryDropdown] = useState(false);
    const [menuCategoryInput, setMenuCategoryInput] = useState("");
    const [menuCategoryId, setMenuCategoryId] = useState("");

    const [, setDisplayError] = useAtom(displayErrorAtom);
    const [, setErrorText] = useAtom(errorTextAtom);

    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const [cardId] = useAtom(cardIdAtom);
    
    const ctx = api.useContext();

    const { data: menuCategoryData } = api.menuCategory.getAllMenuCategoriesForDropdown.useQuery();
    const { data: mappedMenuCategories } = api.menuCategoryMap.getMappedMenuCategoriesByMenuId.useQuery({ id: cardId });
    const { data: mappedMenuCategoryPosition } = api.menuCategoryMap.getLatestMappedMenuCategoryPosition.useQuery({ id: cardId });

    const { mutate: createMappedMenuCategory } = api.menuCategoryMap.createMappedMenuCategory.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setMenuCategoryId("");
            setMenuCategoryInput("");
            void ctx.menuCategoryMap.getMappedMenuCategoriesByMenuId.invalidate({ id: cardId });
            void ctx.menuCategoryMap.getLatestMappedMenuCategoryPosition.invalidate({ id: cardId });
        },
    });

    const { mutate: deleteMappedMenuCategory } = api.menuCategoryMap.deleteMappedMenuCategory.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            void ctx.menuCategoryMap.getMappedMenuCategoriesByMenuId.invalidate({ id: cardId });
            void ctx.menuCategoryMap.getLatestMappedMenuCategoryPosition.invalidate({ id: cardId });
        },
    });

    const { mutate: updateMappedMenuCategoryPosition } = api.menuCategoryMap.updateMappedMenuCategoryPosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.menuCategoryMap.getMappedMenuCategoriesByMenuId.invalidate({ id: cardId });
        }
    });

    const [mappedMenuCategoriesState, setMappedMenuCategoriesState] = useState<MappedMenuCategories>();

    useEffect(() => {
        if (mappedMenuCategories !== undefined) {
            setMappedMenuCategoriesState(mappedMenuCategories);
        }
    }, [mappedMenuCategories]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    function handleSortPositions() {
        const _mappedMenuCategory: MappedMenuCategories = [];

        if (!mappedMenuCategoriesState) return null;
        mappedMenuCategoriesState.forEach(menuCategory => _mappedMenuCategory.push(Object.assign({}, menuCategory)));

        const draggedItemContent = _mappedMenuCategory.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _mappedMenuCategory.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setMappedMenuCategoriesState(_mappedMenuCategory);
    }

    function handleUpdatePositionsClick() {
        if (!mappedMenuCategoriesState) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        mappedMenuCategoriesState.map(({ menuCategory }, index) => {
            updateMappedMenuCategoryPosition({ id: menuCategory.id, position: index })
        });
    }

    function mapChoiceItem() {
        if (menuCategoryId === "") {
            setDisplayError(true);

            setErrorText([
                menuCategoryId === "" ? "No menu category entered." : "",
            ])

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (menuCategoryId !== "") {
            setDisplayError(false);
            setDisplayLoadingToast(true);
            setLoadingToastText("Mapping Category...");

            createMappedMenuCategory({
                menuId: cardId,
                menuCategoryId: Number(menuCategoryId),
                position: getNewPosition(mappedMenuCategoryPosition),
            });
        }
    }

    function deleteMappedChoiceItem(id: number) {
        setDisplayLoadingToast(true);
        setLoadingToastText("Deleting Category...");

        deleteMappedMenuCategory({
            id: id,
        });
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center mb-4">
                <h2 className="text-center capitalize">Assign Menu Categories</h2>

                <p className="text-xs font-light">Assign menu categories to this menu.</p>
            </div>

            <div className="flex flex-col space-y-4">
                <div>
                    <p className="p-1 font-light text-xs">Search menu categories to assign to this menu, you must click the category to assign.</p>

                    <InputSearchDropdown 
                        toggleDropdown={toggleMenuCategoryDropdown}
                        setToggleDropdown={setToggleMenuCategoryDropdown}
                        inputValue={menuCategoryInput}
                        setInputValue={setMenuCategoryInput}
                        labelName="Menu Category"    
                        menuCategoryData={menuCategoryData}
                        setDropdownItemsId={setMenuCategoryId}
                    />
                </div>

                <div 
                    className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                    onClick={mapChoiceItem}
                >
                    <BsPlusLg 
                        className="group-hover:text-blue-400 dark:group-hover:text-pink-300/70" 
                    />

                    <p className="group-hover:text-slate-800 dark:group-hover:text-neutral-300/70 text-xs">Add Category</p>
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
                                    Category
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Display Name
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    Created
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {mappedMenuCategoriesState && mappedMenuCategoriesState.length > 0 && (
                                <>
                                    {mappedMenuCategoriesState.map(({ menuCategory, user }, index) => (
                                        <tr 
                                            key={menuCategory.id}
                                            className="relative bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800 group"
                                            draggable
                                            onDragStart={(() => dragItem.current = index)}
                                            onDragEnter={(() => dragOverItem.current = index)}
                                            onDragOver={((e) => e.preventDefault())}
                                            onDragEnd={handleSortPositions}
                                            aria-disabled={true}
                                        >
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {menuCategory.menuCategory.id}
                                            </th>

                                            <td className="px-6 py-4">
                                                {menuCategory.menuCategory.menuCategoryName}
                                            </td>

                                            <td className="px-6 py-4">
                                                {menuCategory.menuCategory.menuCategoryDisplayName}
                                            </td>

                                            <td className="flex items-center space-x-2 px-6 py-4">
                                                <Image 
                                                    src={user?.profileImageUrl || ""}
                                                    className="rounded-full"
                                                    width={20}
                                                    height={20}
                                                    alt="User Profile Image"
                                                />

                                                <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(menuCategory.createdAt)}</p>
                                            </td>

                                            <td 
                                                className="invisible group-hover:visible absolute -top-2 -right-2 bg-red-500/80 p-1 rounded-full hover:scale-110"
                                                onClick={(() => deleteMappedChoiceItem(menuCategory.id))}
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

const MenuConfiguration = () => {
    const [toggleMenuTypeDropdown, setToggleMenuTypeDropdown] = useState(false);
    const [togglePriceLevelDropdown, setTogglePriceLevelDropdown] = useState(false);

    const [menuType, setMenuType] = useAtom(menuTypeAtom);
    const [priceLevel, setPriceLevel] = useAtom(priceLevelAtom);
    const [menuDisplayName, setMenuDisplayName] = useAtom(displayNameAtom);

    return (
        <div className="flex flex-col space-y-10 mt-8">
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-center">Menu Configuration</h2>

                    <p className="text-xs font-light">Update menu configuration settings.</p>
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Input the menu name that will display on the UI.</p>

                    <Input 
                        inputValue={menuDisplayName}
                        setInputValue={setMenuDisplayName}
                        labelName="Display Name"           
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Select whether the menu will apply at POS or for Web Ordering.</p>

                    <InputForDropdown 
                        toggleDropdown={toggleMenuTypeDropdown}
                        setToggleDropdown={setToggleMenuTypeDropdown}
                        inputValue={menuType}
                        setInputValue={setMenuType}
                        dropdownItems={["POS", "Web Ordering"]}
                        labelName="Menu Type"
                    />
                </div>

                <div className="">
                    <p className="p-1 font-light text-xs">Set the price level that&#8217;s utilised for all items that are added to this menu.</p>

                    <InputForDropdown 
                        toggleDropdown={togglePriceLevelDropdown}
                        setToggleDropdown={setTogglePriceLevelDropdown}
                        inputValue={priceLevel}
                        setInputValue={setPriceLevel}
                        dropdownItems={["1", "2", "3"]}
                        labelName="Price Level"
                    />
                </div>

            </div>

        </div>  
    );
};

const Menus = () => {
    const [displayError] = useAtom(displayErrorAtom);  
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
    const [menuType, setMenuType] = useAtom(menuTypeAtom);
    const [priceLevel, setPriceLevel] = useAtom(priceLevelAtom);

    const [checkMenuName, setCheckMenuName] = useAtom(checkCardTitleAtom);
    const [checkDisplayName, setCheckDisplayName] = useAtom(checkDisplayNameAtom);
    const [checkMenuType, setCheckMenuType] = useAtom(checkMenuTypeAtom);
    const [checkPriceLevel, setCheckPriceLevel] = useAtom(checkPriceLevelAtom);

    const [, setDay] = useAtom(dayAtom);
    const [, setStartTime] = useAtom(startTimeAtom);
    const [, setEndTime] = useAtom(endTimeAtom);

    const [, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const { data: menus } = api.menu.getAllMenus.useQuery();
    const { data: availabilityRules } = api.menu.getMenuAvailabilityRuleByMenuId.useQuery({ id: cardId });

    const { data: menuData } = api.menu.getMenuData.useQuery();

    const user = useUser();

    function handleNewCardClick() {
        if (displayCard) return null;

        setNewCard(true);
        setDisplayCard(true); 
        setCardTitle("");
        setCheckMenuName("");
        setDisplayName("");
        setCheckDisplayName("");
        setMenuType("");
        setCheckMenuType("");
        setPriceLevel("");
        setCheckPriceLevel("");
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
        menuName: string, 
        menuDisplayName: string,
        menuType: number, 
        priceLevel: number,
        createdUserName: string,
        createdUserImage: string,
        createdAt: string,
        updatedUserName: string,
        updatedUserImage: string,
        updatedAt: string,
    ) {
        if (displayCard) return null;

        setDisplayCard(true); 
        setCardTitle(menuName);
        setCheckMenuName(menuName);
        setDisplayName(menuDisplayName);
        setCheckDisplayName(menuDisplayName);
        menuType === 1 ? setMenuType("POS") : setMenuType("Web Ordering");
        menuType === 1 ? setCheckMenuType("POS") : setCheckMenuType("Web Ordering");
        setPriceLevel(priceLevel.toString());
        setCheckPriceLevel(priceLevel.toString());
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
        if (checkMenuName !== cardTitle || checkDisplayName !== displayName || checkMenuType !== menuType || checkPriceLevel !== priceLevel) {
            setConfirmChanges(true);

            setTimeout(() => {
                setConfirmChangesAnimation(true);
            }, 100);

        } else {
            setCardTransition(false);
            setConfirmChangesAnimation(false);
    
            setTimeout(() => {
                setDisplayCard(false);
                setConfirmChanges(false);
                setNewCard(false);
            }, 750);
        }
    };

    if (!menus) {
        setLoadingToastText("Loading...");
        return <LoadingToast />;
    } 

    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = `${hour.toString().length === 1 ? `0${hour}` : hour}:
    ${minute.toString().length === 1 ? `0${minute}` : minute}`;

    console.log(menuData)

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
                        <h1 className="text-[2rem] font-medium">Menus</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                                <div className="items-center space-y-1">
                                    <p className="dark:text-neutral-200">
                                        Create menus for Web Ordering and POS, position them from top to bottom to give certain menus precedence over others.
                                    </p>

                                    <p className="dark:text-neutral-200">
                                        Simply drag and drop to update positions, menus positioned higher in the list take greater precedence when rendering to the UI. 
                                    </p>
                                </div>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className={`flex flex-col space-y-4 px-2 border-b dark:border-b-neutral-700 pb-4`}>
                            <div 
                                className={`text-xs flex items-center space-x-1 w-fit text-zinc-500 group ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                onClick={handleNewCardClick}
                            >
                                <BsPlusLg 
                                    className={`${displayCard ? "" : "group-hover:text-blue-400 dark:group-hover:text-pink-300/70" || ""}`} 
                                />

                                <p className={`${displayCard ? "" : "group-hover:text-slate-800 dark:group-hover:text-neutral-300/70" || ""}`}>Add Menu</p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            {menus?.map(({ menu, user, updatedUser }) => (
                                <div 
                                    key={menu.id}
                                    className={`flex flex-col justify-start border dark:border-neutral-800 border-neutral-200 dark:bg-zinc-800/50 p-4 shadow-md rounded-md ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                    onClick={(() => 
                                        handleCardClick(
                                            menu.id, 
                                            menu.menuName, 
                                            menu.menuDisplayName,
                                            menu.menuType,
                                            menu.priceLevel,
                                            formatUserName(user?.firstName || "", user?.lastName || ""),
                                            user?.profileImageUrl || "",
                                            formatTimestamp(menu.createdAt),
                                            formatUserName(updatedUser?.firstName || "", updatedUser?.lastName || ""),
                                            user?.profileImageUrl || "",
                                            formatTimestamp(menu.updatedAt)
                                        )
                                    )}
                                >
                                    <div className="flex">
                                        <div className="flex flex-col space-y-2 mb-4">
                                            <div className="flex items-center space-x-1.5">
                                                <Image 
                                                    src={user?.profileImageUrl || ""}
                                                    className="rounded-full"
                                                    width={20}
                                                    height={20}
                                                    alt="User Profile Image"
                                                />

                                                <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(menu.createdAt)}</p>
                                                
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <h1 className="text-lg">{menu.menuName}</h1>

                                                {(menu.menuAvailability.filter(function(e) { return e.dayOfWeek === day && e.startTime <= time && e.endTime >= time; }).length > 0) ? (
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

                                            <div className="flex space-x-2 w-fit">
                                                <p className={`text-xs ${menu.menuType === 1 ? "bg-blue-100 dark:bg-pink-400/60" : "bg-fuchsia-100 dark:bg-lime-400/50"} px-2 py-0.5 rounded-md`}>
                                                    {menu.menuType === 1 ? "POS" : "Web Ordering"}
                                                </p>

                                                <p 
                                                    className={`text-xs px-2 py-0.5 rounded-md
                                                        ${menu.priceLevel === 1 && "bg-orange-100 dark:bg-blue-400/50" || ""}
                                                        ${menu.priceLevel === 2 && "bg-lime-100 dark:bg-emerald-400/50" || ""}
                                                        ${menu.priceLevel === 3 && "bg-cyan-100 dark:bg-indigo-400/50" || ""}
                                                    `}
                                                >
                                                    Price Level {menu.priceLevel}
                                                </p>
                                            </div>
                                            
                                        </div>

                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {menu.menuCategoriesMenuMapping.map(({ menuCategory }) => (
                                            <div 
                                                key={menuCategory.id}
                                                className="flex flex-col space-y-3 border bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-800 shadow-md rounded-lg p-4"
                                            >
                                                <p className="dark:text-zinc-200 font-light">{menuCategory.menuCategoryName}</p>

                                                {menuCategory.menuCategoryItems.length === 0 && (
                                                    <p className="text-xs font-light italic">No Items</p>
                                                )}

                                                <div className="flex flex-wrap items-center gap-4">
                                                    {menuCategory.menuCategoryItems.map(({ item }) => (
                                                        <div 
                                                            key={item.id}
                                                            className="flex flex-col space-y-0.5 items-center"
                                                        >
                                                            <p className="text-[10px] 2xl:text-xs w-16 2xl:w-24 text-center truncate">{item.itemName}</p>

                                                            <img 
                                                                src={item.image} 
                                                                alt="" 
                                                                className="object-cover w-16 h-16 2xl:w-20 2xl:h-20  rounded-lg"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                
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
                configuration={<MenuConfiguration />} 
                locationMapping={
                    <LocationMapping 
                        headerTitle="menus" 
                        paragraphTitle="menu"
                    />
                }
                mappedMenuCategories={<MappedMenuCategories />}
                menuAvailability={
                    <MenuAvailability 
                        title="menu" 
                        menuAvailabilityData={availabilityRules} 
                    />
                }
                mutateButton={<MutateButton />}
            />

        </div>
    );
};

export default Menus;