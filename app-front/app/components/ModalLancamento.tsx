'use client';

import { useState, useEffect } from 'react';
import { apiService, Categoria } from '../services/api';

interface ModalLancamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lancamento: any) => void;
}

export default function ModalLancamento({ isOpen, onClose, onSave }: ModalLancamentoProps) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    categoria_id: 0,
    tipo: 'despesa' // 'renda' ou 'despesa'
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  const loadCategorias = async () => {
    try {
      const categoriasData = await apiService.getCategorias();
      setCategorias(categoriasData);
      // Define a primeira categoria disponível como padrão
      if (categoriasData.length > 0) {
        const primeiraCategoria = categoriasData.find(c => c.tipo === formData.tipo) || categoriasData[0];
        setFormData(prev => ({ ...prev, categoria_id: primeiraCategoria.id }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const categoriasFiltradas = categorias.filter(cat => cat.tipo === formData.tipo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const valorNumerico = parseFloat(formData.valor);
      
      if (formData.tipo === 'renda') {
        const rendaData = {
          valor: valorNumerico,
          data: formData.data,
          descricao: formData.descricao,
          categoria_id: formData.categoria_id,
          usuario_id: 1
        };
        await apiService.createRenda(rendaData);
      } else {
        const despesaData = {
          valor: valorNumerico,
          data: formData.data,
          descricao: formData.descricao,
          categoria_id: formData.categoria_id,
          usuario_id: 1,
          recorrente: false
        };
        await apiService.createDespesa(despesaData);
      }
      
      onSave(null); // Notifica que houve mudança para recarregar dados
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      alert('Erro ao salvar lançamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      categoria_id: 0,
      tipo: 'despesa'
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
        maxWidth: '500px',
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
            Adicionar Lançamento
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
              Descrição
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Compras do mês"
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
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                Valor
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="R$ 150,00"
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                Data
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
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
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

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
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              {categoriasFiltradas.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, tipo: 'renda' });
                // Atualiza categoria_id para uma categoria de renda se disponível
                const categoriasRenda = categorias.filter(c => c.tipo === 'renda');
                if (categoriasRenda.length > 0) {
                  setFormData(prev => ({ ...prev, tipo: 'renda', categoria_id: categoriasRenda[0].id }));
                }
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: formData.tipo === 'renda' ? '#10b981' : '#f1f5f9',
                color: formData.tipo === 'renda' ? 'white' : '#64748b'
              }}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, tipo: 'despesa' });
                // Atualiza categoria_id para uma categoria de despesa se disponível
                const categoriasDespesa = categorias.filter(c => c.tipo === 'despesa');
                if (categoriasDespesa.length > 0) {
                  setFormData(prev => ({ ...prev, tipo: 'despesa', categoria_id: categoriasDespesa[0].id }));
                }
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: formData.tipo === 'despesa' ? '#ef4444' : '#f1f5f9',
                color: formData.tipo === 'despesa' ? 'white' : '#64748b'
              }}
            >
              Despesa
            </button>
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
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              if (!loading) target.style.backgroundColor = '#5048e5';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              if (!loading) target.style.backgroundColor = '#6366f1';
            }}
          >
            {loading ? 'Salvando...' : 'Adicionar Lançamento'}
          </button>
        </form>
      </div>
    </div>
  );
}