import { useState } from 'react';
import { searchBooks } from '../services/api';

export default function BookSearch({ onBookRead }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setSearched(true);
        setResults([]);

        try {
            const data = await searchBooks(query);
            if (data.success) {
                setResults(data.books || []);
            } else {
                setResults([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:neon-border transition-all duration-500 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <span className="text-3xl filter drop-shadow-md">🔍</span>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Explorar Catálogo</h2>
                </div>

                <form onSubmit={handleSearch} className="flex gap-4 relative z-10">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Busca tu próximo tomo de sabiduría..."
                        className="flex-1 px-6 py-4 rounded-2xl bg-black/40 border-2 border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-500 focus:ring-4 focus:ring-neon-500/20 active:scale-[0.99] transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-500 to-indigo-600 text-black font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        ⚠️ Error en la Matrix: {error}
                    </div>
                )}

                {!loading && searched && results.length === 0 && !error && (
                    <div className="mt-12 text-center text-gray-400/50 italic py-10 border-2 border-dashed border-white/10 rounded-3xl">
                        No se encontraron libros. Quizás el destino aún no los ha escrito.
                    </div>
                )}

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {results.map((book) => (
                        <div
                            key={book.id}
                            className="group/card flex flex-col rounded-[2rem] border-2 border-white/5 bg-white/5 hover:bg-white/10 hover:border-neon-500/30 hover:shadow-[0_0_40px_rgba(0,242,255,0.1)] transition-all duration-500 p-6"
                        >
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-black text-white leading-tight group-hover/card:magic-text transition-colors">
                                            {book.title}
                                        </h3>
                                        {book.category && (
                                            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-wider">
                                                {book.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="rpg-label text-[10px] mt-2 opacity-60 group-hover/card:opacity-100 transition-opacity">
                                        {book.author}
                                    </div>
                                    {(book.description || book.summary) && (
                                        <p className="text-[11px] text-gray-400 mt-3 line-clamp-3 leading-relaxed opacity-80 group-hover/card:opacity-100 border-l-2 border-white/10 pl-3">
                                            {book.description || book.summary}
                                        </p>
                                    )}
                                </div>
                                {book.source === 'bibliometro' && (
                                    <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded">
                                        BIBLIOMETRO
                                    </div>
                                )}
                            </div>

                            {book.imageUrl && (
                                <div className="mt-2 h-48 w-full bg-black/40 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-4 relative group-hover/card:border-neon-500/20 transition-all">
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className="h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover/card:scale-110 group-hover/card:rotate-2 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                </div>
                            )}

                            {/* Disponibilidad (Bibliometro) */}
                            {book.locations && book.locations.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <p className="rpg-label text-[9px] opacity-70">Santuarios Custodios:</p>
                                    <div className="space-y-2">
                                        {book.locations.map((loc, idx) => {
                                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.branch)}`;
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl glass border border-white/5 hover:border-neon-500/20 transition-all group/loc">
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-white uppercase tracking-tight">{loc.branch}</div>
                                                        <div className="text-[8px] text-neon-500/80 font-bold uppercase">{loc.stock}</div>
                                                    </div>
                                                    <a
                                                        href={mapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="h-8 w-8 flex items-center justify-center rounded-lg glass border border-white/10 text-sm hover:bg-neon-500 hover:text-black transition-all shadow-lg"
                                                        title="Localizar Santuario"
                                                    >
                                                        🗺️
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-8 flex items-center justify-between">
                                <span className="font-mono text-[10px] text-gray-500 uppercase">
                                    {book.pages ? `${book.pages} páginas de saber` : 'Volumen desconocido'}
                                </span>
                                {onBookRead && (
                                    <button
                                        onClick={() => onBookRead(book)}
                                        className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                    >
                                        Consumir Saber
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
