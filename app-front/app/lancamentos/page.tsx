'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ModalLancamento from '../components/ModalLancamento';

export default function Lancamentos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lancamentos, setLancamentos] = useState<Array<{
    id: number;
    originalId: number;
    descricao: string;
    categoria: string;
    categoria_id: number;
    data: string;
    dataOriginal: string;
    valor: number;
    tipo: 'renda' | 'despesa';
    recorrente?: boolean;
  }>>([]);
  const [filteredLancamentos, setFilteredLancamentos] = useState<typeof lancamentos>([]);
  const [loading, setLoading] = useState(true);
  const [editingLancamento, setEditingLancamento] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    loadLancamentos();
  }, []);

  useEffect(() => {
    filterLancamentos();
  }, [lancamentos, selectedMonth]);

  const filterLancamentos = () => {
    if (!selectedMonth) {
      setFilteredLancamentos(lancamentos);
      return;
    }

    const filtered = lancamentos.filter(lancamento => {
      const [day, month, year] = lancamento.data.split('/');
      const lancamentoMonth = `${year}-${month.padStart(2, '0')}`;
      return lancamentoMonth === selectedMonth;
    });

    setFilteredLancamentos(filtered);
  };

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
    setEditingLancamento(null);
  };

  const handleEditLancamento = (lancamento: any) => {
    setEditingLancamento(lancamento);
    setModalOpen(true);
  };

  const handleDeleteLancamento = async (originalId: number, tipo: 'renda' | 'despesa') => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      try {
        await apiService.deleteLancamento(originalId, tipo);
        loadLancamentos();
      } catch (error) {
        console.error('Erro ao excluir lançamento:', error);
        alert('Erro ao excluir lançamento. Tente novamente.');
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLancamento(null);
  };

  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    // Gera opções para os últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      months.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    
    return months;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title">Lançamentos</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '0.9rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            <option value="">Todos os meses</option>
            {getMonthOptions().map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            + Adicionar
          </button>
        </div>
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
                  <th style={{ textAlign: 'center', width: '120px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLancamentos.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ 
                      textAlign: 'center', 
                      padding: '2rem',
                      color: '#64748b'
                    }}>
                      {selectedMonth 
                        ? 'Nenhum lançamento encontrado para este mês.'
                        : 'Nenhum lançamento encontrado. Adicione seu primeiro lançamento!'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredLancamentos.map((lancamento) => (
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
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEditLancamento(lancamento)}
                        style={{
                          // backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteLancamento(lancamento.originalId, lancamento.tipo)}
                        style={{
                          backgroundColor: '#f7bdbdff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
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
        onClose={handleCloseModal}
        onSave={handleSaveLancamento}
        editingLancamento={editingLancamento}
      />
    </div>
  );
}