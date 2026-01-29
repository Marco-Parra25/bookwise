import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CharacterCreation from '../components/CharacterCreation';

describe('CharacterCreation Component', () => {
    const mockOnComplete = vi.fn();

    it('renders creation mode by default', () => {
        render(<CharacterCreation onComplete={mockOnComplete} />);
        expect(screen.getByText(/CREA TU LEYENDA/i)).toBeInTheDocument();
        expect(screen.getByText(/MANIFESTAR AVATAR/i)).toBeDisabled();
    });

    it('enables submit button when name is entered', () => {
        render(<CharacterCreation onComplete={mockOnComplete} />);
        const input = screen.getByLabelText(/Nombre de tu receptáculo/i);
        fireEvent.change(input, { target: { value: 'Aragorn' } });
        expect(screen.getByText(/MANIFESTAR AVATAR/i)).not.toBeDisabled();
    });

    it('shows error for short names', () => {
        render(<CharacterCreation onComplete={mockOnComplete} />);
        const input = screen.getByLabelText(/Nombre de tu receptáculo/i);
        fireEvent.change(input, { target: { value: 'A' } });
        // Click the button to trigger validation
        fireEvent.click(screen.getByText(/MANIFESTAR AVATAR/i));
        expect(screen.getByText(/El nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
    });

    it('selects an avatar correctly', () => {
        render(<CharacterCreation onComplete={mockOnComplete} />);
        const dragonBtn = screen.getByText(/Dragón/i).closest('button');
        fireEvent.click(dragonBtn);
        // Checking for visual feedback (border-neon-500 class)
        expect(dragonBtn).toHaveClass('border-neon-500');
    });

    it('submits correctly with name and avatar', () => {
        render(<CharacterCreation onComplete={mockOnComplete} />);
        fireEvent.change(screen.getByLabelText(/Nombre de tu receptáculo/i), { target: { value: 'Gandalf' } });
        fireEvent.click(screen.getByText(/Mago/i).closest('button'));
        fireEvent.click(screen.getByText(/MANIFESTAR AVATAR/i));

        expect(mockOnComplete).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Gandalf',
            avatar: '🧙',
            level: 1
        }));
    });

    it('renders edit mode when initialCharacter is provided', () => {
        const initial = { name: 'Legolas', avatar: '🦅', level: 5 };
        render(<CharacterCreation onComplete={mockOnComplete} initialCharacter={initial} />);
        expect(screen.getByText(/RECTIFICAR PERSONAJE/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Legolas')).toBeInTheDocument();
        expect(screen.getByText(/SINCRONIZAR NÚCLEO/i)).toBeInTheDocument();
    });
});
