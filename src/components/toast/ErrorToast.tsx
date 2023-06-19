import React from "react";

import { useAtom } from "jotai";
import { errorTextAtom } from "~/store/store";

const ErrorToast = () => {
    const [errorText] = useAtom(errorTextAtom);

    const filteredErrors = errorText.filter((error) => error !== "");
    if (filteredErrors.length === 0) return null;

    return (
        <div className="fixed flex bg-red-500 flex-col space-y-2 text-white bottom-2 px-6 py-4 rounded-lg border border-red-400 shadow-md left-2 z-50">
            <h2 className="text-center text-sm font-semibold">Validation Error:</h2>

            <div className="flex flex-col space-y-1">
                {filteredErrors.map((error, index) => (
                    <div 
                        key={index}
                        className="flex items-center space-x-1"
                    >
                        <span className="border border-white rounded-full h-1 w-1 bg-white ">{" "}</span>
                        
                        <p className="text-xs font-light">{error}</p>
                    </div>

                ))}
            </div>

        </div>
    );
};

export default ErrorToast;