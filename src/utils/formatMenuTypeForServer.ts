export function formatMenuTypeforServer(menuType: string) {
    let formattedMenuType = 0;
    switch(menuType) {
        case("POS"):
            formattedMenuType = 1;
            break;
        case("Web Ordering"):
            formattedMenuType = 2;
            break;
    }

    return formattedMenuType;
}