import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-14 bg-black">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M10.5 9.5l4 2.5-4 2.5v-5z" fill="white"/></svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F7] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Create Account
          </h1>
          <p className="text-sm text-[#86868B]">Join the ultimate movie experience</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5" data-testid="register-error">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#86868B] mb-1.5 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="atv-input w-full h-12 rounded-xl px-4 text-sm"
              placeholder="Your name"
              required
              data-testid="register-name-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#86868B] mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="atv-input w-full h-12 rounded-xl px-4 text-sm"
              placeholder="your@email.com"
              required
              data-testid="register-email-input"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#86868B] mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="atv-input w-full h-12 rounded-xl px-4 pr-12 text-sm"
                placeholder="Create a password"
                required
                data-testid="register-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#48484A] hover:text-[#A1A1A6] transition-colors"
                data-testid="toggle-password-visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="atv-btn-primary w-full h-12 rounded-full text-sm font-semibold mt-2 disabled:opacity-50"
            data-testid="register-submit-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#86868B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0071E3] hover:underline font-medium" data-testid="login-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
