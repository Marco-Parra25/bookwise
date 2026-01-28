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
        // The first child of the rendered component should have the motion.div attributes
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles mouse move and leave events', () => {
        const { container } = render(
            <MotionCard>
                <div style={{ width: '100px', height: '100px' }}>Test</div>
            </MotionCard>
        );

        const card = container.firstChild;

        // Trigger mouse move
        fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

        // Trigger mouse leave
        fireEvent.mouseLeave(card);

        // Since tilt values are handled by framer-motion internals and spring animation,
        // it's complex to verify the exact style transform value in a unit test without mocking 
        // framer-motion heavily. For now, we verify it doesn't crash on these events.
        expect(card).toBeInTheDocument();
    });
});
