import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Store from '../components/Store';
import * as storage from '../utils/storage';

// Mock storage utilities
vi.mock('../utils/storage', () => ({
    purchaseItem: vi.fn(),
    equipItem: vi.fn(),
    loadCharacter: vi.fn(),
}));

describe('Store Component', () => {
    const mockOnUpdate = vi.fn();
    const mockCharacter = { name: 'TestHero', avatar: '🧙', coins: 1000 };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(storage.loadCharacter).mockReturnValue(mockCharacter);
    });

    it('renders current coins and items', () => {
        render(<Store currentCoins={1000} onUpdateProfile={mockOnUpdate} />);
        expect(screen.getByText('1000')).toBeInTheDocument();
        expect(screen.getByText(/Sombrero Arcano/i)).toBeInTheDocument();
    });

    it('filters items by category', () => {
        render(<Store currentCoins={1000} onUpdateProfile={mockOnUpdate} />);

        // Click on "hats" filter
        fireEvent.click(screen.getByLabelText(/Filtrar por hat/i));

        // Hat should be visible
        expect(screen.getByText(/Sombrero Arcano/i)).toBeInTheDocument();
        // Glasses should NOT be visible (or at least filtered out)
        expect(screen.queryByText(/Gafas Intelectuales/i)).not.toBeInTheDocument();
    });

    it('handles successful purchase', () => {
        vi.mocked(storage.purchaseItem).mockReturnValue({ success: true, message: '¡Compra exitosa!' });

        render(<Store currentCoins={1000} onUpdateProfile={mockOnUpdate} inventory={[]} />);

        // Find a buy button (overlay matches on hover in real life, but we can target by text)
        const buyBtn = screen.getAllByRole('button', { name: /comprar/i })[0];
        fireEvent.click(buyBtn);

        expect(storage.purchaseItem).toHaveBeenCalled();
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(screen.getByText(/¡Compra exitosa!/i)).toBeInTheDocument();
    });

    it('prevents purchase if not enough coins', () => {
        render(<Store currentCoins={10} onUpdateProfile={mockOnUpdate} inventory={[]} />);

        const buyBtn = screen.getAllByRole('button', { name: /faltan monedas/i })[0];
        expect(buyBtn).toBeDisabled();
    });

    it('equips owned item on click', () => {
        const inventory = ['hat_wizard'];
        render(<Store currentCoins={1000} onUpdateProfile={mockOnUpdate} inventory={inventory} equipped={{}} />);

        const item = screen.getByText(/Sombrero Arcano/i).closest('div');
        fireEvent.click(item);

        expect(storage.equipItem).toHaveBeenCalledWith('hat', 'hat_wizard');
        expect(mockOnUpdate).toHaveBeenCalled();
    });
});
