import React, { useEffect, useRef, useState } from "react";
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

import { RouterOutputs, api } from "~/utils/api";
import { formatTimestamp } from "~/utils/formatTimestamp";
import { formatUserName } from "~/utils/formatUserName";

import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";


type ItemClasses = RouterOutputs["itemClass"]["getAllItemClasses"];

const ItemClassConfiguration = () => {
    return (
        <div />
    );
};

const ItemClasses = () => {
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

    const [checkCardTitle, setCheckCardTitle] = useAtom(checkCardTitleAtom);

    const [, setDay] = useAtom(dayAtom);
    const [, setStartTime] = useAtom(startTimeAtom);
    const [, setEndTime] = useAtom(endTimeAtom);

    const [, setSearchLocations] = useAtom(searchLocationsAtom);

    const ctx = api.useContext();

    const user = useUser();

    const { mutate: updateItemClassPosition } = api.itemClass.updateItemClassPosition.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setLoadingToastText("");
            void ctx.itemClass.getAllItemClasses.invalidate();
        }
    });

    const { data: itemClasses } = api.itemClass.getAllItemClasses.useQuery();


    const [itemClassesState, setItemClassesState] = useState<ItemClasses>();

    useEffect(() => {
        if (itemClasses !== undefined) {
            setItemClassesState(itemClasses);
        }
    }, [itemClasses]);

    const dragItem = useRef(-1);
    const dragOverItem = useRef(-1);

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
            itemClassName: string, 
            createdUserName: string,
            createdUserImage: string,
            createdAt: string,
            updatedUserName: string,
            updatedUserImage: string,
            updatedAt: string,
    ) {
        if (displayCard) return null;

        setDisplayCard(true); 
        setCardTitle(itemClassName);
        setCheckCardTitle(itemClassName);
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
        const _itemClasses: ItemClasses = [];

        if (!itemClassesState) return null;
        itemClassesState.forEach(itemClass => _itemClasses.push(Object.assign({}, itemClass)));

        const draggedItemContent = _itemClasses.splice(dragItem.current, 1)[0];

        if (draggedItemContent) {
            _itemClasses.splice(dragOverItem.current, 0, draggedItemContent);
        }

        dragItem.current = -1;
        dragOverItem.current = -1;

        setItemClassesState(_itemClasses);
    }

    function handleUpdatePositionsClick() {
        if (!itemClassesState) return null;
        if (displayCard) return null;

        setLoadingToastText("Updating Positions..." );
        setDisplayLoadingToast(true);

        itemClassesState.map(({ itemClass }, index) => {
            updateItemClassPosition({ id: itemClass.id, position: index })
        });
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

    if (!itemClassesState) {
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
                        <h1 className="text-[2rem] font-medium">PLU Classes</h1>

                        <div className="flex flex-col space-y-2 text-sm font-light ">
                            <div className="items-center space-y-1">
                                <p className="dark:text-neutral-200">
                                    Create classes that can be assigned to items, position them from top to bottom to give certain classes precedence over others.
                                </p>

                                <p className="dark:text-neutral-200">
                                    Simply drag and drop to update positions, classes positioned higher in the list take greater precedence when rendering to the KMS UI.
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

                                    <p className={`${displayCard ? "" : "group-hover:text-slate-800 dark:group-hover:text-neutral-300/70" || ""}`}>Add Class</p>
                                </div>

                                <div 
                                    className={`flex items-center space-x-1 w-fit text-zinc-500 group dark:hover:text-neutral-300/70 ${displayCard ? "cursor-default" : "cursor-pointer" || ""}`}
                                    onClick={handleUpdatePositionsClick}
                                >
                                    <RxUpdate 
                                        className={`${displayCard ? "" : "group-hover:text-blue-400 dark:group-hover:text-pink-300/70 group-hover:animate-spin" || ""}`} 
                                    />

                                    <p className={`${displayCard ? "" : "group-hover:text-slate-800 dark:group-hover:text-neutral-300/70" || ""}`}>Update Positions</p>
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
                                            Class
                                        </th>

                                        <th scope="col" className="px-6 py-3">
                                            Created
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {itemClassesState && itemClassesState.length > 0 && (
                                        <>
                                            {itemClassesState.map(({ itemClass, user, updatedUser }, index) => (
                                                <tr 
                                                    key={itemClass.id}
                                                    className="bg-white border-b dark:bg-[#1b1b1c] border-slate-300 dark:border-neutral-800 cursor-pointer dark:hover:bg-neutral-800"
                                                    onClick={(() => 
                                                        handleCardClick(
                                                            itemClass.id,
                                                            itemClass.className,
                                                            formatUserName(user?.firstName || "", user?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(itemClass.createdAt),
                                                            formatUserName(updatedUser?.firstName || "", updatedUser?.lastName || ""),
                                                            user?.profileImageUrl || "",
                                                            formatTimestamp(itemClass.updatedAt)
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
                                                        {itemClass.id}
                                                    </th>

                                                    <td className="px-6 py-4">
                                                        {itemClass.className}
                                                    </td>

                                                    <td className="flex items-center space-x-2 px-6 py-4">
                                                        <Image 
                                                            src={user?.profileImageUrl || ""}
                                                            className="rounded-full"
                                                            width={20}
                                                            height={20}
                                                            alt="User Profile Image"
                                                        />

                                                        <p className="text-[10px] 2xl:text-xs text-zinc-500 font-light">{formatTimestamp(itemClass.createdAt)}</p>
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
                configuration={<ItemClassConfiguration />} 
                mutateButton={<MutateButton />}
            />

        </div>
    );
};

export default ItemClasses;