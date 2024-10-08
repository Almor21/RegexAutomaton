import React, { useState } from 'react';

type ControlsType = {
    play?: () => void;
    step?: () => void;
    stop?: () => void;
};

function ControlsDisplay({
    controls,
    onChangeTime
}: {
    controls?: ControlsType;
    onChangeTime: (n: number) => void;
}) {
    const [time, setTime] = useState(100);
    const onPlay = controls?.play;
    const onStep = controls?.step;
    const onStop = controls?.stop;

    return (
        <div className="absolute p-2 bottom-3 left-1/2 z-10 flex flex-col gap-2 items-center -translate-x-1/2 bg-[var(--color-300)] border border-[var(--color-700)] rounded-md">
            <div className="flex gap-3">
                <button
                    className="w-6 h-6 p-[0.35rem] bg-green-500 transition-all hover:bg-green-600 active:bg-green-700 rounded-md"
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
                    className="w-6 h-6 p-[0.35rem] bg-yellow-500 transition-all hover:bg-yellow-600 active:bg-yellow-700 rounded-md"
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
                    className="w-6 h-6 p-[0.35rem] bg-red-500 transition-all hover:bg-red-600 active:bg-red-700 rounded-md"
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
            <input
                type="number"
                className="w-24 h-7 px-2 rounded-md text-sm focus:outline-none"
                value={time}
                onChange={(e) => {
                    setTime(parseInt(e.target.value));
                    onChangeTime(parseInt(e.target.value));
                }}
            />
        </div>
    );
}

export default ControlsDisplay;
