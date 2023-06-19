import React, { useRef, type Dispatch, type SetStateAction, useEffect } from "react";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { cardIdAtom, priceOneAtom, priceThreeAtom, priceTwoAtom, uuidAtom } from "~/store/store";

import { api } from "~/utils/api";

const InputSearchDropdown = ({ 
    labelName,
    inputValue, 
    setInputValue,
    menuCategoryData,
    toggleDropdown,
    setToggleDropdown,
    scale,
    itemClassData,
    setDropdownItemsId,
    itemCategoryData,
    itemData,
    choiceData,
}: { 
    labelName: string;
    inputValue: string; 
    setInputValue: Dispatch<SetStateAction<string>>;
    toggleDropdown: boolean;
    setToggleDropdown: Dispatch<SetStateAction<boolean>>;
    menuCategoryData?: { id: number; menuCategoryName: string; }[]
    itemClassData?: { id: number; className: string; }[] | undefined;
    itemCategoryData?: { id: number; categoryName: string; }[] | undefined;
    itemData?: { id: number; itemName: string; priceLevelOne: string; priceLevelTwo: string; priceLevelThree: string; }[] | undefined;
    choiceData?: { id: number; choiceName: string; }[] | undefined
    setDropdownItemsId?: Dispatch<SetStateAction<string>>;
    scale?: boolean;
}) => {
    const [, setPriceOne] = useAtom(priceOneAtom);
    const [, setPriceTwo] = useAtom(priceTwoAtom);
    const [, setPriceThree] = useAtom(priceThreeAtom);

    const filteredMenuCategories = menuCategoryData?.filter(({ menuCategoryName }) =>
        menuCategoryName.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    const filteredItemClasses = itemClassData?.filter(({ className }) =>
        className.toLowerCase().includes(inputValue.toLowerCase())
    );

    const filteredItemCategories = itemCategoryData?.filter(({ categoryName }) =>
        categoryName.toLowerCase().includes(inputValue.toLowerCase())
    );

    const filteredItems = itemData?.filter(({ itemName }) =>
        itemName.toLowerCase().includes(inputValue.toLowerCase())
    );

    const filteredChoices = choiceData?.filter(({ choiceName }) =>
        choiceName.toLowerCase().includes(inputValue.toLowerCase())
    );

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

    function dropdownItemsObj(name: string, id: number, priceOne?: string, priceTwo?: string, priceThree?: string) {
        setInputValue(name);
        if(setDropdownItemsId) {
            setDropdownItemsId(id.toString());
        }

        if(priceOne) {
            setPriceOne(priceOne);
        }
        if(priceTwo) {
            setPriceTwo(priceTwo);
        }
        if(priceThree) {
            setPriceThree(priceThree);
        }
    }

    return (
        <>

            <div className={`relative ${scale && "md:scale-[0.85] 2xl:scale-100"}`}>
                <div 
                    className={`relative px-[1px] border dark:bg-neutral-800 focus:outline-none focus:ring-0 bg-neutral-100 flex items-center ${inputValue !== "" && toggleDropdown ? "rounded-t-lg border-slate-300 dark:border-neutral-600" : "rounded-lg dark:border-neutral-700" || ""}`}       
                    ref={dropdownRef}              
                >
                    <input 
                        id={labelName}
                        type="text"
                        className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-neutral-100 dark:bg-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer pr-2" 
                        placeholder=" "
                        value={inputValue}
                        onChange={((e) => setInputValue(e.target.value))}
                        onClick={(() => setToggleDropdown(true))} 
                    />

                    <label 
                        htmlFor={labelName} 
                        className="absolute cursor-text text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500"
                        onClick={(() => setToggleDropdown(true))} 
                    >
                        {labelName}
                    </label>

                </div>

                {inputValue !== "" && toggleDropdown && filteredMenuCategories && (
                    <div className={`absolute w-full z-20 bg-neutral-100 rounded-b-lg border-b border-l border-r dark:bg-neutral-800 dark:border-b-neutral-700 dark:border-l-neutral-700 dark:border-r-neutral-700 text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${inputValue !== "" ? "opacity-100 border-slate-300" : "opacity-0" || ""}`}>
                        {filteredMenuCategories.map(({ id, menuCategoryName }, index) => (
                            <p 
                                key={index} 
                                className={`hover:bg-slate-50 dark:hover:bg-neutral-700 px-2.5 py-4 ${menuCategoryName === inputValue && "bg-slate-50 dark:bg-neutral-700" || ""} ${index === filteredMenuCategories.length - 1 && "rounded-b-lg" || ""}`}
                                onClick={(() => dropdownItemsObj(menuCategoryName, id))}
                            >
                                {menuCategoryName}
                            </p>
                        ))}

                    </div>  
                )}

                {inputValue !== "" && toggleDropdown && filteredItemClasses && (
                    <div className={`absolute w-full z-20 bg-neutral-100 rounded-b-lg border-b border-l border-r dark:bg-neutral-800 dark:border-b-neutral-700 dark:border-l-neutral-700 dark:border-r-neutral-700 text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${inputValue !== "" ? "opacity-100 border-slate-300" : "opacity-0" || ""}`}>
                        {filteredItemClasses.map(({ id, className }, index) => (
                            <p 
                                key={index} 
                                className={`hover:bg-slate-50 dark:hover:bg-neutral-700 px-2.5 py-4 ${className === inputValue && "bg-slate-50 dark:bg-neutral-700" || ""} ${index === filteredItemClasses.length - 1 && "rounded-b-lg" || ""}`}
                                onClick={(() => dropdownItemsObj(className, id))}
                            >
                                {className}
                            </p>
                        ))}

                    </div>  
                )}

                {inputValue !== "" && toggleDropdown && filteredItemCategories && (
                    <div className={`absolute z-30 w-full bg-neutral-100 rounded-b-lg border-b border-l border-r dark:bg-neutral-800 dark:border-b-neutral-700 dark:border-l-neutral-700 dark:border-r-neutral-700 text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${inputValue !== "" ? "opacity-100 border-slate-300" : "opacity-0" || ""}`}>
                        {filteredItemCategories.map(({ id, categoryName }, index) => (
                            <p 
                                key={index} 
                                className={`hover:bg-slate-50 dark:hover:bg-neutral-700 px-2.5 py-4 ${categoryName === inputValue && "bg-slate-50 dark:bg-neutral-700" || ""} ${index === filteredItemCategories.length - 1 && "rounded-b-lg" || ""}`}
                                onClick={(() => dropdownItemsObj(categoryName, id))}
                            >
                                {categoryName}
                            </p>
                        ))}

                    </div>  
                )}

                {inputValue !== "" && toggleDropdown && filteredItems && (
                    <div className={`absolute z-30 w-full bg-neutral-100 rounded-b-lg border-b border-l border-r dark:bg-neutral-800 dark:border-b-neutral-700 dark:border-l-neutral-700 dark:border-r-neutral-700 text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${inputValue !== "" ? "opacity-100 border-slate-300" : "opacity-0" || ""}`}>
                        {filteredItems.map(({ id, itemName, priceLevelOne, priceLevelTwo, priceLevelThree }, index) => (
                            <p 
                                key={index} 
                                className={`hover:bg-slate-50 dark:hover:bg-neutral-700 px-2.5 py-4 ${itemName === inputValue && "bg-slate-50 dark:bg-neutral-700" || ""} ${index === filteredItems.length - 1 && "rounded-b-lg" || ""}`}
                                onClick={(() => dropdownItemsObj(itemName, id, priceLevelOne, priceLevelTwo, priceLevelThree))}
                            >
                                {itemName}
                            </p>
                        ))}

                    </div>  
                )}

                {inputValue !== "" && toggleDropdown && filteredChoices && (
                    <div className={`absolute z-30 w-full bg-neutral-100 rounded-b-lg border-b border-l border-r dark:bg-neutral-800 dark:border-b-neutral-700 dark:border-l-neutral-700 dark:border-r-neutral-700 text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${inputValue !== "" ? "opacity-100 border-slate-300" : "opacity-0" || ""}`}>
                        {filteredChoices.map(({ id, choiceName }, index) => (
                            <p 
                                key={index} 
                                className={`hover:bg-slate-50 dark:hover:bg-neutral-700 px-2.5 py-4 ${choiceName === inputValue && "bg-slate-50 dark:bg-neutral-700" || ""} ${index === filteredChoices.length - 1 && "rounded-b-lg" || ""}`}
                                onClick={(() => dropdownItemsObj(choiceName, id))}
                            >
                                {choiceName}
                            </p>
                        ))}

                    </div>  
                )}

            </div>   
        </>
  
    );
};

export default InputSearchDropdown;