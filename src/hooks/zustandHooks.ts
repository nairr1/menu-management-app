import { useEffect, useState } from "react";

export function useGetFromStore<T, F>(
    store: (callback: (state: T) => unknown) => unknown,
    storeCallback: (state: T) => F,
) {
    const result = store(storeCallback) as F;
    const [state, setState] = useState<F>();

    useEffect(() => {
        setState(result);
    }, [result]);

    return state;
}