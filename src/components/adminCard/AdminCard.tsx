import React, { type ReactNode } from "react";

import { useAtom } from "jotai";
import { 
    cardIdAtom,
    cardTitleAtom,
    cardTransitionAtom,
    confirmChangesAnimationAtom,
    confirmChangesAtom,
    createdAtAtom,
    createdUserImageAtom,
    createdUserNameAtom,
    displayCardAtom,
    expandCardAtom,
    newCardAtom,
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom
} from "~/store/store";

import { AiOutlineUser } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import ConfirmationToast from "../toast/ConfirmationToast";

interface AdminCardProps {
    adminCardFunctions: React.ReactNode;
    configuration: React.ReactNode;
    locationMapping?: React.ReactNode;
    mappedMenuCategories?: React.ReactNode;
    menuAvailability?: React.ReactNode;
    mutateButton: React.ReactNode;
    itemChoiceItemMap?: React.ReactNode; 
    mappedItemChoice?: React.ReactNode;
    menuCategoryItems?: React.ReactNode;
}

const UserAndTimestampDetails = ({ icon, property }: { icon: ReactNode; property: string; }) => {
    return (
        <div>
            <div className="flex w-[10rem] items-center space-x-1 text-base">
                {icon}

                <p className="text-sm">{property}</p>
            </div>
        </div>
    );
};

const AdminCard = ({ 
    adminCardFunctions,
    configuration, 
    locationMapping, 
    mappedMenuCategories,
    menuAvailability, 
    mutateButton, 
    itemChoiceItemMap,
    mappedItemChoice,
    menuCategoryItems,
}: AdminCardProps) => {
    const [expandCard] = useAtom(expandCardAtom);

    const [newCard] = useAtom(newCardAtom);
    const [displayCard] = useAtom(displayCardAtom);
    const [cardTransition] = useAtom(cardTransitionAtom);

    const [, setConfirmChanges] = useAtom(confirmChangesAtom);
    const [, setConfirmChangesAnimation] = useAtom(confirmChangesAnimationAtom);

    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [cardId] = useAtom(cardIdAtom);
    const [createdUserName] = useAtom(createdUserNameAtom);
    const [createdUserImage] = useAtom(createdUserImageAtom);
    const [createdAt] = useAtom(createdAtAtom);
    const [updatedUserName] = useAtom(updatedUserNameAtom);
    const [updatedUserImage] = useAtom(updatedUserImageAtom);
    const [updatedAt] = useAtom(updatedAtAtom);

    function closeConfirmChangesPrompt() {
        setConfirmChangesAnimation(false);

        setTimeout(() => {
            setConfirmChanges(false);
        }, 750);
    }

    return (
        <>
            <ConfirmationToast />

            <div className={`fixed scrollbar dark:bg-[#1b1b1c] h-screen border-l dark:border-l-neutral-800 right-0 bg-white shadow-lg duration-[800ms] transition-all ease-in-out ${expandCard ? "w-full" : "w-1/2" || ""} ${cardTransition ? "" : "translate-x-full " } ${displayCard ? "" : "hidden" || ""}`}>
                {adminCardFunctions}

                <div className="px-12 py-10"
                    onClick={closeConfirmChangesPrompt}
                >
                    <input 
                        type="text" 
                        className="text-[1.75rem] dark:placeholder:text-zinc-500 w-full font-light outline-none dark:bg-[#1b1b1c]"
                        placeholder="Title" 
                        spellCheck="false" 
                        value={cardTitle}
                        onChange={((e) => setCardTitle(e.target.value))}
                    />

                    <p className={`text-sm font-light mb-8 ml-0.5 ${newCard ? "opacity-0" : "" || ""}`}>ID: {cardId}</p>

                    <div className="flex flex-col space-y-5 w-fit text-zinc-500 font-light text-sm">
                        <div className="flex items-center">
                            <UserAndTimestampDetails
                                icon={<AiOutlineUser />}
                                property="Created By"
                            />

                            <div className="flex items-center space-x-2">
                                <img
                                    src={createdUserImage}
                                    className="rounded-full"
                                    width={20}
                                    height={20}
                                    alt="Updated user image"
                                />

                                <p>{createdUserName}</p>
                            </div>
                            
                        </div>

                        <div className="flex items-center">
                            <UserAndTimestampDetails
                                icon={<IoMdTime />}
                                property="Created"
                            />

                            <p>{createdAt}</p>
                            
                        </div>

                        <div className="flex items-center">
                            <UserAndTimestampDetails
                                icon={<AiOutlineUser />}
                                property="Updated By"
                            />

                            <div className="flex items-center space-x-2">
                                <img
                                    src={updatedUserImage}
                                    className="rounded-full"
                                    width={20}
                                    height={20}
                                    alt="Updated user image"
                                />

                                <p>{updatedUserName}</p>
                            </div>

                        </div>

                        <div className="flex items-center">
                            <UserAndTimestampDetails
                                icon={<IoMdTime />}
                                property="Updated"
                            />

                            <p>{updatedAt}</p>
                            
                        </div>

                    </div>

                    <div className="border-t dark:border-t-neutral-800 mt-4">
                        <div className="flex flex-col space-y-16">   
                            {configuration}

                            {!newCard && (
                                <>
                                    {locationMapping}

                                    {menuAvailability}

                                    {mappedMenuCategories}

                                    {itemChoiceItemMap}

                                    {mappedItemChoice}

                                    {menuCategoryItems}
                                </>
                            )}

                            {mutateButton}

                        </div>
                        
                    </div>

                </div>

            </div>
        </>
    );
};

export default AdminCard;