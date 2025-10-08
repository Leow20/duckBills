'use client';

import { useState, useEffect } from 'react';
import { apiService, Categoria, Orcamento } from '../services/api';
import { useDashboard } from '../contexts/DashboardContext';

interface ModalOrcamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingOrcamento?: Orcamento | null;
}

export default function ModalOrcamento({ isOpen, onClose, onSave, editingOrcamento }: ModalOrcamentoProps) {
  const [formData, setFormData] = useState({
    categoria_id: 0,
    valor_limite: '',
    periodo: 'mensal'
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const { triggerRefresh } = useDashboard();

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
      
      // Preenche o formulário se estamos editando
      if (editingOrcamento) {
        setFormData({
          categoria_id: editingOrcamento.categoria_id,
          valor_limite: editingOrcamento.valor_limite.toString(),
          periodo: editingOrcamento.periodo
        });
      }
    }
  }, [isOpen, editingOrcamento]);

  const loadCategorias = async () => {
    try {
      const categoriasData = await apiService.getCategorias();
      // Para orçamentos, normalmente usamos categorias de despesa
      const categoriasDespesa = categoriasData.filter(cat => cat.tipo === 'despesa');
      setCategorias(categoriasDespesa);
      
      if (categoriasDespesa.length > 0) {
        setFormData(prev => ({ ...prev, categoria_id: categoriasDespesa[0].id }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orcamentoData = {
        categoria_id: formData.categoria_id,
        usuario_id: 1, // Hardcoded por enquanto
        valor_limite: parseFloat(formData.valor_limite),
        periodo: formData.periodo
      };
      
      if (editingOrcamento) {
        // Editando orçamento existente
        await apiService.updateOrcamento(editingOrcamento.id, orcamentoData);
      } else {
        // Criando novo orçamento
        await apiService.createOrcamento(orcamentoData);
      }
      
      onSave();
      triggerRefresh(); // Atualiza o dashboard
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      alert('Erro ao salvar orçamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      categoria_id: 0,
      valor_limite: '',
      periodo: 'mensal'
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
            {editingOrcamento ? 'Editar Orçamento' : 'Adicionar Orçamento'}
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
              Categoria
            </label>
            <select
              value={formData.categoria_id}
              onChange={(e) => setFormData({ ...formData, categoria_id: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              Valor Orçado
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.valor_limite}
              onChange={(e) => setFormData({ ...formData, valor_limite: e.target.value })}
              placeholder="R$ 600,00"
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
            {loading ? 'Salvando...' : (editingOrcamento ? 'Salvar Alterações' : 'Adicionar Orçamento')}
          </button>
        </form>
      </div>
    </div>
  );
}