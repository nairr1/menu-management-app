import React, { type ReactNode, useState } from "react";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { 
    cardIdAtom,
    cardTitleAtom,
    cardTransitionAtom,
    createdAtAtom,
    createdUserImageAtom,
    createdUserNameAtom,
    displayCardAtom,
    updatedAtAtom, 
    updatedUserImageAtom, 
    updatedUserNameAtom
} from "~/store/store";

import { api } from "~/utils/api";

import { AiOutlineUser } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { RxDoubleArrowRight } from "react-icons/rx";
import { CgArrowsExpandLeft } from "react-icons/cg";
import { BsTrash, BsCheckAll } from "react-icons/bs";
import LoadingSpinner from "./LoadingSpinner";



interface CardSkeletonProps {
    cardDetails?: React.ReactNode;
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

const AdminCard = ({ cardDetails }: CardSkeletonProps) => {
    const [expandCard, setExpandCard] = useState(false);
    const [displayDeletePrompt, setDisplayDeletePrompt] = useState(false);

    const [displayCard, setDisplayCard] = useAtom(displayCardAtom);
    const [cardTransition, setCardTransition] = useAtom(cardTransitionAtom);

    const [cardId, setCardId] = useAtom(cardIdAtom)
    const [cardTitle, setCardTitle] = useAtom(cardTitleAtom);
    const [createdUserName, setCreatedUserName] = useAtom(createdUserNameAtom);
    const [createdUserImage, setCreatedUserImage] = useAtom(createdUserImageAtom);
    const [createdAt, setCreatedAt] = useAtom(createdAtAtom);
    const [updatedUserName, setUpdatedUserName] = useAtom(updatedUserNameAtom);
    const [updatedUserImage, setUpdatedUserImage] = useAtom(updatedUserImageAtom);
    const [updatedAt, setUpdatedAt] = useAtom(updatedAtAtom);

    const ctx = api.useContext();

    const router = useRouter();

    const handleCloseMenuCard = () => {
        setCardTransition(false);
        setExpandCard(false);
        setCardId(0);

        setTimeout(() => {
            setDisplayCard(false);
        }, 750);
    };

    const { mutate: deleteMenu, isLoading: isDeletingMenu } = api.menu.deleteMenu.useMutation({
        onSuccess: () => {
            handleCloseMenuCard(),
            setDisplayDeletePrompt(false);
            ctx.menu.getAllMenus.invalidate();
            ctx.menu.getLatestMenuPosition.invalidate();
        },
    });

    function deleteCard(path: string) {
        switch(path) {
            case("/admin/menus"):
                return deleteMenu({ id: cardId })
        }
    }

    return (
        <>
            {isDeletingMenu && (
                <LoadingSpinner text={`Deleting Menu ID: ${cardId}`} />
            )}

            <div className={`fixed scrollbar h-screen border-l right-0 bg-white shadow-lg duration-1000 transition-all ease-in-out ${expandCard ? "w-full" : "w-1/2" || ""} ${cardTransition ? "" : "translate-x-full " } ${displayCard ? "" : "hidden" || ""}`}>
                <div className="sticky top-0 z-30 bg-white flex space-x-2 py-2 px-3">
                    <RxDoubleArrowRight 
                        className="p-1 text-[1.5rem] cursor-pointer text-zinc-500 hover:bg-neutral-100 rounded-md" 
                        onClick={handleCloseMenuCard}
                    />

                    <CgArrowsExpandLeft 
                        className={`p-1 text-[1.5rem] cursor-pointer text-zinc-500 rounded-md ${expandCard ? "bg-neutral-200" : "hover:bg-neutral-100"}`} 
                        onClick={(() => setExpandCard(!expandCard))}
                    />


                    <BsTrash 
                        className={`p-1 text-[1.5rem] cursor-pointer text-zinc-500 rounded-md ${displayDeletePrompt ? "bg-neutral-200" : "hover:bg-neutral-100"}`} 
                        onClick={(() => setDisplayDeletePrompt(!displayDeletePrompt))}
                    />

                    {displayDeletePrompt && (
                        <div    
                            className={`flex items-center space-x-1 p-1 text-[1.5rem] cursor-pointer text-zinc-500 rounded-md group hover:bg-neutral-100`} 
                            onClick={(() => deleteCard(router.pathname))}
                        >
                            <p className="text-xs">Are you sure?</p>

                            <BsCheckAll className="text-sm group-hover:text-red-500" />
                        </div>
                    )}
                </div>

                <div className="px-12 py-10">
                    <input 
                        type="text" 
                        className="text-[1.75rem] w-full font-light mb-8 outline-none"
                        placeholder="Menu Name" 
                        spellCheck="false" 
                        value={cardTitle}
                        onChange={((e) => setCardTitle(e.target.value))}
                    />

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

                    <div className="border-t mt-4">
                        {cardDetails}
                    </div>
                </div>

            </div>
        </>
    );
};

export default AdminCard;