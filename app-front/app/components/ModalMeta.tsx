'use client';

import { useState, useEffect } from 'react';
import { apiService, Meta } from '../services/api';

interface ModalMetaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingMeta?: Meta | null;
}

export default function ModalMeta({ isOpen, onClose, onSave, editingMeta }: ModalMetaProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    valor_meta: '',
    valor_atual: '',
    prazo: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingMeta) {
        // Preenchendo o formulário para edição
        setFormData({
          titulo: editingMeta.titulo,
          valor_meta: editingMeta.valor_meta.toString(),
          valor_atual: editingMeta.valor_atual.toString(),
          prazo: editingMeta.prazo,
          descricao: editingMeta.descricao || ''
        });
      } else {
        // Resetando o formulário para nova meta
        setFormData({
          titulo: '',
          valor_meta: '',
          valor_atual: '0',
          prazo: '',
          descricao: ''
        });
      }
    }
  }, [isOpen, editingMeta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const metaData = {
        titulo: formData.titulo,
        valor_meta: parseFloat(formData.valor_meta),
        valor_atual: parseFloat(formData.valor_atual || '0'),
        prazo: formData.prazo,
        descricao: formData.descricao,
        usuario_id: 1 // Hardcoded por enquanto
      };
      
      if (editingMeta) {
        // Editando meta existente
        await apiService.updateMeta(editingMeta.id, metaData);
      } else {
        // Criando nova meta
        await apiService.createMeta(metaData);
      }
      
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
      titulo: '',
      valor_meta: '',
      valor_atual: '',
      prazo: '',
      descricao: ''
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
            {editingMeta ? '📝 Editar Meta' : '🎯 Adicionar Meta'}
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
              Título da Meta
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Descrição
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Breve descrição da meta"
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
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#64748b',
                marginBottom: '0.5rem'
              }}>
                Valor Meta
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_meta}
                onChange={(e) => setFormData({ ...formData, valor_meta: e.target.value })}
                placeholder="20000"
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
                Valor Atual
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_atual}
                onChange={(e) => setFormData({ ...formData, valor_atual: e.target.value })}
                placeholder="7500"
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

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Prazo
            </label>
            <input
              type="date"
              value={formData.prazo}
              onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
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
            {loading ? 'Salvando...' : (editingMeta ? 'Salvar Alterações' : 'Adicionar Meta')}
          </button>
        </form>
      </div>
    </div>
  );
}