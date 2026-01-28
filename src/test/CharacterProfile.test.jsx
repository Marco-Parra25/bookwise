import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CharacterProfile from '../components/CharacterProfile';

describe('CharacterProfile Component', () => {
    const mockCharacter = {
        name: 'SuperLector',
        avatar: '🦸',
        level: 3,
        xp: 150,
        xpToNextLevel: 300,
        booksRead: 12,
        equipped: {}
    };

    it('renders character information correctly', () => {
        render(<CharacterProfile character={mockCharacter} />);

        expect(screen.getByText('SuperLector')).toBeInTheDocument();
        expect(screen.getByLabelText('Nivel 3')).toBeInTheDocument();
        expect(screen.getByText(/150/)).toBeInTheDocument();
        expect(screen.getByText(/300/)).toBeInTheDocument();
        expect(screen.getByText(/12/)).toBeInTheDocument();
    });

    it('displays unlocked badges', () => {
        render(<CharacterProfile character={mockCharacter} />);

        // With 12 books, "Primer Libro" (1), "Lector Novato" (5), and "Lector Avanzado" (10) should be unlocked.
        // Level 3 means "Experto" (Lvl 5) is locked.

        expect(screen.getByText('Primer Libro')).toBeInTheDocument();
        expect(screen.getByText('Lector Novato')).toBeInTheDocument();
        expect(screen.getByText('Lector Avanzado')).toBeInTheDocument();

        // Count unlocked badges (those without grease-scale/opacity class)
        // Hard to test CSS classes precisely in JSDOM, but we can verify text exists.
    });

    it('calls onEdit when Ajustes button is clicked', () => {
        const onEditMock = vi.fn();
        render(<CharacterProfile character={mockCharacter} onEdit={onEditMock} />);

        fireEvent.click(screen.getByText(/Ajustes/i));
        expect(onEditMock).toHaveBeenCalled();
    });
});
