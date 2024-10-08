import React from 'react';

type ControlsType = {
    play?: () => void;
    step?: () => void;
    stop?: () => void;
};

function ControlsDisplay({ controls }: { controls?: ControlsType }) {
    const onPlay = controls?.play;
    const onStep = controls?.step;
    const onStop = controls?.stop;

    return (
        <div className="absolute p-2 bottom-3 left-1/2 z-10 flex gap-3 -translate-x-1/2 bg-[var(--color-300)] border border-[var(--color-700)] rounded-md">
            <button
                className="w-6 h-6 p-1 bg-green-500 transition-all hover:bg-green-600 active:bg-green-700 rounded-md"
                onClick={() => {
                    if (onPlay) onPlay();
                }}
            >
                <img
                    src="/play.svg"
                    alt="play icon"
                    className="h-full w-full"
                />
            </button>
            <button
                className="w-6 h-6 p-1 bg-yellow-500 transition-all hover:bg-yellow-600 active:bg-yellow-700 rounded-md"
                onClick={() => {
                    if (onStep) onStep();
                }}
            >
                <img
                    src="/step.svg"
                    alt="step icon"
                    className="h-full w-full"
                />
            </button>
            <button
                className="w-6 h-6 p-1 bg-red-500 transition-all hover:bg-red-600 active:bg-red-700 rounded-md"
                onClick={() => {
                    if (onStop) onStop();
                }}
            >
                <img
                    src="/stop.svg"
                    alt="stop icon"
                    className="h-full w-full"
                />
            </button>
        </div>
    );
}

export default ControlsDisplay;
