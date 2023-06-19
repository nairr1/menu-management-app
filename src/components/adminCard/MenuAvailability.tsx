import React, { useState } from "react";
import { useRouter } from "next/router";

import { RouterOutputs, api } from "~/utils/api";

import { useAtom } from "jotai";
import { 
    cardIdAtom,
    dayAtom, 
    displayErrorAtom, 
    displayLoadingToastAtom, 
    endTimeAtom,
    errorTextAtom,
    loadingToastTextAtom,
    startTimeAtom,
} from "~/store/store";

import InputForDropdown from "../inputs/InputForDropdown";
import Input from "../inputs/Input";
import { formatDayForClient } from "~/utils/formatDayForClient";
import { formatTime } from "~/utils/formatTime";
import { formatDayForServer } from "~/utils/formatDayForServer";

import { BsPlusLg } from "react-icons/bs";

type MenuCategoryAvailability = RouterOutputs["menuCategory"]["getMenuCategoryAvailabilityRuleById"];
type MenuAvailability = RouterOutputs["menu"]["getMenuAvailabilityRuleByMenuId"];

interface MenuAvailabilityProps {
    menuCategoryAvailabilityData?: MenuCategoryAvailability;
    menuAvailabilityData?: MenuAvailability;
    title: string;
}

const MenuAvailability = ({ 
    title,
    menuCategoryAvailabilityData,
    menuAvailabilityData,
}: MenuAvailabilityProps) => {
    const [toggleDayDropdown, setToggleDayDropdown] = useState(false);

    const [, setDisplayError] = useAtom(displayErrorAtom);
    const [, setErrorText] = useAtom(errorTextAtom);

    const [, setDisplayLoadingToast] = useAtom(displayLoadingToastAtom);
    const [, setLoadingToastText] = useAtom(loadingToastTextAtom);

    const [cardId] = useAtom(cardIdAtom);

    const [day, setDay] = useAtom(dayAtom);
    const [startTime, setStartTime] = useAtom(startTimeAtom);
    const [endTime, setEndTime] = useAtom(endTimeAtom);

    const ctx = api.useContext();

    const router = useRouter();

    const { mutate: createMenuAvailabilityRule } = api.menu.createMenuAvailabilityRule.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDay("");
            setStartTime("");
            setEndTime("");
            void ctx.menu.getMenuAvailabilityRuleByMenuId.invalidate();
        },
    });

    const { mutate: createMenuCategoryAvailabilityRule, } = api.menuCategory.createMenuCategoryAvailabilityRule.useMutation({
        onSuccess: () => {
            setDisplayLoadingToast(false);
            setDay("");
            setStartTime("");
            setEndTime("");
            void ctx.menuCategory.getMenuCategoryAvailabilityRuleById.invalidate();
        },
    });

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    function createRule(path: string) {
        switch(path) {
            case("/admin/menus"):
                if (day === "" || !startTime.match(timeRegex) || !endTime.match(timeRegex)) {
                    setDisplayError(true);

                    setErrorText([
                        day === "" ? "Day of the week wasn't entered." : "",
                        !startTime.match(timeRegex) ? "Start time wasn't formatted correctly." : "",
                        !endTime.match(timeRegex) ? "End time wasn't formatted correctly." : "",
                    ])
        
                    setTimeout(() => {
                        setDisplayError(false);
                    }, 2000);
                }
        
                if (day !== "" && startTime.match(timeRegex) && endTime.match(timeRegex)) {
                    setDisplayError(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText("Creating Rule...");
        
                    createMenuAvailabilityRule({
                        id: cardId,
                        day: formatDayForServer(day),
                        startTime: startTime.length === 4 ? `0${startTime}` : startTime,
                        endTime: endTime.length === 4 ? `0${endTime}` : endTime,
                    });
                }
                break;

            case("/admin/menu-categories"):
                if (day === "" || !startTime.match(timeRegex) || !endTime.match(timeRegex)) {
                    setDisplayError(true);

                    setErrorText([
                        day === "" ? "Day of the week wasn't entered." : "",
                        !startTime.match(timeRegex) ? "Start time wasn't formatted correctly." : "",
                        !endTime.match(timeRegex) ? "End time wasn't formatted correctly." : "",
                    ])
        
                    setTimeout(() => {
                        setDisplayError(false);
                    }, 2000);
                }
        
                if (day !== "" && startTime.match(timeRegex) && endTime.match(timeRegex)) {
                    setDisplayError(false);
                    setDisplayLoadingToast(true);
                    setLoadingToastText("Creating Rule...");
        
                    createMenuCategoryAvailabilityRule({
                        id: cardId,
                        day: formatDayForServer(day),
                        startTime: startTime.length === 4 ? `0${startTime}` : startTime,
                        endTime: endTime.length === 4 ? `0${endTime}` : endTime,
                    });
                }
                break;
        } 
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center mb-4">
                <h2 className="text-center capitalize">{title} Availability</h2>

                <p className="text-xs font-light">Create rules to dictate when the {title} will be available.</p>
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

                <div 
                    className="flex items-center space-x-1 w-fit text-zinc-500 cursor-pointer group"
                    onClick={(() => createRule(router.pathname))}
                >
                    <BsPlusLg 
                        className="group-hover:text-blue-400 dark:group-hover:text-pink-300/70" 
                    />

                    <p className="group-hover:text-slate-800 dark:group-hover:text-neutral-300/70 text-xs">Add Availability Rule</p>
                </div>

            </div>

            {menuCategoryAvailabilityData && menuCategoryAvailabilityData.length > 0 && (
                <div className="flex flex-col space-y-4">
                    {menuCategoryAvailabilityData.map(({ dayOfWeek, startTime, endTime }, index) => (
                        <div 
                            className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-2 w-fit rounded-lg text-xs font-light"
                            key={index}
                        >
                            <p className="w-[8rem]">Day: {formatDayForClient(dayOfWeek)}</p>

                            <p className="w-[8rem]">Start: {formatTime(startTime)}</p>

                            <p className="w-[8rem]">End: {formatTime(endTime)}</p>
                            
                        </div>
                    ))}
                </div>
            )}

            {menuAvailabilityData && menuAvailabilityData.length > 0 && (
                <div className="flex flex-col space-y-4">
                    {menuAvailabilityData.map(({ dayOfWeek, startTime, endTime }, index) => (
                        <div 
                            className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-2 w-fit rounded-lg text-xs font-light"
                            key={index}
                        >
                            <p className="w-[8rem]">Day: {formatDayForClient(dayOfWeek)}</p>

                            <p className="w-[8rem]">Start: {formatTime(startTime)}</p>

                            <p className="w-[8rem]">End: {formatTime(endTime)}</p>
                            
                        </div>
                    ))}
                </div>
            )}
            
        </div>    
    );
};

export default MenuAvailability;