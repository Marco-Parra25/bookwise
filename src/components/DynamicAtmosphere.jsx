import { useEffect, useState } from 'react';

/**
 * DynamicAtmosphere handles the global environmental aesthetic based on local time.
 * Vesper (Dawn): 5am - 8am
 * Zenith (Day): 8am - 6pm
 * Twilight (Sunset): 6pm - 9pm
 * Nadir (Night): 9pm - 5am
 */
export default function DynamicAtmosphere() {
    const [atmClass, setAtmClass] = useState('atm-nadir');

    useEffect(() => {
        const updateAtmosphere = () => {
            const hour = new Date().getHours();

            if (hour >= 5 && hour < 8) {
                setAtmClass('atm-vesper');
            } else if (hour >= 8 && hour < 18) {
                setAtmClass('atm-zenith');
            } else if (hour >= 18 && hour < 21) {
                setAtmClass('atm-twilight');
            } else {
                setAtmClass('atm-nadir');
            }
        };

        updateAtmosphere();
        const interval = setInterval(updateAtmosphere, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Apply atmosphere class to body for global variables
        const body = document.body;
        body.classList.remove('atm-vesper', 'atm-zenith', 'atm-twilight', 'atm-nadir');
        body.classList.add(atmClass);
    }, [atmClass]);

    return (
        <>
            <div className="scanlines" />
            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-50 bg-[radial-gradient(circle_at_50%_0%,var(--atm-accent)_0%,transparent_50%)]" />
        </>
    );
}
