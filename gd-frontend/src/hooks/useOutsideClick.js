import { useEffect, useRef } from "react";

export const useOutsideClick = (callback, event="click") => {
    const ref = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback(event);
            }
        };

        document.addEventListener(event, handleClick);

        return () => {
            document.removeEventListener(event, handleClick);
        };
        // eslint-disable-next-line
    }, [ref]);

    return (ref);
}