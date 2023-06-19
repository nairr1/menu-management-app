import React, { useState } from "react";
import { api } from "~/utils/api";

const order = () => {
    const { data: menuData } = api.menu.getMenuData.useQuery();

    const [menuCategoryRef, setMenuCategoryRef] = useState("");

    let menuCategories = [""];

    menuData?.map(({ menuCategoriesMenuMapping }) => {
        menuCategoriesMenuMapping.map(({ menuCategory }) => {
            return menuCategories.push(menuCategory.menuCategoryDisplayName);
        });
    });

    function scrollIntoView(menuCategory: string) {
        setMenuCategoryRef(menuCategory);
        document.getElementById(menuCategory)?.scrollIntoView({behavior: "smooth"});
    }

    return (
        <div 
            style={{
                backgroundColor: "white",
            }}
        >   
            <div 
                className="dark:bg-white dark:text-black flex flex-col justify-center items-center space-y-3 pt-4 pb-2"
                onMouseOver={(() => setMenuCategoryRef(""))}
            >
                <img 
                    src="https://cdn.dribbble.com/users/526755/screenshots/7145485/media/43bd4b6d124845da125155cf00818ed8.gif" 
                    alt="" 
                    className="rounded-full h-20 w-20 object-cover"
                />

                <h1 className="font-light text-sm italic">Rucku's Fire Burgers</h1>
            </div>

            <nav 
                className="sticky top-0 z-50 border-b dark:bg-white dark:text-black flex items-center justify-center space-x-8 p-4"
                style={{
                    backgroundColor: "white",
                }}
            >
                {menuData?.map(({ menuCategoriesMenuMapping }) => (
                    <>
                        {menuCategoriesMenuMapping.map(({ menuCategory }) => (
                            <button 
                                key={menuCategory.id}
                                className="text-sm text-neutral-700"
                                onClick={(() => scrollIntoView(menuCategory.menuCategoryName))}
                                style={{
                                    color: menuCategoryRef === menuCategory.menuCategoryName ? "red" : ""
                                }}
                            >
                                {menuCategory.menuCategoryDisplayName}
                            </button>
                        ))}
                    </>
                ))}

                {/* Loading state for navbar menu categories */}
                {!menuData && (
                    <div className="w-72 h-5 rounded-lg bg-neutral-200/50 animate-pulse" />
                )}

            </nav>

            <div onMouseOver={(() => setMenuCategoryRef(""))}>
                <img 
                    src="https://media.tenor.com/eTH4kihthlcAAAAd/eating-my-hero-academia.gif" 
                    alt=""
                    className="p-4 h-[80vh] w-full object-cover" 
                />
            </div>

            <div className="dark:bg-white dark:text-black flex flex-col px-4 pb-10">
                {menuData?.map(({ id, menuCategoriesMenuMapping, priceLevel }) => (
                    <div key={id}>
                        {menuCategoriesMenuMapping.map(({ menuCategory }) => (
                            <div 
                                key={menuCategory.id}
                                id={menuCategory.menuCategoryName}
                                className="flex flex-col space-y-6 pt-16" 
                                onMouseOver={(() => setMenuCategoryRef(menuCategory.menuCategoryName))}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="text-[2rem] font-medium">{menuCategory.menuCategoryDisplayName}</h1>

                                    <p className="text-sm font-light text-center w-1/2">{menuCategory.description}</p>

                                </div>

                                <div className="grid grid-cols-4">
                                    {menuCategory.menuCategoryItems.map(({ item }) => (
                                        <div 
                                            key={item.id}
                                            className=" border-[0.5px]"
                                            
                                        >
                                            <img 
                                                src={item.image} 
                                                alt=""
                                                className="w-full h-[15rem] object-cover" 
                                            />

                                            <div className="flex flex-col space-y-2 px-4 py-6">
                                                <h2>{item.itemDisplayName}</h2>

                                                <p className="text-xs font-light italic">{item.description}</p>

                                                <div className="flex space-x-2">
                                                    <p className="text-xs">
                                                        {priceLevel === 1 && `$${item.priceLevelOne}`}
                                                        {priceLevel === 2 && `$${item.priceLevelTwo}`}
                                                        {priceLevel === 3 && `$${item.priceLevelThree}`}
                                                    </p>

                                                    <p className="text-xs font-light">{item.energy}<span className="italic">kj</span></p>
                                                </div>
                                                
                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </div>
                        ))}
                    </div>
                ))}

                {/* Loading state for menu items */}
                {!menuData && (
                    <div className="flex flex-col space-y-6 mt-20">
                        <div className="flex flex-col items-center justify-cente space-y-2">
                            <div className="w-56 h-5 rounded-lg bg-neutral-200/50 animate-pulse" />

                            <div className="h-3 w-72 rounded-lg bg-neutral-200/50 animate-pulse" />
                        </div>

                        <div className="grid grid-cols-4">
                            {Array.from(Array(8), (_, index) => (
                                <div 
                                    key={index}
                                    className="space-y-5 rounded-2xl bg-white/5 p-4 animate-pulse"
                                >
                                    <div className="w-full h-[15rem] rounded-lg bg-neutral-200/70"></div>

                                    <div className="space-y-3">
                                        <div className="h-3 w-3/5 rounded-lg bg-neutral-200/50" />

                                        <div className="h-3 w-4/5 rounded-lg bg-neutral-200/50" />

                                        <div className="h-3 w-2/5 rounded-lg bg-neutral-200/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
};

export default order;