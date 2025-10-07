'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simular chamada da API
    setTimeout(() => {
      console.log('Login data:', formData);
      // Aqui você faria a chamada para o backend
      // Por enquanto, apenas simula o login
      alert('Login realizado com sucesso! (Simulação)');
      setIsLoading(false);
    }, 1500);
  };

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
          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-subtitle">
            Entre em sua conta para continuar gerenciando suas finanças
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
              value={formData.email}
              onChange={handleChange}
              className={`auth-form-input ${errors.email ? 'error' : ''}`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <span className="auth-form-error">{errors.email}</span>
            )}
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`auth-form-input ${errors.password ? 'error' : ''}`}
              placeholder="Sua senha"
            />
            {errors.password && (
              <span className="auth-form-error">{errors.password}</span>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.875rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
              <input type="checkbox" className="auth-checkbox" />
              Lembrar-me
            </label>
            <Link 
              href="/esqueci-senha" 
              style={{ color: '#6366f1', textDecoration: 'none' }}
            >
              Esqueci minha senha
            </Link>
          </div>

          <button 
            type="submit" 
            className="auth-form-button"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-divider" style={{
            textAlign: 'center'
        }}>
          <span>ou</span>
        </div>

        <div className="loginGoggle" style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <button 
            className="auth-form-button" 
            style={{ 
                backgroundColor: 'white', 
                color: '#374151', 
                border: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}
            onClick={() => alert('Login com Google (Em breve)')}
            >
            <span style={{ fontSize: '1.2rem' }}>🚀</span>
            Continuar com Google
            </button>
        </div>

        <div className="auth-link">
          Não tem uma conta?{' '}
          <Link href="/cadastro">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}