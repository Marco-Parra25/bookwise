import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WorldMap from '../components/WorldMap';

describe('WorldMap Component', () => {
    it('renders the correct biome based on progression', () => {
        // level = (booksRead + 1)
        // Level 1: Bosque Ancestral (starts at 1)
        render(<WorldMap level={1} xp={0} xpToNextLevel={100} booksRead={0} />);
        expect(screen.getByText(/Bosque Ancestral/i)).toBeInTheDocument();
    });

    it('changes biome as progression increases', () => {
        // booksRead = 6 -> Level 7: Ruinas Olvidadas (starts at 6)
        render(<WorldMap level={5} xp={0} xpToNextLevel={500} booksRead={6} />);
        expect(screen.getByText(/Ruinas Olvidadas/i)).toBeInTheDocument();
    });

    it('displays the current level and XP bar info', () => {
        render(<WorldMap level={10} xp={250} xpToNextLevel={1000} booksRead={9} />);
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('250/1000')).toBeInTheDocument();
    });

    it('renders the correct number of nodes for the current view', () => {
        // Should show 5 nodes per screen
        render(<WorldMap level={1} xp={0} xpToNextLevel={100} booksRead={0} />);
        // Each node has text content (level number)
        // We use getAllByText because the current level might appear in the HUD too
        expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('🏰')).toBeInTheDocument(); // Level 5 is a boss
    });
});
