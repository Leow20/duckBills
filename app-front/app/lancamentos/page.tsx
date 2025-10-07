'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ModalLancamento from '../components/ModalLancamento';

export default function Lancamentos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lancamentos, setLancamentos] = useState<Array<{
    id: number;
    descricao: string;
    categoria: string;
    data: string;
    valor: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLancamentos();
  }, []);

  const loadLancamentos = async () => {
    try {
      setLoading(true);
      const lancamentosData = await apiService.getLancamentos();
      setLancamentos(lancamentosData);
    } catch (error) {
      console.error('Erro ao carregar lançamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLancamento = () => {
    loadLancamentos(); // Recarrega os dados após salvar
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: { [key: string]: string } = {
      'Salário': '💰',
      'Moradia': '🏠',
      'Alimentação': '🛒',
      'Transporte': '🚗',
      'Lazer': '🎯',
      'Renda Extra': '💼'
    };
    return icons[categoria] || '💳';
  };

  const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'Salário': '#10b981',
      'Moradia': '#3b82f6',
      'Alimentação': '#ef4444',
      'Transporte': '#f59e0b',
      'Lazer': '#8b5cf6',
      'Renda Extra': '#06b6d4'
    };
    return colors[categoria] || '#64748b';
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Lançamentos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
        >
          + Adicionar
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: '4rem',
              color: '#64748b'
            }}>
              Carregando lançamentos...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ 
                      textAlign: 'center', 
                      padding: '2rem',
                      color: '#64748b'
                    }}>
                      Nenhum lançamento encontrado. Adicione seu primeiro lançamento!
                    </td>
                  </tr>
                ) : (
                  lancamentos.map((lancamento) => (
                <tr key={lancamento.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: getCategoryColor(lancamento.categoria),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        {getCategoryIcon(lancamento.categoria)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                          {lancamento.descricao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      backgroundColor: getCategoryColor(lancamento.categoria) + '20',
                      color: getCategoryColor(lancamento.categoria),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {lancamento.categoria}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{lancamento.data}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`stat-value ${lancamento.valor > 0 ? 'positive' : 'negative'}`}
                          style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {formatCurrency(lancamento.valor)}
                    </span>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <ModalLancamento
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLancamento}
      />
    </div>
  );
}