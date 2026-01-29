import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AvatarDisplay from '../components/AvatarDisplay';
import '@testing-library/jest-dom';

describe('AvatarDisplay Component', () => {
    it('renders emoji avatar correctly', () => {
        render(<AvatarDisplay avatar="🧑‍🚀" />);
        expect(screen.getByText('🧑‍🚀')).toBeInTheDocument();
    });

    it('renders image avatar correctly', () => {
        render(<AvatarDisplay avatar="https://example.com/astronaut.png" />);
        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', 'https://example.com/astronaut.png');
    });

    it('renders equipped accessories', () => {
        const equipped = { hat: 'hat_wizard', glasses: 'glasses_vr', beard: 'mask_fox' };
        render(<AvatarDisplay avatar="🧑‍🚀" equipped={equipped} />);
        expect(screen.getByText('🎩')).toBeInTheDocument();
        expect(screen.getByText('🥽')).toBeInTheDocument();
        expect(screen.getByText('🦊')).toBeInTheDocument();
    });
});
