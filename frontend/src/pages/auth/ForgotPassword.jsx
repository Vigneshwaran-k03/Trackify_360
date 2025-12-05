import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import bgVideo from '../../assets/bgvideo.mp4';
import logoImg from "../../assets/logolp.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('http://localhost:3000/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error('Failed to send reset email');
      
      setStatus('sent');
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
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
        <img src={logoImg} alt="Logo" className="absolute top-4 left-4 w-36  md:w-44 h-auto" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        
        <div className=" relative w-full text-black max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-3 text-white z-10">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black">Forgot Password</h2>
              <p className="text-White font-semibold mt-2">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-md font-semibold text-black mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" block w-full  flex items-center  pl-4 pr-3 py-2 mb-3 rounded-full border font-semibold text-md  border-black/60 bg-white/5 text-black placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                    placeholder="you@example.com"
                    disabled={status === 'loading' || status === 'sent'}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'sent'}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'loading' ? (
                    'Sending...'
                  ) : status === 'sent' ? (
                    'Email Sent!'
                  ) : (
                    'Send Reset Link'
                  )}
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
            <span>Reset email sent successfully! Check your inbox.</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {status === 'error' && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed to send reset email. Please try again.</span>
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
