//src/components/custom-cursor.tsx
// Import necessary React hooks and components
import React, { useEffect, useRef, useState } from 'react';
// Define cursor colors
const CURSOR_COLORS: { [key: string]: string } = {
    "h1": "green-400",
    "button": "orange-500",
    "default": "red"
};
// Main CustomCursor component
const CustomCursor = () => {
    // Reference to the cursor element
    const cursorRef = useRef(null);
    // State to track cursor position
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // State to track cursor color
    const [cursorColor, setCursorColor] = useState("red");
    // State to track click event
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        // Event listener for mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: e.clientX,
                y: e.clientY
            });
        };
        // Event listener for mouse click
        const handleMouseDown = () => {
            setClicked(true);
            // Reset click state after 800 milliseconds
            setTimeout(() => {
                setClicked(false);
            }, 200);
        };
        // Event listener for mouseover (hover) on HTML elements
        const handleMouseOver = (e: Event) => {
            // Get the HTML tag name
            const target = e.target as HTMLElement;
            if (target) {
                const tagName = target.tagName.toLowerCase();
                setCursorColor(CURSOR_COLORS[tagName as keyof typeof CURSOR_COLORS] || CURSOR_COLORS["default"]);
                // Set cursor color based on the tag, default to "sky-500"
                setCursorColor(CURSOR_COLORS[tagName] || CURSOR_COLORS["default"]);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseover", handleMouseOver);
        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []); // useEffect runs only once on mount

    return (
        <>
            <div
                style={{
                    top: position.y - 2, // Adjust for center alignment
                    left: position.x - 4, // Adjust for center alignment
                }}
                ref={cursorRef}
                className={`fixed pointer-events-none transition-all -translate-x-1/2 -translate-y-1/2 z-50 ease-in duration-350 w-16 h-16`}
            >
                <div
                    className={`w-full h-full relative transform ${clicked ? "scale-110 opacity-50" : "scale-100 opacity-100"} transition-all duration-300 ease-in-out`}
                    style={{
                        position: "relative",
                        width: "50%",
                        height: "50%",
                        backgroundColor: cursorColor,
                        clipPath: `polygon(27% 8%, 48% 20%, 71% 8%, 100% 28%, 100% 50%, 49% 100%, 0 50%, 0 28%)`,
                    }}
                />
            </div>
        </>
    );
};

export default CustomCursor;