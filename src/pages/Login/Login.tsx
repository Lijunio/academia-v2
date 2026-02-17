// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError('Email ou senha inválidos');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-secondary-dark to-black 
      flex items-center justify-center p-4">
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-red to-accent-purple 
            flex items-center justify-center shadow-2xl">
            <i className="fas fa-heartbeat text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-black text-white font-montserrat">
            TREINOS DO <span className="bg-gradient-to-r from-accent-red to-accent-purple bg-clip-text text-transparent">ELIJUNIO</span>
          </h1>
          <p className="text-text-secondary mt-2">Faça login para continuar</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gradient-to-br from-secondary-dark/50 to-black/50 rounded-2xl p-8 
          border border-white/10 backdrop-blur-xl">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white mb-2 text-sm">Email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary hidden md:block"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 
                    text-white placeholder-text-secondary focus:outline-none focus:border-accent-red"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-white mb-2 text-sm">Senha</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary hidden md:block"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 
                    text-white placeholder-text-secondary focus:outline-none focus:border-accent-red"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-accent-red to-accent-purple 
                text-white rounded-xl font-bold hover:opacity-90 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <>
                  <span>Entrar</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] 
                    transition-transform duration-700"></div>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;