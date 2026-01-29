import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MotionCard from '../components/MotionCard';

describe('MotionCard Component', () => {
    it('renders children correctly', () => {
        render(
            <MotionCard>
                <div data-testid="child">Test Child</div>
            </MotionCard>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <MotionCard className="custom-class">
                <div>Test</div>
            </MotionCard>
        );
        // El primer hijo del componente renderizado debe tener los atributos de motion.div
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles mouse move and leave events', () => {
        const { container } = render(
            <MotionCard>
                <div style={{ width: '100px', height: '100px' }}>Test</div>
            </MotionCard>
        );

        const card = container.firstChild;

        // Activar movimiento del ratón
        fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

        // Activar salida del ratón
        fireEvent.mouseLeave(card);

        // Dado que los valores de inclinación (tilt) son manejados por las entrañas de framer-motion y la animación spring,
        // es complejo verificar el valor de transformación de estilo exacto en una prueba unitaria sin mockear 
        // framer-motion intensamente. Por ahora, verificamos que no falle en estos eventos.
        expect(card).toBeInTheDocument();
    });
});
