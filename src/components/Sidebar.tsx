import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { UserButton, useUser } from "@clerk/nextjs";

import { useAtom } from "jotai";
import { cardIdAtom, cardTransitionAtom, confirmChangesAnimationAtom, confirmChangesAtom, displayCardAtom, useLocalStorageStore } from "~/store/store";

import { useGetFromStore } from "~/hooks/zustandHooks";

import { BiFoodMenu, BiCategory } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight, MdOutlineTune } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { BsListUl, BsCalendar4Week } from "react-icons/bs";
import { GoLocation } from "react-icons/go";

const ListHeader = ({
    sidebarDropdown,
    toggleSidebarDropdown,
    listHeaderName,
}: {
    sidebarDropdown: boolean;
    toggleSidebarDropdown: () => void;
    listHeaderName: string;
}) => {
    return (
        <div
            className={`flex text-sm items-center space-x-1 py-2 px-2 hover:text-slate-800 dark:hover:text-neutral-300/70 rounded-md cursor-pointer group
                ${sidebarDropdown && "" || ""}
            `}
            onClick={toggleSidebarDropdown}
        >
            <MdOutlineKeyboardArrowRight 
                className={`group-hover:rotate-90 group-hover:text-blue-400 dark:group-hover:text-pink-300/70 text-lg transition duration-200
                    ${sidebarDropdown && "rotate-90" || ""}
                `} 
            />

            <p className="font-medium">{listHeaderName}</p>
        </div>
    );
};

const ListItem = ({ listItemName, listItemIcon, link }: { listItemName: string; listItemIcon: ReactNode; link: string; }) => {
    const [displayCard, setDisplayCard] = useAtom(displayCardAtom);
    const [, setCardTransition] = useAtom(cardTransitionAtom);

    const [, setConfirmChanges] = useAtom(confirmChangesAtom)
    const [, setConfirmChangesAnimation] = useAtom(confirmChangesAnimationAtom);

    const router = useRouter();

    const handleCloseAdminCard = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setCardTransition(false);
        setConfirmChangesAnimation(false);

        setTimeout(() => {
            setConfirmChanges(false);
        }, 750);

        if (displayCard) {
            setTimeout(() => {
                setDisplayCard(false);
            }, 750);
    
            e.preventDefault();
            setTimeout(() => {
                void router.push(link);
            }, 1000);
        }
    };

    return (
        <div className="px-6">
            <Link 
                href={displayCard ? "/" : link}
                className={`flex items-center space-x-2 py-2 px-2 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-300/70 cursor-pointer rounded-md ${router.pathname === link && "bg-slate-100 text-slate-800 dark:bg-neutral-900 dark:text-neutral-300/70" || ""}`}
                onClick={handleCloseAdminCard}
            >
                <span className={`${router.pathname === link && "text-blue-400 dark:text-pink-300/70" || ""}`}>
                    {listItemIcon}
                </span>
                

                <p>{listItemName}</p>
            </Link>
        </div>
    );
};

const Sidebar = () => {
    const [
        toggleSidebarMenuDropdown,
        toggleSidebarLocationsDropdown,
        toggleSidebarConfigurationDropdown,
    ] = useLocalStorageStore((state) => [
        state.toggleSidebarMenuDropdown,
        state.toggleSidebarLocationsDropdown,
        state.toggleSidebarConfigurationDropdown,
    ]);

    const sidebarMenuDropdown = useGetFromStore(useLocalStorageStore, (state) => state.sidebarMenuDropdown);
    const sidebarLocationsDropdown = useGetFromStore(useLocalStorageStore, (state) => state.sidebarLocationsDropdown);
    const sidebarConfigurationDropdown = useGetFromStore(useLocalStorageStore, (state) => state.sidebarConfigurationDropdown);

    const user = useUser();

    return (
        <div className="dark:bg-[#202021] shadow-md bg-neutral-50 sticky top-0 flex flex-col text-zinc-600 space-y-8 2xl:w-1/6 md:w-1/5 h-screen py-4 border-r dark:border-r-neutral-800">

            <div className="flex items-center justify-start space-x-2 px-4">
                    {user.isSignedIn && (
                        <UserButton 
                            appearance={{
                                
                            }}
                        />
                    )}

                    <div className="flex flex-col items-start">
                        <p className="text-xs dark:text-zinc-300">{user.user?.fullName?.toString()}</p>

                        <p className="text-[10px] 2xl:text-xs text-zinc-500 dark:text-zinc-400">{user.user?.primaryEmailAddress?.toString()}</p>
                    </div>
            </div>

            <div className="flex flex-col justify-center items-center space-y-3">
                <img 
                    src="https://cdn.dribbble.com/users/526755/screenshots/7145485/media/43bd4b6d124845da125155cf00818ed8.gif" 
                    alt="" 
                    className="rounded-full h-20 w-20 object-cover"
                />

                <h1 className="dark:text-neutral-200 font-light text-sm italic">Rucku's Fire Burgers</h1>
            </div>

            <div className="flex flex-col space-y-0.5">
                <div className="flex flex-col space-y-0.5">
                    <ListHeader
                        sidebarDropdown={sidebarMenuDropdown as boolean}
                        toggleSidebarDropdown={toggleSidebarMenuDropdown}
                        listHeaderName="Menu Management"
                    />

                    {sidebarMenuDropdown && (
                        <div className="text-sm flex flex-col space-y-0.5">
                            <ListItem 
                                listItemName="Menus" 
                                listItemIcon={<BiFoodMenu />} 
                                link="/admin/menus"
                            />

                            <ListItem 
                                listItemName="Menu Categories"  
                                listItemIcon={<BiCategory />} 
                                link="/admin/menu-categories"
                            />

                            <ListItem 
                                listItemName="PLUs" 
                                listItemIcon={<IoFastFoodOutline />} 
                                link="/admin/items"
                            />

                            <ListItem 
                                listItemName="PLU Choices" 
                                listItemIcon={<BsListUl />} 
                                link="/admin/item-choices"
                            />

                            <ListItem 
                                listItemName="PLU Categories" 
                                listItemIcon={<BiCategory />} 
                                link="/admin/item-categories"
                            />

                            <ListItem 
                                listItemName="PLU Classes" 
                                listItemIcon={<BiCategory />} 
                                link="/admin/item-classes"
                            />

                        </div>
                    )}

                </div>

                <div className="flex flex-col space-y-0.5">
                    <ListHeader
                        sidebarDropdown={sidebarLocationsDropdown as boolean}
                        toggleSidebarDropdown={toggleSidebarLocationsDropdown}
                        listHeaderName="Location Settings"
                    />

                    {sidebarLocationsDropdown && (
                        <ul className="text-sm flex flex-col space-y-0.5">
                            <ListItem 
                                listItemName="Locations" 
                                listItemIcon={<GoLocation />} 
                                link="/admin/locations"
                            />

                            <ListItem 
                                listItemName="Public Holidays" 
                                listItemIcon={<BsCalendar4Week />}
                                link="/admin/public-holidays" 
                            />

                        </ul>
                    )}

                </div>

                <div className="flex flex-col space-y-0.5">
                    <ListHeader
                        sidebarDropdown={sidebarConfigurationDropdown as boolean}
                        toggleSidebarDropdown={toggleSidebarConfigurationDropdown}
                        listHeaderName="Configuration"
                    />

                    {sidebarConfigurationDropdown && (
                        <ul className="text-sm flex flex-col space-y-0.5">
                            <ListItem 
                                listItemName="UI Design" 
                                listItemIcon={<MdOutlineTune />} 
                                link="/admin/ui-design"
                            />

                        </ul>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Sidebar;