"use client";

import * as motion from "motion/react-client";

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = i * 0.5;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.5 }, // Adjusted for text visibility
            },
        };
    },
};

export default function PathDrawing({ color }: { color: string }) {
    return (
        <motion.svg
            width="600"
            height="600"
            viewBox="0 0 100 100"
            initial="hidden"
            animate="visible"
            style={image}
        >
            {/* Heart Path */}
            <motion.path
                d="M1,21c0,20,31,38,31,38s31-18,31-38
	c0-8.285-6-16-15-16c-8.285,0-16,5.715-16,14c0-8.285-7.715-14-16-14C7,5,1,12.715,1,21z"
                stroke={color}
                variants={draw}
                custom={1}
                style={shape}
            />

        </motion.svg>
    );
}

/**
 * ==============   Styles   ================
 */

const image: React.CSSProperties = {
    maxWidth: "80vw",
    padding: "1rem",
};

const shape: React.CSSProperties = {
    strokeWidth: 2,
    strokeLinecap: "round",
    fill: "transparent",
};
