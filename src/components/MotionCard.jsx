import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * MotionCard añade un efecto de inclinación 3D de alta gama y animaciones de framer-motion
 * a cualquier elemento hijo.
 */
export default function MotionCard({ children, className = "", delay = 0 }) {
    const cardRef = useRef(null);

    // Valores de movimiento para la posición del ratón
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Física de resorte (spring) suave para la inclinación
    const springX = useSpring(x, { stiffness: 150, damping: 20 });
    const springY = useSpring(y, { stiffness: 150, damping: 20 });

    // Mapear la posición del ratón a grados de rotación
    const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (event) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Normalizar coordenadas a [-0.5, 0.5]
        const mouseX = (event.clientX - rect.left) / width - 0.5;
        const mouseY = (event.clientY - rect.top) / height - 0.5;

        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.16, 1, 0.3, 1]
            }}
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            className={`relative ${className}`}
        >
            <div style={{ transform: "translateZ(20px)" }} className="h-full">
                {children}
            </div>
        </motion.div>
    );
}
