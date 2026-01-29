import { useEffect, useState } from 'react';

/**
 * DynamicAtmosphere maneja la estética ambiental global basada en la hora local.
 * Vesper (Amanecer): 5am - 8am
 * Zenith (Día): 8am - 6pm
 * Twilight (Atardecer): 6pm - 9pm
 * Nadir (Noche): 9pm - 5am
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
        const interval = setInterval(updateAtmosphere, 60000); // Verificar cada minuto
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Aplicar clase de atmósfera al body para variables globales
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
