import { useState, useEffect } from 'react';
import { movieApi } from '../api/movieApi';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Star, X } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => { loadGenres(); }, []);

  const loadGenres = async () => {
    try {
      const res = await movieApi.getGenres();
      setGenres(res.data.genres || []);
    } catch (e) { console.error(e); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await movieApi.search(query);
      setResults(res.data.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDiscover = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (selectedGenre) params.genre = selectedGenre;
      if (year) params.year = parseInt(year);
      const res = await movieApi.discover(params);
      setResults(res.data.results || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const clearAll = () => {
    setSelectedGenre(''); setYear(''); setQuery(''); setResults([]); setSearched(false);
  };

  return (
    <div className="min-h-screen bg-black pt-14" data-testid="search-page">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-14 py-10">
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F7] mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Discover
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#48484A]" strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Movies, actors, directors..."
              className="atv-input w-full h-12 rounded-xl pl-12 pr-4 text-sm"
              data-testid="search-input"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="atv-input h-10 rounded-lg px-3 text-sm min-w-[140px]"
            data-testid="genre-filter"
          >
            <option value="">All Genres</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="atv-input h-10 rounded-lg px-3 text-sm w-24"
            data-testid="year-filter"
          />

          <button
            onClick={handleDiscover}
            className="atv-btn-primary h-10 rounded-full px-6 text-sm font-semibold"
            data-testid="apply-filters-button"
          >
            Discover
          </button>

          {searched && (
            <button
              onClick={clearAll}
              className="h-10 px-3 text-[#86868B] hover:text-[#F5F5F7] transition-colors flex items-center gap-1 text-sm"
              data-testid="clear-filters-button"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-sm text-[#86868B] mb-5">{results.length} results</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {results.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="atv-card rounded-lg overflow-hidden"
                  data-testid={`search-result-${movie.id}`}
                >
                  <div className="aspect-[2/3] relative bg-[#1D1D1F] rounded-lg overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#48484A] text-xs">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex items-center gap-1 text-[#FFD60A]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold">{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-0.5">
                    <h3 className="text-[13px] font-medium text-[#F5F5F7] line-clamp-1">{movie.title}</h3>
                    <p className="text-[11px] text-[#86868B]">{movie.release_date?.split('-')[0] || 'N/A'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : searched ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[#86868B] text-sm">No results found. Try different keywords.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchIcon className="w-12 h-12 text-[#48484A] mb-4" strokeWidth={1} />
            <p className="text-[#86868B] text-sm">Search for movies or use filters to discover</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
