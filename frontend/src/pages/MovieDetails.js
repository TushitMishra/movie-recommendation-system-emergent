import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieApi, watchlistApi, ratingsApi } from '../api/movieApi';
import { useAuth } from '../contexts/AuthContext';
import { Play, Plus, Check, Star, Clock, Calendar } from 'lucide-react';
import MovieRow from '../components/MovieRow';
import { toast } from 'sonner';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    loadMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const res = await movieApi.getDetails(id);
      setMovie(res.data);
      if (user) {
        try {
          const wl = await watchlistApi.get();
          setInWatchlist(wl.data.watchlist.includes(parseInt(id)));
        } catch (e) { /* not logged in */ }
      }
      const reviewsRes = await ratingsApi.getForMovie(id);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error loading movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await watchlistApi.remove(id);
        setInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        await watchlistApi.add(id);
        setInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      toast.error('Sign in to manage watchlist');
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await ratingsApi.create({ movie_id: parseInt(id), rating, review });
      toast.success('Rating submitted');
      setRating(0);
      setReview('');
      loadMovieDetails();
    } catch (error) {
      toast.error('Sign in to rate movies');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-14">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (!movie) return null;
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer');

  return (
    <div className="min-h-screen bg-black pt-14" data-testid="movie-details-page">
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="atv-hero-gradient absolute inset-0" />

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-14 pb-10 z-10">
          <div className="flex gap-8 items-end max-w-6xl">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-[140px] md:w-[180px] rounded-xl shadow-2xl hidden md:block"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {movie.genres?.slice(0, 3).map(g => (
                  <span key={g.id} className="atv-tag text-xs px-3 py-1 rounded-full">{g.name}</span>
                ))}
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-3"
                style={{ fontFamily: 'Inter, sans-serif' }}
                data-testid="movie-title"
              >
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-[#86868B] mb-6 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#FFD60A] fill-current" />
                  <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  {movie.release_date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                  {movie.runtime} min
                </span>
              </div>

              <div className="flex items-center gap-3">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="atv-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm"
                    data-testid="watch-trailer-button"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Trailer
                  </a>
                )}
                {user && (
                  <button
                    onClick={toggleWatchlist}
                    className="atv-btn-secondary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm border border-white/[0.08]"
                    data-testid="watchlist-toggle-button"
                  >
                    {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {inWatchlist ? 'In Watchlist' : 'Watchlist'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-14 py-10 space-y-10">
        {/* Overview */}
        <div className="max-w-3xl">
          <h2 className="text-lg font-bold text-[#F5F5F7] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>About</h2>
          <p className="text-base leading-[1.7] text-[#A1A1A6]">{movie.overview}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Release', value: movie.release_date },
            { label: 'Runtime', value: `${movie.runtime} min` },
            { label: 'Budget', value: movie.budget ? `$${(movie.budget / 1000000).toFixed(0)}M` : 'N/A' },
            { label: 'Revenue', value: movie.revenue ? `$${(movie.revenue / 1000000).toFixed(0)}M` : 'N/A' },
          ].map(item => (
            <div key={item.label} className="bg-[#1D1D1F] rounded-xl p-4">
              <p className="text-xs text-[#86868B] mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-[#F5F5F7]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F7] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Cast & Crew</h2>
            <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
              {movie.credits.cast.slice(0, 12).map(person => (
                <div key={person.id} className="flex-shrink-0 text-center w-20">
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 bg-[#1D1D1F]">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#48484A] text-lg font-bold">
                        {person.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#F5F5F7] line-clamp-1">{person.name}</p>
                  <p className="text-[10px] text-[#86868B] line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rate */}
        {user && (
          <div className="bg-[#1D1D1F] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#F5F5F7] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Rate This</h2>
            <form onSubmit={submitRating} className="space-y-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5,6,7,8,9,10].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                    data-testid={`star-${star}`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating || rating) ? 'text-[#FFD60A] fill-current' : 'text-[#48484A]'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-semibold text-[#F5F5F7]">{rating > 0 ? `${rating}/10` : ''}</span>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="atv-input w-full rounded-xl px-4 py-3 text-sm min-h-[80px] resize-none"
                placeholder="Share your thoughts... (optional)"
                data-testid="review-input"
              />
              <button
                type="submit"
                disabled={rating === 0}
                className="atv-btn-primary px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-30"
                data-testid="submit-rating-button"
              >
                Submit Rating
              </button>
            </form>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#F5F5F7] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Reviews</h2>
            <div className="space-y-3">
              {reviews.map((r, idx) => (
                <div key={idx} className="bg-[#1D1D1F] rounded-xl p-4" data-testid="review-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {r.user_name?.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#F5F5F7]">{r.user_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#FFD60A]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">{r.rating}</span>
                    </div>
                  </div>
                  {r.review && <p className="text-sm text-[#A1A1A6] leading-relaxed">{r.review}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar */}
      {movie.similar?.results?.length > 0 && (
        <div className="pb-10">
          <MovieRow title="Similar Movies" movies={movie.similar.results} />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
