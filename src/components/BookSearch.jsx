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
        <div className="space-y-6">
            <div className="rounded-2xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 transition-colors">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Explorar Catálogo</h2>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por título, autor..."
                        className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {!loading && searched && results.length === 0 && !error && (
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        No se encontraron libros con esa búsqueda.
                    </div>
                )}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((book) => (
                        <div
                            key={book.id}
                            className="flex flex-col rounded-xl border dark:border-gray-700 p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {book.author}
                                    </p>
                                </div>
                                {book.source === 'bibliometro' && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                                        Bibliometro
                                    </span>
                                )}
                            </div>

                            {book.imageUrl && (
                                <div className="mt-3 h-32 w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img src={book.imageUrl} alt={book.title} className="h-full object-contain" />
                                </div>
                            )}

                            <div className="mt-auto pt-4 flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {book.pages ? `${book.pages} pág.` : ''}
                                </span>
                                {onBookRead && (
                                    <button
                                        onClick={() => onBookRead(book)}
                                        className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                                    >
                                        Marcar leído
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
