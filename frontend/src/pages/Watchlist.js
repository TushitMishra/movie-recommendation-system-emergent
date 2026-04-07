import { useState, useEffect } from 'react';
import { watchlistApi, movieApi } from '../api/movieApi';
import { Link } from 'react-router-dom';
import { Star, X, Bookmark } from 'lucide-react';
import { toast } from 'sonner';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWatchlist(); }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const res = await watchlistApi.get();
      const ids = res.data.watchlist || [];
      if (ids.length > 0) {
        const results = await Promise.all(ids.map(id => movieApi.getDetails(id)));
        setMovies(results.map(r => r.data));
      } else {
        setMovies([]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const removeMovie = async (movieId) => {
    try {
      await watchlistApi.remove(movieId);
      setMovies(prev => prev.filter(m => m.id !== movieId));
      toast.success('Removed from watchlist');
    } catch (e) { toast.error('Failed to remove'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-14">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-14" data-testid="watchlist-page">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-14 py-10">
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F7] mb-8"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Watchlist
        </h1>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24" data-testid="empty-watchlist">
            <Bookmark className="w-16 h-16 text-[#48484A] mb-4" strokeWidth={1} />
            <h2 className="text-xl font-semibold text-[#F5F5F7] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your watchlist is empty
            </h2>
            <p className="text-sm text-[#86868B] mb-6">Movies you save will appear here</p>
            <Link
              to="/search"
              className="atv-btn-primary inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {movies.map(movie => (
              <div key={movie.id} className="relative group" data-testid={`watchlist-item-${movie.id}`}>
                <Link to={`/movie/${movie.id}`} className="atv-card block rounded-lg overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex items-center gap-1 text-[#FFD60A]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold">{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-0.5">
                    <h3 className="text-[13px] font-medium text-[#F5F5F7] line-clamp-1">{movie.title}</h3>
                    <p className="text-[11px] text-[#86868B]">{movie.release_date?.split('-')[0]}</p>
                  </div>
                </Link>

                <button
                  onClick={(e) => { e.preventDefault(); removeMovie(movie.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all"
                  data-testid={`remove-watchlist-${movie.id}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
