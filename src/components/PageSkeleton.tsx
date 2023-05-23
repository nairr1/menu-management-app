import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

import { RouterOutputs, api } from "~/utils/api";
import { formatTimestamp } from "~/utils/formatTimestamp";

import { BsPlusLg } from "react-icons/bs";
import LoadingSpinner from "./LoadingSpinner";
import { formatUserName } from "~/utils/formatUserName";

interface PageSkeletonProps {
    pageTitle: string;
    pageDescription: string[];
    handleMenuCardClick?: (id: number, menuName: string, menuType: number, priceLevel: number, createdUserName: string, createdUserImage: string, createdAt: string, updatedUserName: string, updatedUserImage: string, updatedAt: string) => void;
    handleNewMenuCardClick?: () =>  void;
    cardId: number;
}

type Menus = RouterOutputs["menu"]["getAllMenus"];

const PageSkeleton = ({ 
    pageTitle,
    pageDescription,
    handleMenuCardClick,
    handleNewMenuCardClick,
    cardId,
}: PageSkeletonProps) => {
    const { data: menus } = api.menu.getAllMenus.useQuery();

    if (!menus) return <LoadingSpinner text="Loading..." />;

    if (!handleMenuCardClick) return null;

    const chunkSize = 1;
    let chunk: Menus[] = [];

    for (let i = 0; i < menus.length; i += chunkSize) {
        chunk.push(menus.slice(i, i + chunkSize));
    }

    console.log(chunk[0])

    return (
        <div className="sticky top-0 flex-1 h-screen scrollbar w-fit py-8 px-20">
            <div className="flex-1 flex flex-col space-y-4 py-10 px-8">
                <div className="flex flex-col space-y-1 border-b py-2">
                    <h1 className="text-[2rem] font-medium">{pageTitle}</h1>

                    <div className="flex flex-col space-y-2 text-sm font-light ">
                        {pageDescription.map((item) => (
                            <div className="flex items-center space-x-1">


                                <p className="">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="flex flex-col space-y-0.5">
                    <div 
                        className={`flex items-center space-x-1 cursor-pointer py-1 px-2 rounded-sm group ${cardId === -1 ? "bg-neutral-100" : "hover:bg-neutral-100" || ""}`}
                        onClick={handleNewMenuCardClick}
                    >
                        <BsPlusLg className="text-zinc-500 cursor-pointer" />

                        <input 
                            type="text" 
                            className={`text-zinc-500 cursor-pointer outline-none ${cardId === -1 ? "bg-neutral-100" : "group-hover:bg-neutral-100" || ""}`}
                            value="New" 
                            readOnly
                            spellCheck="false" 
                        />
                    </div>
                </div>
        
            </div>

        </div>
    );
};

export default PageSkeleton;