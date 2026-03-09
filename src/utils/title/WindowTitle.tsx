import { useEffect } from 'react';

const titles: string[] = [];
const setTitle = () => (document.title = [...titles, 'THW-Tool'].join(' - '));

/**
 * Adds a window title (`document.title`) as long as the component is mounted.
 *
 * @example
 * ```tsx
 * // sets the window title to "Inventar - THW-Tool"
 * <WindowTitle>Planung</WindowTitle>
 *
 * // sets the window title to "Suche - Inventar - THW-Tool"
 * <WindowTitle>Planung</WindowTitle>
 * <div>
 *   <WindowTitle>Suche</WindowTitle>
 * </div>
 * ```
 */
export const WindowTitle = (props: { children: string | string[] }) => {
    useEffect(() => {
        const text = typeof props.children === 'string' ? props.children : props.children.join('');
        titles.unshift(text);
        setTitle();
        return () => {
            titles.shift();
            setTitle();
        };
    }, [props.children]);
    return <></>;
};
