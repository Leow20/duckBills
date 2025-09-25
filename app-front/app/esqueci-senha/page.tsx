'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email é obrigatório');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simular chamada da API
    setTimeout(() => {
      console.log('Reset password for:', email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">D</div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>
                DuckBills
              </span>
            </div>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              textAlign: 'center' 
            }}>
              📧
            </div>
            <h1 className="auth-title">Email enviado!</h1>
            <p className="auth-subtitle">
              Enviamos um link para redefinição de senha para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e spam.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Não recebeu o email? 
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}
            >
              Tentar novamente
            </button>
          </div>

          <div className="auth-link">
            <Link href="/login">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">D</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>
              DuckBills
            </span>
          </div>
          <h1 className="auth-title">Esqueceu sua senha?</h1>
          <p className="auth-subtitle">
            Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={`auth-form-input ${error ? 'error' : ''}`}
              placeholder="seu@email.com"
            />
            {error && (
              <span className="auth-form-error">{error}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-form-button"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar link de redefinição'}
          </button>
        </form>

        <div className="auth-link">
          Lembrou sua senha?{' '}
          <Link href="/login">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}