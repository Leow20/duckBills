'use client';

import { useState } from 'react';
import { metasService } from '../services/metas';

interface ModalMetaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalMeta({ isOpen, onClose, onSave }: ModalMetaProps) {
  const [formData, setFormData] = useState({
    nome: '',
    valorAlvo: '',
    valorGuardado: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const novaMeta = {
        titulo: formData.nome,
        valorMeta: parseFloat(formData.valorAlvo),
        valorAtual: parseFloat(formData.valorGuardado || '0'),
        prazo: '2025-12-31', // Data padrão, pode ser expandido depois
        descricao: formData.nome,
        icon: '🎯', // Ícone padrão, pode ser expandido depois
        color: '#3b82f6' // Cor padrão, pode ser expandido depois
      };
      
      await metasService.createMeta(novaMeta);
      onSave();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert('Erro ao salvar meta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      valorAlvo: '',
      valorGuardado: ''
    });
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
        maxWidth: '450px',
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
            Adicionar Meta
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Nome da Meta
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Viagem para a Europa"
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
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#64748b',
                marginBottom: '0.5rem'
              }}>
                Valor Alvo
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valorAlvo}
                onChange={(e) => setFormData({ ...formData, valorAlvo: e.target.value })}
                placeholder="R$ 20.000,00"
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
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#64748b',
                marginBottom: '0.5rem'
              }}>
                Valor Guardado
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valorGuardado}
                onChange={(e) => setFormData({ ...formData, valorGuardado: e.target.value })}
                placeholder="R$ 755.500,00"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: loading ? '#94a3b8' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Salvando...' : 'Adicionar Meta'}
          </button>
        </form>
      </div>
    </div>
  );
}