'use client';

import { useState, useEffect } from 'react';
import { apiService, Orcamento } from '../services/api';
import ModalOrcamento from '../components/ModalOrcamento';

export default function Orcamentos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [orcamentos, setOrcamentos] = useState<Array<{
    id: number;
    categoria: string;
    categoria_id: number;
    gasto: number;
    orcado: number;
    restante: number;
    icon: string;
    color: string;
    periodo: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // formato YYYY-MM
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | null>(null);

  useEffect(() => {
    loadOrcamentos();
  }, [selectedMonth]);

  const loadOrcamentos = async () => {
    try {
      setLoading(true);
      const [orcamentosData, despesasData, categoriasData] = await Promise.all([
        apiService.getOrcamentos(),
        apiService.getDespesas(),
        apiService.getCategorias()
      ]);

      // Mapeamento de ícones e cores por categoria
      const iconsECores: { [key: string]: { icon: string, color: string } } = {
        'Supermercado': { icon: '🛒', color: '#ef4444' },
        'Transporte': { icon: '🚗', color: '#f59e0b' },
        'Aluguel': { icon: '🏠', color: '#3b82f6' },
        'Lazer': { icon: '🎯', color: '#8b5cf6' },
        'Assinaturas': { icon: '📱', color: '#10b981' },
        'Educação': { icon: '📚', color: '#6366f1' }
      };

      // Cria um mapa de categorias
      const categoriasMap = new Map(categoriasData.map(cat => [cat.id, cat.nome]));

      // Filtra despesas por mês selecionado
      const despesasDoMes = despesasData.filter(despesa => {
        const despesaMonth = new Date(despesa.data).toISOString().slice(0, 7);
        return despesaMonth === selectedMonth;
      });

      // Calcula gastos por categoria apenas do mês selecionado
      const gastosPorCategoria = new Map<number, number>();
      despesasDoMes.forEach(despesa => {
        const atual = gastosPorCategoria.get(despesa.categoria_id) || 0;
        gastosPorCategoria.set(despesa.categoria_id, atual + despesa.valor);
      });

      // Monta os orçamentos com dados reais
      const orcamentosProcessados = orcamentosData.map(orcamento => {
        const nomeCategoria = categoriasMap.get(orcamento.categoria_id) || 'Categoria';
        const gastoAtual = gastosPorCategoria.get(orcamento.categoria_id) || 0;
        const restante = Math.max(0, orcamento.valor_limite - gastoAtual);
        const iconECor = iconsECores[nomeCategoria] || { icon: '💳', color: '#64748b' };

        return {
          id: orcamento.id,
          categoria: nomeCategoria,
          categoria_id: orcamento.categoria_id,
          gasto: gastoAtual,
          orcado: orcamento.valor_limite,
          restante: restante,
          icon: iconECor.icon,
          color: iconECor.color,
          periodo: orcamento.periodo
        };
      });

      setOrcamentos(orcamentosProcessados);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      // Fallback para dados estáticos em caso de erro
      setOrcamentos([
        { 
          id: 0,
          categoria: 'Alimentação', 
          categoria_id: 0,
          gasto: 0, 
          orcado: 0, 
          restante: 0,
          icon: '🛒',
          color: '#ef4444',
          periodo: 'mensal'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrcamento = () => {
    loadOrcamentos(); // Recarrega os dados após salvar
    setEditingOrcamento(null); // Limpa o estado de edição
  };

  const handleEditOrcamento = (orcamento: any) => {
    // Converte o orçamento local para o formato da API
    const orcamentoParaEdicao: Orcamento = {
      id: orcamento.id,
      categoria_id: orcamento.categoria_id,
      usuario_id: 1, // Assumindo usuário fixo
      valor_limite: orcamento.orcado,
      periodo: orcamento.periodo
    };
    setEditingOrcamento(orcamentoParaEdicao);
    setModalOpen(true);
  };

  const handleDeleteOrcamento = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await apiService.deleteOrcamento(id);
        loadOrcamentos(); // Recarrega os dados após excluir
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
        alert('Erro ao excluir orçamento. Tente novamente.');
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingOrcamento(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgressPercentage = (gasto: number, orcado: number) => {
    return Math.min((gasto / orcado) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    return '#10b981';
  };

  const formatMonthName = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const getAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    // Adiciona os últimos 6 meses e os próximos 6 meses
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    
    return months;
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Orçamentos Mensais</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Visualizando: {formatMonthName(selectedMonth)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#1e293b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {getAvailableMonths().map(month => (
              <option key={month} value={month}>
                {formatMonthName(month)}
              </option>
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

      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '4rem',
          color: '#64748b'
        }}>
          Carregando orçamentos...
        </div>
      ) : (
        <div className="grid-3">
          {orcamentos.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1',
              textAlign: 'center', 
              padding: '2rem',
              color: '#64748b'
            }}>
              <div style={{ marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                Nenhum orçamento para {formatMonthName(selectedMonth)}
              </div>
              <div>
                Adicione orçamentos ou selecione outro mês para visualizar os dados.
              </div>
            </div>
          ) : (
            orcamentos.map((orcamento, index) => {
          const percentage = getProgressPercentage(orcamento.gasto, orcamento.orcado);
          const progressColor = getProgressColor(percentage);
          
          return (
            <div key={index} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: orcamento.color + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {orcamento.icon}
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>
                    {orcamento.categoria}
                  </h3>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b' 
                  }}>
                    {percentage.toFixed(1)}% usado
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  <span>Gasto: {formatCurrency(orcamento.gasto)}</span>
                  <span>Orçado: {formatCurrency(orcamento.orcado)}</span>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: progressColor
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b',
                    marginBottom: '2px'
                  }}>
                    {orcamento.restante > 0 ? 'Restante' : 'Excedido'}
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700',
                    color: orcamento.restante > 0 ? '#10b981' : '#ef4444'
                  }}>
                    {formatCurrency(Math.abs(orcamento.restante))}
                  </div>
                </div>
                
                {percentage >= 90 && (
                  <div style={{
                    backgroundColor: percentage >= 100 ? '#fef2f2' : '#fffbeb',
                    color: percentage >= 100 ? '#dc2626' : '#d97706',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {percentage >= 100 ? '⚠️ Limite excedido' : '⚡ Quase no limite'}
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button
                  onClick={() => handleEditOrcamento(orcamento)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#6366f1',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eef2ff';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <span>📝</span> Editar
                </button>
                <button
                  onClick={() => handleDeleteOrcamento(orcamento.id)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fecaca';
                    e.currentTarget.style.borderColor = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.borderColor = '#fecaca';
                  }}
                >
                  <span>🗑️</span> Excluir
                </button>
              </div>
            </div>
            );
            })
          )}
        </div>
      )}

      {/* Resumo Geral */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Resumo de {formatMonthName(selectedMonth)}</h2>
        <div className="stats-grid" style={{ marginTop: '1rem' }}>
          <div className="stat-card">
            <div className="stat-label">Total Orçado</div>
            <div className="stat-value neutral">
              {formatCurrency(orcamentos.reduce((sum, orc) => sum + orc.orcado, 0))}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Gasto</div>
            <div className="stat-value negative">
              {formatCurrency(orcamentos.reduce((sum, orc) => sum + orc.gasto, 0))}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Disponível</div>
            <div className="stat-value positive">
              {formatCurrency(orcamentos.reduce((sum, orc) => sum + orc.restante, 0))}
            </div>
          </div>
        </div>
      </div>
      
      <ModalOrcamento
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOrcamento}
        editingOrcamento={editingOrcamento}
      />
    </div>
  );
}