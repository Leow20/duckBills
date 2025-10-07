'use client';

import { useState, useEffect } from 'react';
import { apiService, Orcamento } from '../services/api';
import ModalOrcamento from '../components/ModalOrcamento';

export default function Orcamentos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [orcamentos, setOrcamentos] = useState<Array<{
    categoria: string;
    gasto: number;
    orcado: number;
    restante: number;
    icon: string;
    color: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrcamentos();
  }, []);

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

      // Calcula gastos por categoria
      const gastosPorCategoria = new Map<number, number>();
      despesasData.forEach(despesa => {
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
          categoria: nomeCategoria,
          gasto: gastoAtual,
          orcado: orcamento.valor_limite,
          restante: restante,
          icon: iconECor.icon,
          color: iconECor.color
        };
      });

      setOrcamentos(orcamentosProcessados);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      // Fallback para dados estáticos em caso de erro
      setOrcamentos([
        { 
          categoria: 'Alimentação', 
          gasto: 0, 
          orcado: 0, 
          restante: 0,
          icon: '🛒',
          color: '#ef4444'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrcamento = () => {
    loadOrcamentos(); // Recarrega os dados após salvar
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

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Orçamentos Mensais</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
        >
          + Adicionar
        </button>
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
              Nenhum orçamento encontrado. Adicione seu primeiro orçamento!
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
            </div>
            );
            })
          )}
        </div>
      )}

      {/* Resumo Geral */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Resumo do Mês</h2>
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
        onClose={() => setModalOpen(false)}
        onSave={handleSaveOrcamento}
      />
    </div>
  );
}