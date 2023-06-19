import React, { useState } from "react";

import { useAtom } from "jotai";
import { searchLocationsAtom } from "~/store/store";

import InputSearchDropdown from "../inputs/InputSearchDropdown";

const LocationMapping = ({ headerTitle, paragraphTitle }: { headerTitle: string; paragraphTitle: string; }) => {
    const [locationDropdown, setLocationDropdown] = useState(false);
    const [searchLocations, setSearchLocations] = useAtom(searchLocationsAtom);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col justify-center items-center mb-4">
                <h2 className="text-center">Locations</h2>

                <p className="text-xs font-light">Map {headerTitle} to specific locations.</p>
            </div>

            <div>
                <p className="p-1 font-light text-xs">Add locations the {paragraphTitle} will apply to, if no locations are selected, the category will apply to all.</p>

                <InputSearchDropdown 
                    labelName="Search Locations"
                    inputValue={searchLocations}
                    setInputValue={setSearchLocations}
                    toggleDropdown={locationDropdown}
                    setToggleDropdown={setLocationDropdown}
                />
            </div>
            
        </div> 
    );
};

export default LocationMapping;