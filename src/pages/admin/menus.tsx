import React, { useEffect, useRef, useState } from "react";

import { useUser } from "@clerk/nextjs";

import { RouterOutputs, api } from "~/utils/api";

import { useAtom } from "jotai";
import { 
    availableAtom,
    cardIdAtom,
    cardTitleAtom,
    cardTransitionAtom,
    createdAtAtom,
    createdUserImageAtom,
    createdUserNameAtom,
    dayAtom,
    displayCardAtom,
    endTimeAtom,
    menuTypeAtom,
    priceLevelAtom, 
    searchLocationsAtom, 
    startTimeAtom, 
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom
} from "~/store/store";

import Sidebar from "~/components/Sidebar";
import AdminCard from "~/components/AdminCard";
import Input from "~/components/Input";
import InputForDropdown from "~/components/InputForDropdown";
import InputSearchDropdown from "~/components/InputSearchDropdown";
import LoadingSpinner from "~/components/LoadingSpinner";
import ErrorAlert from "~/components/ErrorAlert";

import { formatTimestamp } from "~/utils/formatTimestamp";
import { formatPriceLevelForFrontEnd } from "~/utils/formatPriceLevelForFrontEnd";
import { formatDayForClient } from "~/utils/formatDayForClient";
import { formatTime } from "~/utils/formatTime";
import Image from "next/image";
import { formatUserName } from "~/utils/formatUserName";
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdClear } from "react-icons/md";

type Menus = RouterOutputs["menu"]["getAllMenus"];

const MenuCardBody = () => {
    const [toggleMenuTypeDropdown, setToggleMenuTypeDropdown] = useState(false);
    const [togglePriceLevelDropdown, setTogglePriceLevelDropdown] = useState(false);
    const [toggleDayDropdown, setToggleDayDropdown] = useState(false);
    const [toggleAvailableDropdown, setToggleAvailableDropdown] = useState(false);
    const [mappedMenuDropdown, setMappedMenuDropdown] = useState(false);
    const [locationDropdown, setLocationDropdown] = useState(false);

    const [menuCategoryInput, setMenuCategoryInput] = useState("");

    const [displayError, setDisplayError] = useState(false);
    const [displayAvailabilityError, setDisplayAvailabilityError] = useState(false);

    const [displayCard, setDisplayCard] = useAtom(displayCardAtom);
    const [cardTransition, setCardTransition] = useAtom(cardTransitionAtom);

    const [cardId, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [menuType, setMenuType] = useAtom(menuTypeAtom);
    const [priceLevel, setPriceLevel] = useAtom(priceLevelAtom);

    const [day, setDay] = useAtom(dayAtom);
    const [available, setAvailable] = useAtom(availableAtom);
    const [startTime, setStartTime] = useAtom(startTimeAtom);
    const [endTime, setEndTime] = useAtom(endTimeAtom);

    const [searchLocations, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const { data: availabilityRules } = api.menu.getMenuAvailabilityRuleByMenuId.useQuery({ id: cardId });
    const { data: menuMappedCategories } = api.menuCategoryMap.getMappedMenuCategoriesByMenuId.useQuery({ id: cardId });
    const { data: menuCategories } = api.menuCategoryMap.getMenuCategoriesForDropdown.useQuery({ id: cardId });

    const { mutate: updateMenu, isLoading: isUpdatingMenu  } = api.menu.updateMenu.useMutation({
        onSuccess: () => {
            setCardTitle("");
            setMenuType("");
            setCardId(0);
            setCardTransition(false);
            void ctx.menu.getAllMenus.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    });

    const { mutate: createAvailabilityRule, isLoading: isCreatingAvailabilityRule } = api.menu.createMenuAvailabilityRule.useMutation({
        onSuccess: () => {
            setDay("");
            setAvailable("");
            setStartTime("");
            setEndTime("");
            setAvailable("");
            void ctx.menu.getMenuAvailabilityRuleByMenuId.invalidate();
        },
    });

    const { mutate: deleteMenuCategoryMap, isLoading: isDeletingMenuCategoryMap } = api.menuCategoryMap.deleteMenuMappedCategory.useMutation({
        onSuccess: () => {
            void ctx.menuCategoryMap.getMenuCategoriesForDropdown.invalidate();
            void ctx.menuCategoryMap.getMappedMenuCategoriesByMenuId.invalidate();
        },
    });

    let formattedMenuType = 0;
    switch(menuType) {
        case("POS"):
            formattedMenuType = 1;
            break;
        case("Web Ordering"):
            formattedMenuType = 2;
            break;
    }

    let formattedPriceLevel = 0;
    switch(priceLevel) {
        case("1"):
            formattedPriceLevel = 1;
            break;
        case("2"):
            formattedPriceLevel = 2;
            break;
        case("3"):
            formattedPriceLevel = 3;
            break;
    }

    function handleUpdateMenuClick() {
        if (menuType === "" || cardTitle === "" || priceLevel === "") {
            setDisplayError(true);

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (menuType !== "" && cardTitle !== "" && priceLevel !== "") {
            setDisplayError(false);

            return updateMenu({
                name: cardTitle,
                menuType: formattedMenuType,
                priceLevel: formattedPriceLevel,
                id: cardId,
            });
        }
    }

    let formattedDay = 0;
    switch(day) {
        case("Monday"):
            formattedDay = 1;
            break;
        case("Tuesday"):
            formattedDay = 2;
            break;
        case("Wednesday"):
            formattedDay = 3;
            break;
        case("Thursday"):
            formattedDay = 4;
            break;
        case("Friday"):
            formattedDay = 5;
            break;
        case("Saturday"):
            formattedDay = 6;
            break;
        case("Sunday"):
            formattedDay = 0;
            break;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    function handleCreateAvailabilityRuleClick() {
        if (day === "" || !startTime.match(timeRegex) || !endTime.match(timeRegex) || available === "") {
            setDisplayAvailabilityError(true);

            setTimeout(() => {
                setDisplayAvailabilityError(false);
            }, 2000);
        }

        if (day !== "" && startTime.match(timeRegex) && endTime.match(timeRegex) && available !== "") {
            setDisplayAvailabilityError(false);

            return createAvailabilityRule({
                id: cardId,
                available: available === "Yes" ? true : false,
                day: formattedDay,
                startTime: startTime.length === 4 ? `0${startTime}` : startTime,
                endTime: endTime.length === 4 ? `0${endTime}` : endTime,
            });
        }
    }

    return (
        <>
            {isCreatingAvailabilityRule && (
                <LoadingSpinner text="Creating Rule..." />
            )}

            {isUpdatingMenu && (
                <LoadingSpinner text={`Updating Menu ID: ${cardId}`} />
            )}

            {isDeletingMenuCategoryMap && (
                <LoadingSpinner text={`Deleting Menu Category...`} />
            )}

            {displayError && (
                <ErrorAlert 
                    errors={[
                        cardTitle === "" ? "Menu name wasn't entered." : "",
                        menuType === "" ? "Menu type wasn't entered." : "",
                        priceLevel === "" ? "Price level wasn't entered." : "",
                    ]} 
                />
            )}   

            {displayAvailabilityError  && (
                <ErrorAlert 
                    errors={[
                        day === "" ? "Day wasn't entered." : "",
                        !startTime.match(timeRegex) ? "Start time wasn't formatted correctly." : "",
                        !endTime.match(timeRegex) ? "End time wasn't formatted correctly." : "",
                        available === "" ? "Availability wasn't entered" : "",
                    ]} 
                />
            )}   

            <div className="flex flex-col space-y-16">  
                <div className="flex flex-col space-y-10 mt-4">
                    <div className="flex flex-col space-y-4">
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

                    <button 
                        className="w-fit m-auto text-sm relative inline-flex items-center justify-center px-2 py-1 overflow-hidden font-medium text-[#2f334a] transition duration-300 ease-out border-2 border-[#2f334a] rounded-md shadow-md group"
                        onClick={handleUpdateMenuClick}
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
                        
                        <span className="absolute flex items-center justify-center w-full h-full text-[#2f334a]  transition-all duration-300 transform group-hover:translate-x-full ease">Update</span>
                        
                        <span className="relative invisible">Update</span>

                    </button>
                </div>  

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col justify-center items-center mb-4">
                        <h2 className="text-center">Locations</h2>

                        <p className="text-xs font-light">Map menus to specific locations.</p>
                    </div>

                    <div>
                        <p className="p-1 font-light text-xs">Add locations the menu will apply to, if no locations are selected, the category will apply to all</p>

                        <InputSearchDropdown 
                            labelName="Search Locations"
                            inputValue={searchLocations}
                            setInputValue={setSearchLocations}
                            toggleDropdown={locationDropdown}
                            setToggleDropdown={setLocationDropdown}
                        />
                    </div>
                    
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col justify-center items-center mb-4">
                        <h2 className="text-center">Menu Categories</h2>

                        <p className="text-xs font-light">Assign menu categories for this menu.</p>
                    </div>

                    <div>
                        <p className="p-1 font-light text-xs">Add categories that will apply to this menu.</p>

                        <InputSearchDropdown 
                            labelName="Menu Categories"
                            inputValue={menuCategoryInput}
                            setInputValue={setMenuCategoryInput}
                            menuCategoryData={menuCategories}
                            toggleDropdown={mappedMenuDropdown}
                            setToggleDropdown={setMappedMenuDropdown}
                        />

                    </div>

                    {menuMappedCategories && menuMappedCategories.length > 0 && (
                        <div 
                            className="flex space-x-4">
                            {menuMappedCategories.map(({ mappedMenuCategory, menuCategory }, index) => (
                                <div 
                                    className="relative flex items-center bg-neutral-100 p-2 w-fit rounded-lg text-xs font-light hover:bg-slate-200 cursor-pointer group"
                                    key={index}
                                >
                                    <p>{menuCategory?.menuCategoryName}</p>

                                    <MdClear 
                                        className="absolute -top-1 -right-1 border border-red-300 rounded-full text-sm text-red-500 bg-white hover:bg-red-300 hover:text-white p-0.5 invisible group-hover:visible"
                                        onClick={(() => deleteMenuCategoryMap({ id: mappedMenuCategory?.id as number }))}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>   

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col justify-center items-center mb-4">
                        <h2 className="text-center">Menu Availability</h2>

                        <p className="text-xs font-light">Create rules to dictate when the menu will be available.</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div>
                            <p className="p-1 font-light text-xs">Select a day the availability rule will apply to.</p>

                            <InputForDropdown 
                                toggleDropdown={toggleDayDropdown}
                                setToggleDropdown={setToggleDayDropdown}
                                inputValue={day}
                                setInputValue={setDay}
                                dropdownItems={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
                                labelName="Day"
                            />
                        </div>

                        <div>
                            <p className="p-1 font-light text-xs">Input the 24hr time value; e.g. 10:00.</p>

                            <Input 
                                inputValue={startTime}
                                setInputValue={setStartTime}
                                labelName="Start Time"           
                            />
                        </div>

                        <div>
                            <p className="p-1 font-light text-xs">Input the 24hr time value; e.g. 22:00.</p>

                            <Input 
                                inputValue={endTime}
                                setInputValue={setEndTime}
                                labelName="End Time"                 
                            />
                        </div>

                        <div>
                            <p className="p-1 font-light text-xs">Determine whether the menu will be available.</p>

                            <InputForDropdown 
                                toggleDropdown={toggleAvailableDropdown}
                                setToggleDropdown={setToggleAvailableDropdown}
                                inputValue={available}
                                setInputValue={setAvailable}
                                dropdownItems={["Yes", "No"]}
                                labelName="Availability"
                            />
                        </div>

                        <div 
                            className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                            onClick={handleCreateAvailabilityRuleClick}
                        >
                            <BsPlusLg 
                                className="group-hover:text-blue-400 " 
                            />

                            <p className="group-hover:text-slate-800 text-sm">Add Availability Rule</p>
                        </div>

                    </div>

                    {availabilityRules && availabilityRules.length > 0 && (
                        <div className="flex flex-col space-y-4">
                            {availabilityRules.map(({ dayOfWeek, startTime, endTime, available }, index) => (
                                <div 
                                    className="flex items-center bg-neutral-100 p-2 w-fit rounded-lg text-xs font-light"
                                    key={index}
                                >
                                    <p className="w-[8rem]">Day: {formatDayForClient(dayOfWeek)}</p>

                                    <p className="w-[8rem]">Start: {formatTime(startTime)}</p>

                                    <p className="w-[8rem]">End: {formatTime(endTime)}</p>

                                    <p className="">Available: {available ? "Yes" : "No"}</p>
                                    
                                </div>
                            ))}
                        </div>
                    )}
                    
                </div>     

            </div>
        </>
    );
};

const Menu = () => {
    const [displayCard, setDisplayCard] = useAtom(displayCardAtom);
    const [cardTransition, setCardTransition] = useAtom(cardTransitionAtom);

    const [createdUserName, setCreatedUserName] = useAtom(createdUserNameAtom);
    const [createdUserImage, setCreatedUserImage] = useAtom(createdUserImageAtom);
    const [createdAt, setCreatedAt] = useAtom(createdAtAtom);
    const [updatedUserName, setUpdatedUserName] = useAtom(updatedUserNameAtom);
    const [updatedUserImage, setUpdatedUserImage] = useAtom(updatedUserImageAtom);
    const [updatedAt, setUpdatedAt] = useAtom(updatedAtAtom);

    const [cardId, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [menuType, setMenuType] = useAtom(menuTypeAtom);
    const [priceLevel, setPriceLevel] = useAtom(priceLevelAtom);

    const [day, setDay] = useAtom(dayAtom);
    const [available, setAvailable] = useAtom(availableAtom);
    const [startTime, setStartTime] = useAtom(startTimeAtom);
    const [endTime, setEndTime] = useAtom(endTimeAtom);

    const [searchLocations, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const { mutate: createMenu, isLoading: isCreatingMenu } = api.menu.createMenu.useMutation({
        onSuccess: () => {
            setCreateMenuName("");
            setCreateMenuType("");
            setCreatePriceLevel("");
            void ctx.menu.getAllMenus.invalidate();
            void ctx.menu.getLatestMenuPosition.invalidate()
        }
    });

    const { mutate: updateMenuPositions, isLoading: isUpdatingMenuPositions } = api.menu.updateMenuPosition.useMutation({
        onSuccess: () => {
            void ctx.menu.getAllMenus.invalidate();
        }
    });

    const { data: menus } = api.menu.getAllMenus.useQuery();
    const { data: menuPosition } = api.menu.getLatestMenuPosition.useQuery();

    const [toggleMenuTypeDropdown, setToggleMenuTypeDropdown] = useState(false);
    const [togglePriceLevelDropdown, setTogglePriceLevelDropdown] = useState(false);

    const [displayError, setDisplayError] = useState(false);  
    
    const [createMenuName, setCreateMenuName] = useState("");
    const [createMenuType, setCreateMenuType] = useState("");
    const [createPriceLevel, setCreatePriceLevel] = useState("");

    const [menusState, setMenusState] = useState<Menus>();

    useEffect(() => {
        if (menus !== undefined) {
            setMenusState(menus)
        }
    }, [menus]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    let newMenuPosition = 0;
    if (menuPosition && menuPosition.length > 0) {
        newMenuPosition = menuPosition[0]?.position as number + 1;
    }

    let formattedMenuType = 0;
    switch(createMenuType) {
        case("POS"):
            formattedMenuType = 1;
            break;
        case("Web Ordering"):
            formattedMenuType = 2;
            break;
    }

    let formattedPriceLevel = 0;
    switch(createPriceLevel) {
        case("1"):
            formattedPriceLevel = 1;
            break;
        case("2"):
            formattedPriceLevel = 2;
            break;
        case("3"):
            formattedPriceLevel = 3;
            break;
    }

    function handleCreateMenuClick() {
        if (createMenuName === "" || createMenuType === "" || createPriceLevel === "") {
            setDisplayError(true);

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (createMenuName !== "" && createMenuType !== "" && createPriceLevel !== "") {
            setDisplayError(false);

            return createMenu({
                name: createMenuName,
                menuType: formattedMenuType,
                priceLevel: formattedPriceLevel,
                position: newMenuPosition,
            });
        }
    }

    function handleCardClick(
            id: number, 
            menuName: string, 
            menuType: number, 
            priceLevel: number,
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) {
        setDisplayCard(true); 
        setCardTitle(menuName);
        setDay("");
        setAvailable("");
        setStartTime("");
        setEndTime("")
        setSearchLocations("");
        setCardId(id);
        menuType === 1 ? setMenuType("POS") : setMenuType("Web Ordering");
        setPriceLevel(formatPriceLevelForFrontEnd(priceLevel));
        setCreatedUserName(createdUserName);
        setCreatedUserImage(createdUserImage);
        setCreatedAt(createdAt);
        setUpdatedUserName(updatedUserName);
        setUpdatedUserImage(updatedUserImage);
        setUpdatedAt(updatedAt);

        setTimeout(() => {
            setCardTransition(true);
        }, 100);
    };

    function handleSortPositions() {
        let _menus: Menus = [];

        if (!menusState) return null;
        menusState.forEach(menu => _menus.push(Object.assign({}, menu)));

        const draggedItemContent = _menus.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _menus.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setMenusState(_menus);
    }

    function handleUpdatePositions() {
        if (!menusState) return null;
        menusState.map(({ menu }, index) => {
            updateMenuPositions({ id: menu.id, position: index })
        });
    }

    if (!menusState) return <LoadingSpinner text="Loading..." />;

    return (
        <div className="flex">
            <Sidebar />

            {isCreatingMenu && (
                <LoadingSpinner text="Creating Menu..." />
            )}

            {isUpdatingMenuPositions && (
                <LoadingSpinner text="Updating Positions..." />
            )}

            {displayError  && (
                <ErrorAlert 
                    errors={[
                        createMenuName === "" ? "Menu name wasn't entered." : "",
                        createMenuType === "" ? "Menu type wasn't entered." : "",
                        createPriceLevel === "" ? "Price level wasn't entered." : "",
                    ]} 
                />
            )}  

            <div className="sticky top-0 flex-1 h-screen scrollbar w-fit px-6">
                <div className="flex-1 flex flex-col space-y-4 py-10 px-8">
                    <div className="flex flex-col space-y-1 border-b py-2">
                        <h1 className="text-[2rem] font-medium">Menus</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                                <div className="items-center space-y-1">
                                    <p className="">
                                        Create menus for Web Ordering and POS, position them from top to bottom to give certain menus precedence over others.
                                    </p>

                                    <p>
                                        Simply drag and drop to update positions, menus positioned higher in the list take greater precedence when rendering to the UI.
                                    </p>
                                </div>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-8">
                        <div className={`flex flex-col items- space-y-2 py-1 px-2 rounded-md ${cardId === -1 ? "" : "" || ""}`}>
                            <div className="flex items-center space-x-4">
                                <Input 
                                    inputValue={createMenuName}
                                    setInputValue={setCreateMenuName}
                                    labelName="Menu Name"            
                                />

                                <InputForDropdown 
                                    toggleDropdown={toggleMenuTypeDropdown}
                                    setToggleDropdown={setToggleMenuTypeDropdown}
                                    inputValue={createMenuType}
                                    setInputValue={setCreateMenuType}
                                    dropdownItems={["POS", "Web Ordering"]}
                                    labelName="Menu Type"
                                />

                                <InputForDropdown 
                                    toggleDropdown={togglePriceLevelDropdown}
                                    setToggleDropdown={setTogglePriceLevelDropdown}
                                    inputValue={createPriceLevel}
                                    setInputValue={setCreatePriceLevel}
                                    dropdownItems={["1", "2", "3"]}
                                    labelName="Price Level"
                                />
                            </div>

                            <div 
                                className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                                onClick={handleCreateMenuClick}
                            >
                                <BsPlusLg 
                                    className="group-hover:text-blue-400 " 
                                />

                                <p className="group-hover:text-slate-800 text-sm">Add Menu</p>
                            </div>

                            <div 
                                className="flex items-center space-x-1.5 w-fit text-zinc-500 cursor-pointer group"
                                onClick={handleUpdatePositions}
                            >
                                <RxUpdate 
                                    className="group-hover:text-blue-400 text-sm" 
                                />

                                <p className="group-hover:text-slate-800 text-sm">Update Menu Positions</p>
                            </div>

                        </div>

                        <div className="flex flex-col space-y-1">
                            {menusState?.map(({ menu, user, updatedUser }, index) => (
                                <div 
                                    key={menu.id}
                                    className={`flex justify-between items-center cursor-move py-1 px-2 rounded-md ${cardId === menu.id ? "bg-slate-50" : "hover:bg-slate-50" || ""}`}
                                    onClick={(() => 
                                        handleCardClick(
                                            menu.id, 
                                            menu.menuName, 
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
                                    draggable
                                    onDragStart={(() => dragItem.current = index)}
                                    onDragEnter={(() => dragOverItem.current = index)}
                                    onDragOver={((e) => e.preventDefault())}
                                    onDragEnd={handleSortPositions}
                                >
                                    <div>
                                        <p>{menu.menuName}</p>
                                    </div>

                                    <div className="flex space-x-6 items-center text-xs">
                                        <p className={`${menu.menuType === 1 ? "bg-blue-100" : "bg-fuchsia-100"} px-2 py-0.5 rounded-md`}>
                                            {menu.menuType === 1 ? "POS" : "Web Ordering"}
                                        </p>

                                        <p 
                                            className={`px-2 py-0.5 rounded-md
                                                ${menu.priceLevel === 1 && "bg-orange-100" || ""}
                                                ${menu.priceLevel === 2 && "bg-lime-100" || ""}
                                                ${menu.priceLevel === 3 && "bg-cyan-100" || ""}
                                            `}
                                        >
                                            Price Level {menu.priceLevel}
                                        </p>

                                        <Image 
                                            src={user?.profileImageUrl || ""}
                                            className="rounded-full"
                                            width={20}
                                            height={20}
                                            alt="User Profile Image"
                                        />

                                        <p className="text-xs text-zinc-500 font-light">{formatTimestamp(menu.createdAt)}</p>
                                        
                                    </div>
                                
                                </div>
                            ))}

                        </div>

                    </div>
            
                </div>

            </div>

            <AdminCard cardDetails={<MenuCardBody />} />

        </div>
    );
};

export default Menu;