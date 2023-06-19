import React, { type Dispatch, type SetStateAction, useRef, useEffect } from "react";

import { RiArrowDownSLine } from "react-icons/ri";


const InputForDropdown = ({ 
    toggleDropdown, 
    setToggleDropdown, 
    inputValue,
    setInputValue,
    dropdownItems,
    labelName,
    scale,
    disabled,
}: {
    toggleDropdown: boolean;
    setToggleDropdown: Dispatch<SetStateAction<boolean>>;
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    dropdownItems?: string[];
    labelName: string;
    scale?: boolean;
    disabled?: boolean;
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
        <div className={`relative ${scale && "md:scale-[0.85] 2xl:scale-100"}`}>
            <div 
                className={`relative border focus:outline-none focus:ring-0 bg-neutral-100 dark:bg-neutral-800  flex items-center ${toggleDropdown ? "rounded-t-lg border-slate-300 dark:border-neutral-600" : "rounded-lg dark:border-neutral-700" || ""} ${disabled ? "cursor-default" : "cursor-pointer" || ""}`}                     
                onClick={disabled ? undefined : (() => setToggleDropdown(true))} 
                ref={dropdownRef}
            >
                <input 
                    id={labelName}
                    type="text"
                    className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-neutral-100 dark:bg-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer pr-2 ${disabled ? "cursor-default" : "cursor-pointer" || ""}`} 
                    placeholder=" "
                    readOnly
                    value={inputValue}
                    disabled={disabled}
                />

                <label 
                    htmlFor={labelName} 
                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500 ${disabled ? "cursor-default" : "cursor-pointer" || ""}`}
                >
                    {labelName}
                </label>

                <RiArrowDownSLine className="pr-2 text-2xl" />

            </div>

            {toggleDropdown && dropdownItems && (
                <div className={`absolute w-full z-20 bg-neutral-100 dark:bg-neutral-800 rounded-b-lg border-b border-l border-r text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${toggleDropdown ? "opacity-100 border-slate-300 dark:border-neutral-600" : "opacity-0 dark:border-neutral-700" || ""}`}>
                    {dropdownItems.map((item, index) => (
                        <p 
                            key={index} 
                            className={`hover:bg-slate-50 dark:hover:bg-neutral-700 px-2.5 py-2 ${item === inputValue && "bg-slate-50 dark:bg-neutral-700" || ""} ${index === dropdownItems.length - 1 && "rounded-b-lg" || ""}`}
                            onClick={(() => setInputValue(item))}
                        >
                            {item}
                        </p>
                    ))}
                </div>
            )}

        </div>     
    );
};

export default InputForDropdown;