'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Verificar força da senha
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validação do nome
    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

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

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Validação dos termos
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
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
      console.log('Cadastro data:', {
        nome: formData.nome,
        email: formData.email,
        password: formData.password
      });
      // Aqui você faria a chamada para o backend
      alert('Cadastro realizado com sucesso! (Simulação)');
      setIsLoading(false);
    }, 2000);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Fraca';
      case 'medium': return 'Média';
      case 'strong': return 'Forte';
      default: return '';
    }
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
          <h1 className="auth-title">Crie sua conta</h1>
          <p className="auth-subtitle">
            Comece a organizar suas finanças de forma inteligente
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="nome" className="auth-form-label">
              Nome completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`auth-form-input ${errors.nome ? 'error' : ''}`}
              placeholder="João da Silva"
            />
            {errors.nome && (
              <span className="auth-form-error">{errors.nome}</span>
            )}
          </div>

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
              placeholder="Crie uma senha segura"
            />
            {errors.password && (
              <span className="auth-form-error">{errors.password}</span>
            )}
            {formData.password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div className={`password-strength-fill ${passwordStrength}`}></div>
                </div>
                <span className={`password-strength-text ${passwordStrength}`}>
                  Senha: {getPasswordStrengthText()}
                </span>
              </div>
            )}
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirmPassword" className="auth-form-label">
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`auth-form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Digite a senha novamente"
            />
            {errors.confirmPassword && (
              <span className="auth-form-error">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="auth-form-group">
            <div className="auth-checkbox-group">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="auth-checkbox"
              />
              <label htmlFor="acceptTerms" className="auth-checkbox-label">
                Eu aceito os{' '}
                <a href="/termos" target="_blank">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="/privacidade" target="_blank">
                  Política de Privacidade
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <span className="auth-form-error">{errors.acceptTerms}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-form-button"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

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
          onClick={() => alert('Cadastro com Google (Em breve)')}
        >
          <span style={{ fontSize: '1.2rem' }}>🚀</span>
          Cadastrar com Google
        </button>

        <div className="auth-link">
          Já tem uma conta?{' '}
          <Link href="/login">
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
}