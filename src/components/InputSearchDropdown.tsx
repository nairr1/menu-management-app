import { useAtom } from "jotai";
import React, { useRef, type Dispatch, type SetStateAction, useEffect } from "react";
import { cardIdAtom } from "~/store/store";
import { api } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";

const InputSearchDropdown = ({ 
    labelName,
    inputValue, 
    setInputValue,
    menuCategoryData,
    toggleDropdown,
    setToggleDropdown,
}: { 
    labelName: string;
    inputValue: string; 
    setInputValue: Dispatch<SetStateAction<string>>;
    toggleDropdown: boolean;
    setToggleDropdown: Dispatch<SetStateAction<boolean>>;
    menuCategoryData?: { id: number; menuCategoryName: string; }[]
}) => {
    const [cardId, setCardId] = useAtom(cardIdAtom);
    const ctx = api.useContext();

    const { mutate: createMappedMenuCategory, isLoading: isCreatingMappedMenuCategory } = api.menuCategoryMap.createMenuMappedCategory.useMutation({
        onSuccess: () => {
            setInputValue("");
            ctx.menuCategoryMap.getMenuCategoriesForDropdown.invalidate();
            ctx.menuCategoryMap.getMappedMenuCategoriesByMenuId.invalidate();
        },
    });

    const filteredMenuCategories = menuCategoryData?.filter(({ menuCategoryName }) =>
        menuCategoryName.toLowerCase().includes(inputValue.toLowerCase())
    );

    function handleCreateMenuCategoryMapClick(name: string, id: number) {
        setInputValue(name);
        createMappedMenuCategory({ menuId: cardId, menuCategoryId: id });
    }

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
        <>
            {isCreatingMappedMenuCategory && (
                <LoadingSpinner text={`Mapping ${inputValue} to Menu ID: ${cardId}`} />
            )}

            <div className="relative">
                <div 
                    className={`relative border focus:outline-none focus:ring-0 bg-neutral-100 flex items-center ${inputValue !== "" ? "rounded-t-lg border-slate-300" : "rounded-lg" || ""}`}       
                    ref={dropdownRef}              
                >
                    <input 
                        id={labelName}
                        type="text"
                        className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-neutral-100 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer pr-2" 
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

                {inputValue !== "" && filteredMenuCategories && filteredMenuCategories.length > 0 && toggleDropdown && (
                    <div className={`absolute w-full z-20 bg-neutral-100 rounded-b-lg border-b border-l border-r text-sm cursor-pointer font-light transition-all delay-1000 animate-[wiggle_1s_ease-in-out_infinite] ${inputValue !== "" ? "opacity-100 border-slate-300" : "opacity-0" || ""}`}>
                        {filteredMenuCategories.map(({ id, menuCategoryName }, index) => (
                            <p 
                                key={index} 
                                className={`hover:bg-slate-50 px-2.5 py-2 ${menuCategoryName === inputValue && "bg-slate-50" || ""} ${index === filteredMenuCategories.length - 1 && "rounded-lg" || ""}`}
                                onClick={(() => handleCreateMenuCategoryMapClick(menuCategoryName, id))}
                            >
                                {menuCategoryName}
                            </p>
                        ))}

                    </div>
                )}

            </div>   
        </>
  
    );
};

export default InputSearchDropdown;