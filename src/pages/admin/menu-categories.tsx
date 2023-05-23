import React, { useEffect, useRef, useState } from "react";

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

type MenuCategories = RouterOutputs["menuCategory"]["getAllMenuCategories"];

const MenuCategoryCardBody = () => {
    const [toggleDayDropdown, setToggleDayDropdown] = useState(false);
    const [toggleAvailableDropdown, setToggleAvailableDropdown] = useState(false);
    const [locationDropdown, setLocationDropdown] = useState(false);

    const [displayError, setDisplayError] = useState(false);
    const [displayAvailabilityError, setDisplayAvailabilityError] = useState(false);

    const [displayCard, setDisplayCard] = useAtom(displayCardAtom);
    const [cardTransition, setCardTransition] = useAtom(cardTransitionAtom);

    const [cardId, setCardId] = useAtom(cardIdAtom);
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);

    const [day, setDay] = useAtom(dayAtom);
    const [available, setAvailable] = useAtom(availableAtom);
    const [startTime, setStartTime] = useAtom(startTimeAtom);
    const [endTime, setEndTime] = useAtom(endTimeAtom);

    const [searchLocations, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const { data: availabilityRules } = api.menuCategory.getMenuCategoryAvailabilityRuleById.useQuery({ id: cardId });

    const { mutate: updateMenuCategory, isLoading: isUpdatingMenuCategory  } = api.menuCategory.updateMenuCategory.useMutation({
        onSuccess: () => {
            setCardTitle("");
            setCardId(0);
            setCardTransition(false);
            ctx.menuCategory.getAllMenuCategories.invalidate();

            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
        }
    });

    const { mutate: createAvailabilityRule, isLoading: isCreatingAvailabilityRule } = api.menuCategory.createMenuCategoryAvailabilityRule.useMutation({
        onSuccess: () => {
            setDay("");
            setAvailable("");
            setStartTime("");
            setEndTime("");
            setAvailable("");
            ctx.menuCategory.getMenuCategoryAvailabilityRuleById.invalidate();
        }
    });

    function handleMutateMenuClick() {
        if (cardTitle === "") {
            setDisplayError(true);

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (cardTitle !== "") {
            setDisplayError(false);

            return updateMenuCategory({
                name: cardTitle,
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

    if (!availabilityRules) return <LoadingSpinner text="Loading..." />;

    return (
        <>
            {isCreatingAvailabilityRule && (
                <LoadingSpinner text="Creating Rule..." />
            )}

            {isUpdatingMenuCategory && (
                <LoadingSpinner text={`Updating Menu ID: ${cardId}`} />
            )}

            {displayError && (
                <ErrorAlert 
                    errors={[
                        cardTitle === "" ? "Menu category name wasn't entered." : "",
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
                <div className="flex mt-8">
                    <button 
                        className="w-fit m-auto text-sm relative inline-flex items-center justify-center px-2 py-1 overflow-hidden font-medium text-[#2f334a] transition duration-300 ease-out border-2 border-[#2f334a] rounded-md shadow-md group bg-white"
                        onClick={handleMutateMenuClick}
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

                <div className="flex flex-col space-y-4 mt-16">
                    <div className="flex flex-col justify-center items-center mb-4">
                        <h2 className="text-center">Locations</h2>

                        <p className="text-xs font-light">Map menu categories to specific locations.</p>
                    </div>

                    <div>
                        <p className="p-1 font-light text-xs">Add locations the menu category will apply to, if no locations are selected, the category will apply to all.</p>

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
                        <h2 className="text-center">Menu Category Availability</h2>

                        <p className="text-xs font-light">Create rules to dictate when the menu category will be available.</p>
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

                    {availabilityRules.length > 0 && (
                        <div className="flex flex-col space-y-4">
                            {availabilityRules.map(({ dayOfWeek, startTime, endTime, available }) => (
                                <div className="flex items-center bg-neutral-100 p-2 w-fit rounded-lg text-xs font-light">
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

const MenuCategories = () => {
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

    const { mutate: createMenuCategory, isLoading: isCreatingMenuCategory } = api.menuCategory.createMenuCategory.useMutation({
        onSuccess: () => {
            setCreateMenuCategoryName("");
            ctx.menuCategory.getAllMenuCategories.invalidate();
            ctx.menuCategory.getLatestMenuCategoryPosition.invalidate()
        }
    });

    const { mutate: updatePositions, isLoading: isUpdatingPositions } = api.menuCategory.updateMenuCategoryPosition.useMutation({
        onSuccess: () => {
            ctx.menuCategory.getAllMenuCategories.invalidate();
        }
    });


    const { data: menuCategories } = api.menuCategory.getAllMenuCategories.useQuery();
    const { data: menuCategoryPosition } = api.menuCategory.getLatestMenuCategoryPosition.useQuery();

    const [displayError, setDisplayError] = useState(false);  
    
    const [createMenuCategoryName, setCreateMenuCategoryName] = useState("");

    const [menuCategoriesState, setMenusCategoriesState] = useState<MenuCategories>();

    useEffect(() => {
        if (menuCategories !== undefined) {
            setMenusCategoriesState(menuCategories)
        }
    }, [menuCategories]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

    let newMenuCategoryPosition = 0;
    if (menuCategoryPosition && menuCategoryPosition.length > 0) {
        newMenuCategoryPosition = menuCategoryPosition[0]?.position as number + 1;
    }

    function handleMutateMenuClick() {
        if (createMenuCategoryName === "") {
            setDisplayError(true);

            setTimeout(() => {
                setDisplayError(false);
            }, 2000);
        }

        if (createMenuCategoryName !== "") {
            setDisplayError(false);

            return createMenuCategory({ 
                name: createMenuCategoryName,
                position: newMenuCategoryPosition
            });
        }
    }

    const handleCardClick = (
            id: number, 
            menuName: string, 
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) => {
        setDisplayCard(true); 
        setCardTitle(menuName);
        setDay("");
        setAvailable("");
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
    };

    function handleSortPositions() {
        let _menuCategories: MenuCategories = [];

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
        menuCategoriesState.map(({ menuCategory }, index) => {
            updatePositions({ id: menuCategory.id, position: index })
        });
    }

    if (!menuCategoriesState) return <LoadingSpinner text="Loading..." />;

    return (
        <div className="flex">
            <Sidebar />

            {isCreatingMenuCategory && (
                <LoadingSpinner text="Creating Category..." />
            )}

            {isUpdatingPositions && (
                <LoadingSpinner text="Updating Positions..." />
            )}

            {displayError  && (
                <ErrorAlert 
                    errors={[
                        createMenuCategoryName === "" ? "No menu category value." : "",
                    ]} 
                />
            )}  

            <div className="sticky top-0 flex-1 h-screen scrollbar w-fit px-6">
                <div className="flex-1 flex flex-col space-y-4 py-10 px-8">
                    <div className="flex flex-col space-y-1 border-b py-2">
                        <h1 className="text-[2rem] font-medium">Menu Categories</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                                <div className="items-center space-y-1">
                                    <p className="">
                                        Create menu categories, position them from top to bottom to give certain categories precedence over others.
                                    </p>

                                    <p>
                                        Simply drag and drop to update positions, categories positioned higher in the list take greater precedence when rendering to the UI.
                                    </p>
                                </div>
                        </div>

                    </div>

                    <div className="flex flex-col space-y-8">
                        <div className="flex flex-col items- space-y-2 py-1 px-2 rounded-md">
                            <div className="flex items-center space-x-4">
                                <Input 
                                    inputValue={createMenuCategoryName}
                                    setInputValue={setCreateMenuCategoryName}
                                    labelName="Category Name"            
                                />
                            </div>

                            <div 
                                className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                                onClick={handleMutateMenuClick}
                            >
                                <BsPlusLg 
                                    className="group-hover:text-blue-400 " 
                                />

                                <p className="group-hover:text-slate-800 text-sm">Add Category</p>
                            </div>

                            <div 
                                className="flex items-center space-x-1.5 w-fit text-zinc-500 cursor-pointer group"
                                onClick={handleUpdatePositionsClick}
                            >
                                <RxUpdate 
                                    className="group-hover:text-blue-400 text-sm" 
                                />

                                <p className="group-hover:text-slate-800 text-sm">Update Category Positions</p>
                            </div>

                        </div>

                        <div className="flex flex-col space-y-1">
                            {menuCategoriesState.map(({ menuCategory, user, updatedUser }, index) => (
                                <div 
                                    key={menuCategory.id}
                                    className={`flex justify-between items-center cursor-pointer py-1 px-2 rounded-md ${cardId === menuCategory.id ? "bg-slate-50" : "hover:bg-slate-50" || ""}`}
                                    onClick={(() => 
                                        handleCardClick(
                                            menuCategory.id, 
                                            menuCategory.menuCategoryName, 
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
                                >
                                    <div>
                                        <p>{menuCategory.menuCategoryName}</p>
                                    </div>

                                    <div className="flex space-x-6 items-center text-xs">
                                        <Image 
                                            src={user?.profileImageUrl || ""}
                                            className="rounded-full"
                                            width={20}
                                            height={20}
                                            alt="User Profile Image"
                                        />

                                        <p className="text-xs text-zinc-500 font-light">{formatTimestamp(menuCategory.createdAt)}</p>
                                        
                                    </div>
                                
                                </div>
                            ))}

                        </div>
                    </div>
            
                </div>

            </div>

            <AdminCard cardDetails={<MenuCategoryCardBody />} />

        </div>
    );
};

export default MenuCategories;