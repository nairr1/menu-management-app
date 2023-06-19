export function formatPriceLevelForServer(priceLevel: string) {
    let formattedPriceLevel = 0;
    switch(priceLevel) {
        case("1"):
            formattedPriceLevel = 1;
            break;
        case("2"):
            formattedPriceLevel = 2;
            break;
        case("3"):
            formattedPriceLevel = 3;
            break;
    }

    return formattedPriceLevel;

}