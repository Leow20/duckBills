'use client';

import { useState } from 'react';

interface ModalAdicionarValorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (valor: number) => void;
  metaTitulo: string;
}

export default function ModalAdicionarValor({ 
  isOpen, 
  onClose, 
  onSubmit, 
  metaTitulo 
}: ModalAdicionarValorProps) {
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = parseFloat(valor);
    
    if (valorNumerico <= 0) {
      alert('O valor deve ser positivo.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(valorNumerico);
      setValor('');
    } catch (error) {
      console.error('Erro ao adicionar valor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValor('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>
            💰 Adicionar Valor
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b',
            marginBottom: '4px'
          }}>
            Adicionando valor à meta:
          </div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            {metaTitulo}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Valor a Adicionar
            </label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="R$ 100,00"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '0.875rem',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !valor}
              style={{
                flex: 1,
                padding: '0.875rem',
                backgroundColor: loading || !valor ? '#94a3b8' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading || !valor ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Adicionando...' : 'Adicionar Valor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}