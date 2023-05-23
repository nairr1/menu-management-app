import React, { type Dispatch, type SetStateAction } from "react";

const Input = ({ 
    inputValue,
    setInputValue,
    labelName 
}: { 
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    labelName: string; 
}) => {
    return (
        <div className="relative">
            <input 
                id={labelName}
                type="text" 
                className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-neutral-100 appearance-none focus:outline-none focus:ring-0 border focus:border-slate-300 peer" 
                placeholder=" " 
                value={inputValue}
                onChange={((e) => setInputValue(e.target.value))}
            />


            <label htmlFor={labelName} className="absolute cursor-text text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500">{labelName}</label>

        </div>
    );
};

export default Input;