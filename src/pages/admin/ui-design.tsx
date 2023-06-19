import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    priceLevelAtom,
    searchLocationsAtom, 
    startTimeAtom, 
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom
} from "~/store/store";

import { useTheme } from 'next-themes';

import Sidebar from "~/components/Sidebar";
import Input from "~/components/inputs/Input";
import LoadingToast from "~/components/toast/LoadingToast";
import ErrorToast from "~/components/toast/ErrorToast";
import UpdateButton from "~/components/adminCard/MutateButton";
import MenuAvailability from "~/components/adminCard/MenuAvailability";
import LocationMapping from "~/components/adminCard/LocationMapping";
import AdminCardFunctions from "~/components/adminCard/AdminCardFunctions";
import AdminCard from "~/components/adminCard/AdminCard";

import { RouterOutputs, api } from "~/utils/api";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { formatUserName } from "~/utils/formatUserName";

import { BsSun, BsMoon } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { CgWebsite } from "react-icons/cg";
import { HiOutlineComputerDesktop } from "react-icons/hi2";

import InputForDropdown from "~/components/inputs/InputForDropdown";
import { MdClear } from "react-icons/md";
import InputSearchDropdown from "~/components/inputs/InputSearchDropdown";

type Menus = RouterOutputs["menu"]["getAllMenus"];

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

const UiDesign = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [toggleMenuTypeDropdown, setToggleMenuTypeDropdown] = useState(false);
    const [togglePriceLevelDropdown, setTogglePriceLevelDropdown] = useState(false);

    const [displayError, setDisplayError] = useAtom(displayErrorAtom);  
    const [displayLoadingToast, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);
    const [, setErrorText] = useAtom(errorTextAtom);
    
    const [createMenuName, setCreateMenuName] = useState("");
    const [createDisplayName, setCreateDisplayName] = useState("");
    const [createMenuType, setCreateMenuType] = useState("");
    const [createPriceLevel, setCreatePriceLevel] = useState("");

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

    const { mutate: updateMenuPositions } = api.menu.updateMenuPosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.menu.getAllMenus.invalidate();
        }
    });

    const { data: menus } = api.menu.getAllMenus.useQuery();
    const { data: menuPosition } = api.menu.getLatestMenuPosition.useQuery();

    const [menusState, setMenusState] = useState<Menus>();

    useEffect(() => {
        if (menus !== undefined) {
            setMenusState(menus);
        }
    }, [menus]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderThemeChanger = () => {
        if (!mounted) return null;

        const currentTheme = theme === 'system' ? systemTheme : theme;

        console.log(theme)

        if (currentTheme === 'dark') {
            return (
                <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault" 
                    onClick={() => setTheme("light")}
                    checked
                />
            )
        } else {
            return (
                <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault" 
                    onClick={() => setTheme("dark")}
                />
            );
        }
    };

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

    function handleSortPositions() {
        const _menus: Menus = [];

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

    function handleUpdatePositionsClick() {
        if (!menusState) return null;
        if (displayCard) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        menusState.map(({ menu }, index) => {
            updateMenuPositions({ id: menu.id, position: index })
        });
    }

    const handleCloseAdminCardClick = () => {
        if (checkMenuName !== cardTitle || checkDisplayName !== displayName || checkMenuType !== menuType || checkPriceLevel !== priceLevel) {
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
    };

    if (!menusState) {
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
                <div className="flex-1 flex flex-col space-y-4 py-10 px-12">
                    <h1 className="text-[1.5rem] font-medium border-b dark:border-b-neutral-700 py-2">Admin</h1>

                    <div className="flex justify-between items-center">
                        <div className="flex flex-col space-y-1">
                            <p className="text-">
                                Appearance
                            </p>

                            <p className="text-sm font-light text-neutral-500">
                                Customize the appearance of the admin webpage, toggle between light & dark modes.
                            </p>
                        </div>

                        <div className="flex items-center flex-col space-y-4">
                            {renderThemeChanger()}
                        </div>

                    </div>
            
                </div>

            </div>

        </div>
    );
};

export default UiDesign;