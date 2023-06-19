export function formatPrice(price: string) {
    return (Math.round(Number(price) * 100) / 100).toFixed(2);
}