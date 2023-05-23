import React, { type Dispatch, type SetStateAction, useRef, useEffect } from "react";

import { RiArrowDownSLine } from "react-icons/ri";


const InputForDropdown = ({ 
    toggleDropdown, 
    setToggleDropdown, 
    inputValue,
    setInputValue,
    dropdownItems,
    dropdownItemsObject,
    labelName,
}: {
    toggleDropdown: boolean;
    setToggleDropdown: Dispatch<SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    dropdownItems?: string[];
    dropdownItemsObject?: { id: number; menuName: string; }[];
    labelName: string;
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkIfClickedOutside = (event: MouseEvent) => {
            if (toggleDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setToggleDropdown(false);
            }
        };

        document.addEventListener("click", checkIfClickedOutside);
        return () => {
            document.removeEventListener("click", checkIfClickedOutside);
        }
    }, [toggleDropdown, setToggleDropdown]);

    return (
        <div className={`relative`}>
            <div 
                className={`relative border focus:outline-none focus:ring-0 cursor-pointer bg-neutral-100 flex items-center ${toggleDropdown ? "rounded-t-lg border-slate-300" : "rounded-lg" || ""}`}                     
                onClick={(() => setToggleDropdown(true))} 
                ref={dropdownRef}
            >
                <input 
                    id={labelName}
                    type="text"
                    className="block rounded-lg cursor-pointer px-2.5 pb-2.5 pt-5 w-full text-sm bg-neutral-100 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer pr-2" 
                    placeholder=" "
                    readOnly
                    value={inputValue}
                />

                <label htmlFor={labelName} className="absolute cursor-pointer text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500">{labelName}</label>

                <RiArrowDownSLine className="pr-2 text-2xl" />

            </div>

            {toggleDropdown && dropdownItems && (
                <div className={`absolute w-full z-20 bg-neutral-100 rounded-b-lg border-b border-l border-r text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${toggleDropdown ? "opacity-100 border-slate-300" : "opacity-0"}`}>
                    {dropdownItems.map((item, index) => (
                        <p 
                            key={index} 
                            className={`hover:bg-slate-50 px-2.5 py-2 ${item === inputValue && "bg-slate-50" || ""} ${index === dropdownItems.length - 1 && "rounded-lg" || ""}`}
                            onClick={(() => setInputValue(item))}
                        >
                            {item}
                        </p>
                    ))}
                </div>
            )}

            {toggleDropdown && dropdownItemsObject && (
                <div className={`absolute w-full z-20 bg-neutral-100 rounded-b-lg border-b border-l border-r text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${toggleDropdown ? "opacity-100 border-slate-300" : "opacity-0"}`}>
                    {dropdownItemsObject.map((item, index) => (
                        <p 
                            key={index} 
                            className={`hover:bg-slate-50 px-2.5 py-2 ${item.id.toString() === inputValue && "bg-slate-50" || ""} ${index === dropdownItemsObject.length - 1 && "rounded-lg" || ""}`}
                            onClick={(() => setInputValue(item.id.toString()))}
                        >
                            {item.menuName}
                        </p>
                    ))}
                </div>
            )}

        </div>     
    );
};

export default InputForDropdown;