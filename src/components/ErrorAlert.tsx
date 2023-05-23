import React from "react";

const ErrorAlert = ({ errors }: { errors: string[] }) => {
    const filteredErrors = errors.filter((error) => error !== "");
    if (filteredErrors.length === 0) return null;

    console.log(filteredErrors);

    return (
        <div className="fixed flex bg-red-500 flex-col space-y-2 text-white top-4 p-2 rounded-lg border shadow-xl right-8 z-50">
            <h2 className="text-center text-sm">Validation Error:</h2>

            <div className="flex flex-col space-y-1">
                {filteredErrors.map((error) => (
                    <div className="flex items-center space-x-1">
                        <span className="border border-white rounded-full h-1 w-1 bg-white ">{" "}</span>
                        
                        <p className="text-xs font-light tex">{error}</p>
                    </div>

                ))}
            </div>

        </div>
    );
};

export default ErrorAlert;