import React, { useState } from "react";
import Image from "next/image";

import { useUser } from "@clerk/nextjs";

import { useAtom } from "jotai";
import { 
    cardIdAtom,
    cardTitleAtom,
    cardTransitionAtom,
    checkCardTitleAtom,
    confirmChangesAnimationAtom,
    confirmChangesAtom,
    createdAtAtom,
    createdUserImageAtom,
    createdUserNameAtom,
    dayAtom,
    displayCardAtom,
    displayErrorAtom,
    displayLoadingToastAtom,
    endTimeAtom,
    loadingToastTextAtom,
    newCardAtom,
    searchLocationsAtom, 
    startTimeAtom, 
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom,
} from "~/store/store";

import Sidebar from "~/components/Sidebar";
import LoadingToast from "~/components/toast/LoadingToast";
import ErrorToast from "~/components/toast/ErrorToast";
import MutateButton from "~/components/adminCard/MutateButton";
import AdminCardFunctions from "~/components/adminCard/AdminCardFunctions";
import AdminCard from "~/components/adminCard/AdminCard";

import { api } from "~/utils/api";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { formatUserName } from "~/utils/formatUserName";

import { BsPlusLg } from "react-icons/bs";

const ItemCategoryConfiguration = () => {
    return (
        <div />
    );
};

const ItemCategories = () => {
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

    const [checkCardTitle, setCheckCardTitle] = useAtom(checkCardTitleAtom);
    
    const [, setDay] = useAtom(dayAtom);
    const [, setStartTime] = useAtom(startTimeAtom);
    const [, setEndTime] = useAtom(endTimeAtom);

    const [, setSearchLocations] = useAtom(searchLocationsAtom);

    const user = useUser();

    const { data: itemCategories } = api.itemCategory.getAllItemCategories.useQuery();

    function handleNewCardClick() {
        if (displayCard) return null;

        setNewCard(true);
        setDisplayCard(true); 
        setCardTitle("");
        setCheckCardTitle("");

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
            itemCategoryName: string, 
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) {
        if (displayCard) return null;

        setDisplayCard(true); 
        setCardTitle(itemCategoryName);
        setCheckCardTitle(itemCategoryName);

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
        if (checkCardTitle !== cardTitle) {
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

    if (!itemCategories) {
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
                        <h1 className="text-[2rem] font-medium">PLU Categories</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                            <div className="items-center space-y-1">
                                <p className="dark:text-neutral-200">
                                    Create categories that can be assigned to items.
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
                                            Created
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {itemCategories && itemCategories.length > 0 && (
                                        <>
                                            {itemCategories.map(({ itemCategory, user, updatedUser }) => (
                                                <tr 
                                                    key={itemCategory.id}
                                                    className="bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800"
                                                    onClick={(() => 
                                                        handleCardClick(
                                                            itemCategory.id,
                                                            itemCategory.categoryName,
                                                            formatUserName(user?.firstName || "", user?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(itemCategory.createdAt),
                                                            formatUserName(updatedUser?.firstName || "", updatedUser?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(itemCategory.updatedAt)
                                                        )
                                                    )}
                                                >
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {itemCategory.id}
                                                    </th>

                                                    <td className="px-6 py-4">
                                                        {itemCategory.categoryName}
                                                    </td>

                                                    <td className="flex items-center space-x-2 px-6 py-4">
                                                        <Image 
                                                            src={user?.profileImageUrl || ""}
                                                            className="rounded-full"
                                                            width={20}
                                                            height={20}
                                                            alt="User Profile Image"
                                                        />

                                                        <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(itemCategory.createdAt)}</p>
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
                configuration={<ItemCategoryConfiguration />} 
                mutateButton={<MutateButton />}
            />

        </div>
    );
};

export default ItemCategories;