import React, { useEffect, useState } from 'react';
import { validate } from '../utils/regex';

function InputRegex({ set }: { set: (v: string) => void }) {
    const [regex, setRegex] = useState('');
    const [valid, setValid] = useState(-1);
    const [message, setMessage] = useState('');

    const send = () => {
        setValid(validate(regex) ? 1 : 0);
        set(regex);
    };

    useEffect(() => {
        if (valid === -1) return;

        if (valid) {
            setMessage('Valid!');
        } else {
            setMessage('No Valid!');
        }

        const timer = setTimeout(() => {
            setMessage('');
            setValid(-1);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [valid]);

    return (
        <div className="flex justify-center items-center flex-col">
            <div className="flex justify-center py-4 gap-2">
                <input
                    className="p-1 border border-black focus:outline-none rounded-lg"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                />
                <button onClick={() => send()}>Send</button>
            </div>
            <h3 className="text-white h-4">{message}</h3>
        </div>
    );
}

export default InputRegex;
