import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WorldMap from '../components/WorldMap';

describe('WorldMap Component', () => {
    it('renders the correct biome based on progression', () => {
        // nivel = (booksRead + 1)
        // Nivel 1: Bosque Ancestral (comienza en 1)
        render(<WorldMap level={1} xp={0} xpToNextLevel={100} booksRead={0} />);
        expect(screen.getByText(/Bosque Ancestral/i)).toBeInTheDocument();
    });

    it('changes biome as progression increases', () => {
        // booksRead = 6 -> Nivel 7: Ruinas Olvidadas (comienza en 6)
        render(<WorldMap level={5} xp={0} xpToNextLevel={500} booksRead={6} />);
        expect(screen.getByText(/Ruinas Olvidadas/i)).toBeInTheDocument();
    });

    it('displays the current level and XP bar info', () => {
        render(<WorldMap level={10} xp={250} xpToNextLevel={1000} booksRead={9} />);
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('250/1000')).toBeInTheDocument();
    });

    it('renders the correct number of nodes for the current view', () => {
        // Debería mostrar 5 nodos por pantalla
        render(<WorldMap level={1} xp={0} xpToNextLevel={100} booksRead={0} />);
        // Cada nodo tiene contenido de texto (número de nivel)
        // Usamos getAllByText porque el nivel actual también puede aparecer en el HUD
        expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('🦉')).toBeInTheDocument(); // Nivel 3: Búho Sabio
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('🏰')).toBeInTheDocument(); // El nivel 5 es un jefe (boss)
    });
});
