import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgVideo from '../../assets/bgvideo.mp4';
import logoImg from "../../assets/logolp.png";

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      navigate('/login');
      return;
    }
    setToken(t);
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('error');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    
    setStatus('loading');
    
    try {
      const res = await fetch('http://localhost:3000/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      if (!res.ok) throw new Error('Reset failed');
      
      setStatus('done');
      setShowSuccess(true);
      
      setTimeout(() => {
        // Close the current tab/window
        window.close();
        // Fallback in case window.close() is blocked by the browser
        window.location.href = '/login';
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2"
          style={{
            filter: 'brightness(1) contrast(1.1) saturate(1.1)'
          }}
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <img src={logoImg} alt="Logo" className="absolute top-4 left-4 w-36 md:w-44 h-auto" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative w-full text-black max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-3 text-white z-10">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black">Reset Password</h2>
              <p className="text-white font-semibold mt-2">Enter your new password below</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-md font-semibold text-black mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-4 pr-3 py-2 mb-3 rounded-full border font-semibold text-md border-black/60 bg-white/5 text-black placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  placeholder="Enter new password"
                  disabled={status === 'loading' || status === 'done'}
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-md font-semibold text-black mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="block w-full pl-4 pr-3 py-2 mb-3 rounded-full border font-semibold text-md border-black/60 bg-white/5 text-black placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  placeholder="Confirm new password"
                  disabled={status === 'loading' || status === 'done'}
                />
              </div>

              {/* Error message is now shown as a toast notification */}

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'done'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'loading' ? 'Updating...' : status === 'done' ? 'Password Updated!' : 'Update Password'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-md font-semibold text-black font-bold hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Password updated successfully! Redirecting to login...</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{password !== confirm ? 'Passwords do not match' : 'Failed to reset password. The link may be invalid or expired.'}</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
