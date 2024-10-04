import React from 'react';

function Controls() {
    return (
        <div className='absolute p-1 bottom-3 left-1/2 z-10 flex gap-3 -translate-x-1/2 bg-[var(--color-300)] border border-[var(--color-700)] rounded-sm'>
            <button className='w-6 h-6 bg-green-500 transition-all hover:bg-green-600 active:bg-green-700 rounded-md'></button>
            <button className='w-6 h-6 bg-yellow-500 transition-all hover:bg-yellow-600 active:bg-yellow-700 rounded-md'></button>
            <button className='w-6 h-6 bg-red-500 transition-all hover:bg-red-600 active:bg-red-700 rounded-md'></button>
        </div>
    );
}

export default Controls;
