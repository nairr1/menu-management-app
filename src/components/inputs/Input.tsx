import React, { type Dispatch, type SetStateAction } from "react";

const Input = ({ 
    inputValue,
    setInputValue,
    labelName,
    scale, 
    number,
    disabled
}: { 
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    labelName: string; 
    scale?: boolean;
    number?: boolean;
    disabled?: boolean;
}) => {
    return (
        <div className={`relative ${scale && "md:scale-[0.85] 2xl:scale-100" || ""}`}>
            <input 
                id={labelName}
                type={number ? "number" : "text"} 
                className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 appearance-none focus:outline-none focus:ring-0 border focus:border-slate-300 dark:focus:border-neutral-600 peer [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                placeholder=" " 
                value={inputValue}
                onChange={((e) => setInputValue(e.target.value))}
                disabled={disabled}
            />


            <label 
                htmlFor={labelName} 
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500 ${disabled ? "cursor-default" : "cursor-text" || ""}`}
            >
                {labelName}
            </label>

        </div>
    );
};

export default Input;