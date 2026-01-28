import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfileForm from '../components/ProfileForm';

describe('ProfileForm Component', () => {
    const mockOnSubmit = vi.fn();

    it('renders the first step correctly', () => {
        render(<ProfileForm onSubmitProfile={mockOnSubmit} />);
        expect(screen.getByText(/¿Qué tipo de historias te gustan?/i)).toBeInTheDocument();
        expect(screen.getByText(/Acción y Explosiones/i)).toBeInTheDocument();
    });

    it('moves to the next step when an option is selected', () => {
        render(<ProfileForm onSubmitProfile={mockOnSubmit} />);
        const option = screen.getByText(/Acción y Explosiones/i);
        fireEvent.click(option);

        // Should move to step 2
        expect(screen.getByText(/¿Qué te apasiona en el mundo real?/i)).toBeInTheDocument();
    });

    it('shows age validation error for invalid age', () => {
        render(<ProfileForm onSubmitProfile={mockOnSubmit} />);

        // Navigate to the final step (3 steps + selection each)
        fireEvent.click(screen.getByText(/Acción y Explosiones/i));
        fireEvent.click(screen.getByText(/Videojuegos y Tecnología/i));
        fireEvent.click(screen.getByText(/Relajado y en Calma/i));

        // Now on final step
        expect(screen.getByText(/¡Invocación Final!/i)).toBeInTheDocument();

        const ageInput = screen.getByLabelText(/Tu edad/i);

        // Test negative age
        fireEvent.change(ageInput, { target: { value: '-5' } });
        expect(screen.getByText(/⚠️ La edad debe estar entre 4 y 110 años/i)).toBeInTheDocument();
        expect(screen.getByText(/🔮 Ver Destino/i)).toBeDisabled();

        // Test age under 4
        fireEvent.change(ageInput, { target: { value: '2' } });
        expect(screen.getByText(/⚠️ La edad debe estar entre 4 y 110 años/i)).toBeInTheDocument();

        // Test valid age
        fireEvent.change(ageInput, { target: { value: '25' } });
        expect(screen.queryByText(/⚠️ La edad debe estar entre 4 y 110 años/i)).not.toBeInTheDocument();
        expect(screen.getByText(/🔮 Ver Destino/i)).not.toBeDisabled();
    });

    it('submits the form with correct data', () => {
        render(<ProfileForm onSubmitProfile={mockOnSubmit} />);

        fireEvent.click(screen.getByText(/Acción y Explosiones/i));
        fireEvent.click(screen.getByText(/Videojuegos y Tecnología/i));
        fireEvent.click(screen.getByText(/Relajado y en Calma/i));

        const ageInput = screen.getByLabelText(/Tu edad/i);
        fireEvent.change(ageInput, { target: { value: '30' } });

        const submitBtn = screen.getByText(/🔮 Ver Destino/i);
        fireEvent.click(submitBtn);

        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
            age: 30,
            tags: expect.arrayContaining(['aventura', 'tecnología', 'bienestar'])
        }));
    });
});
