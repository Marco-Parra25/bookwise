import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookSearch from '../components/BookSearch';
import * as api from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
    searchBooks: vi.fn(),
}));

describe('BookSearch Component', () => {
    it('renders search input and button', () => {
        render(<BookSearch />);
        expect(screen.getByPlaceholderText(/Busca tu próximo tomo de sabiduría/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
    });

    it('handles successful search results', async () => {
        const mockBooks = [
            { id: '1', title: 'Test Book', author: 'Test Author', category: 'Fiction', description: 'Test Desc' }
        ];

        vi.mocked(api.searchBooks).mockResolvedValue({ success: true, books: mockBooks });

        render(<BookSearch />);

        const input = screen.getByPlaceholderText(/Busca tu próximo tomo de sabiduría/i);
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

        expect(screen.getByText(/Buscando.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Book')).toBeInTheDocument();
            expect(screen.getByText('Test Author')).toBeInTheDocument();
        });
    });

    it('displays error message on search failure', async () => {
        vi.mocked(api.searchBooks).mockRejectedValue(new Error('API Down'));

        render(<BookSearch />);

        const input = screen.getByPlaceholderText(/Busca tu próximo tomo de sabiduría/i);
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

        await waitFor(() => {
            expect(screen.getByText(/⚠️ Error en la Matrix: API Down/i)).toBeInTheDocument();
        });
    });

    it('calls onBookRead when "Consumir Saber" button is clicked', async () => {
        const onBookReadMock = vi.fn();
        const mockBooks = [
            { id: '1', title: 'Test Book', author: 'Test Author' }
        ];

        vi.mocked(api.searchBooks).mockResolvedValue({ success: true, books: mockBooks });

        render(<BookSearch onBookRead={onBookReadMock} />);

        fireEvent.change(screen.getByPlaceholderText(/Busca tu próximo tomo de sabiduría/i), { target: { value: 'test' } });
        fireEvent.click(screen.getByRole('button', { name: /buscar/i }));

        const consumeBtn = await screen.findByText(/Consumir Saber/i);
        fireEvent.click(consumeBtn);

        expect(onBookReadMock).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Book' }));
    });
});
