import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { UserButton, useUser } from "@clerk/nextjs";

import { useLocalStorageStore } from "~/store/store";
import { useGetFromStore } from "~/hooks/zustandHooks";

import { BiFoodMenu, BiCategory } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { BsListUl, BsPrinter, BsCalendar4Week } from "react-icons/bs";
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
            className={`flex text-sm items-center space-x-1 py-2 px-2 hover:text-slate-800 rounded-md cursor-pointer group
                ${sidebarDropdown && "" || ""}
            `}
            onClick={toggleSidebarDropdown}
        >
            <MdOutlineKeyboardArrowRight 
                className={`group-hover:rotate-90 group-hover:text-blue-400 text-lg transition duration-200
                    ${sidebarDropdown && "rotate-90" || ""}
                `} 
            />

            <p className="font-medium">{listHeaderName}</p>
        </div>
    );
};

const ListItem = ({ listItemName, listItemIcon, link }: { listItemName: string; listItemIcon: ReactNode; link: string; }) => {
    const router = useRouter();

    return (
        <div className="px-6">
            <Link 
                href={link}
                className={`flex items-center space-x-2 py-2 px-2 hover:text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md ${router.pathname === link && "bg-slate-100 text-slate-800" || ""}`}
            >
                <span className={`${router.pathname === link && "text-blue-400" || ""}`}>
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
        toggleSidebarLocationsDropdown
    ] = useLocalStorageStore((state) => [
        state.toggleSidebarMenuDropdown,
        state.toggleSidebarLocationsDropdown
    ]);
    const sidebarMenuDropdown = useGetFromStore(useLocalStorageStore, (state) => state.sidebarMenuDropdown);
    const sidebarLocationsDropdown = useGetFromStore(useLocalStorageStore, (state) => state.sidebarLocationsDropdown);

    const user = useUser();

    return (
        <div className="sticky top-0 flex flex-col text-zinc-600 space-y-6 2xl:w-1/6 md:w-1/5 h-screen px- py-8 border-r">
            <div className="flex flex-col items-center justify-center space-y-2 px-2">
                    {user.isSignedIn && (
                        <UserButton 
                            appearance={{
                                variables: {
                                    colorBackground: "#20222e",
                                    colorText: "#ffffff",
                                    colorPrimary: "#6C47FF",
                                    fontWeight: { normal: 300 },
                                    colorInputBackground: "#292c3e",
                                    colorInputText: "#ffffff",
                                    colorTextSecondary: "#ffffff",
                                    colorAlphaShade: "#ffffff",
                                }
                            }}
                        />
                    )}

                    <div className="flex flex-col items-center">
                        <p className="text-sm text-zinc-400">{user.user?.fullName?.toString()}</p>

                        <p className="text-xs text-zinc-400">{user.user?.primaryEmailAddress?.toString()}</p>
                    </div>

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
                                listItemName="Printing Categories" 
                                listItemIcon={<BsPrinter />} 
                                link="/admin/printing-categories"
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
            </div>

        </div>
    );
};

export default Sidebar;