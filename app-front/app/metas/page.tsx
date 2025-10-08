'use client';

import { useState, useEffect } from 'react';
import { apiService, Meta } from '../services/api';
import ModalMeta from '../components/ModalMeta';
import ModalAdicionarValor from '../components/ModalAdicionarValor';
import { formatDateToBR, getCurrentDateISO } from '../utils/dateUtils';

// Interface local estendida para incluir ícone e cor
interface MetaExtended extends Meta {
  icon: string;
  color: string;
}

export default function Metas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [metas, setMetas] = useState<MetaExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [addValueModalOpen, setAddValueModalOpen] = useState(false);
  const [selectedMetaId, setSelectedMetaId] = useState<number | null>(null);

  useEffect(() => {
    loadMetas();
  }, []);

  const loadMetas = async () => {
    try {
      setLoading(true);
      const metasData = await apiService.getMetas();
      
      // Mapeamento de ícones e cores por título
      const iconsECores: { [key: string]: { icon: string, color: string } } = {
        'Viagem para a Europa': { icon: '✈️', color: '#3b82f6' },
        'Macbook Pro Novo': { icon: '💻', color: '#6366f1' },
        'Reserva de Emergência': { icon: '🛡️', color: '#10b981' },
        'Curso de Especialização': { icon: '🎓', color: '#f59e0b' },
        // Defaults
        'default': { icon: '🎯', color: '#8b5cf6' }
      };
      
      const metasExtended = metasData.map(meta => {
        const iconECor = iconsECores[meta.titulo] || iconsECores['default'];
        return {
          ...meta,
          icon: iconECor.icon,
          color: iconECor.color
        };
      });
      
      setMetas(metasExtended);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeta = () => {
    loadMetas(); // Recarrega os dados após salvar
    setEditingMeta(null); // Limpa o estado de edição
  };

  const handleEditMeta = (meta: MetaExtended) => {
    // Converte para o formato da API
    const metaParaEdicao: Meta = {
      id: meta.id,
      titulo: meta.titulo,
      valor_atual: meta.valor_atual,
      valor_meta: meta.valor_meta,
      prazo: meta.prazo,
      descricao: meta.descricao,
      usuario_id: meta.usuario_id
    };
    setEditingMeta(metaParaEdicao);
    setModalOpen(true);
  };

  const handleDeleteMeta = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        await apiService.deleteMeta(id);
        loadMetas(); // Recarrega os dados após excluir
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
        alert('Erro ao excluir meta. Tente novamente.');
      }
    }
  };

  const handleAddValue = (metaId: number) => {
    setSelectedMetaId(metaId);
    setAddValueModalOpen(true);
  };

  const handleAddValueSubmit = async (valor: number) => {
    if (selectedMetaId && valor > 0) {
      try {
        await apiService.adicionarValorMeta(selectedMetaId, valor);
        loadMetas(); // Recarrega os dados após adicionar valor
        setAddValueModalOpen(false);
        setSelectedMetaId(null);
      } catch (error) {
        console.error('Erro ao adicionar valor:', error);
        alert('Erro ao adicionar valor à meta. Tente novamente.');
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMeta(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return formatDateToBR(dateString);
  };

  const getProgressPercentage = (atual: number, meta: number) => {
    return Math.min((atual / meta) * 100, 100);
  };

  const getDaysUntilDeadline = (prazo: string) => {
    // Obter a data atual no formato ISO
    const today = getCurrentDateISO();
    
    // Converter ambas as datas para objetos Date sem problemas de timezone
    const [todayYear, todayMonth, todayDay] = today.split('-').map(Number);
    const [prazoYear, prazoMonth, prazoDay] = prazo.split('-').map(Number);
    
    const todayDate = new Date(todayYear, todayMonth - 1, todayDay);
    const prazoDate = new Date(prazoYear, prazoMonth - 1, prazoDay);
    
    const diffTime = prazoDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getStatusColor = (percentage: number, daysLeft: number) => {
    if (percentage >= 100) return '#10b981';
    if (daysLeft < 30) return '#ef4444';
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Metas de Poupança</h1>
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
          Carregando metas...
        </div>
      ) : (
        <div className="grid-2">
          {metas.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1',
              textAlign: 'center', 
              padding: '2rem',
              color: '#64748b'
            }}>
              Nenhuma meta encontrada. Adicione sua primeira meta!
            </div>
          ) : (
            metas.map((meta, index) => {
          const percentage = getProgressPercentage(meta.valor_atual, meta.valor_meta);
          const daysLeft = getDaysUntilDeadline(meta.prazo);
          const statusColor = getStatusColor(percentage, daysLeft);
          const restante = meta.valor_meta - meta.valor_atual;

          return (
            <div key={index} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: meta.color + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>
                  {meta.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>
                    {meta.titulo}
                  </h3>
                  <p style={{ 
                    color: '#64748b',
                    marginBottom: '8px'
                  }}>
                    {meta.descricao}
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: daysLeft < 30 ? '#fef2f2' : '#f0fdf4',
                    color: daysLeft < 30 ? '#dc2626' : '#16a34a',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    📅 {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo vencido'}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'baseline',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b' 
                  }}>
                    Progresso
                  </span>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="progress-bar" style={{ height: '12px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: statusColor,
                      borderRadius: '6px'
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    Atual
                  </div>
                  <div style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {formatCurrency(meta.valor_atual)}
                  </div>
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    Meta
                  </div>
                  <div style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {formatCurrency(meta.valor_meta)}
                  </div>
                </div>

                <div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    Restante
                  </div>
                  <div style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700',
                    color: restante > 0 ? '#ef4444' : '#10b981'
                  }}>
                    {formatCurrency(restante)}
                  </div>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b' 
                  }}>
                    Prazo: {formatDate(meta.prazo)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                    onClick={() => handleEditMeta(meta)}
                  >
                    📝 Editar
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                    onClick={() => handleAddValue(meta.id)}
                  >
                    💰 + Valor
                  </button>
                  <button
                    onClick={() => handleDeleteMeta(meta.id)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            );
            })
          )}
        </div>
      )}

      {/* Resumo das Metas */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Resumo das Metas</h2>
        <div className="stats-grid" style={{ marginTop: '1rem' }}>
          <div className="stat-card">
            <div className="stat-label">Total Poupado</div>
            <div className="stat-value positive">
              {formatCurrency(metas.reduce((sum, meta) => sum + meta.valor_atual, 0))}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total das Metas</div>
            <div className="stat-value neutral">
              {formatCurrency(metas.reduce((sum, meta) => sum + meta.valor_meta, 0))}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Falta Poupar</div>
            <div className="stat-value negative">
              {formatCurrency(metas.reduce((sum, meta) => sum + (meta.valor_meta - meta.valor_atual), 0))}
            </div>
          </div>
        </div>
      </div>
      
      <ModalMeta
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMeta}
        editingMeta={editingMeta}
      />

      {/* Modal para Adicionar Valor */}
      {addValueModalOpen && (
        <ModalAdicionarValor
          isOpen={addValueModalOpen}
          onClose={() => {
            setAddValueModalOpen(false);
            setSelectedMetaId(null);
          }}
          onSubmit={handleAddValueSubmit}
          metaTitulo={metas.find(m => m.id === selectedMetaId)?.titulo || ''}
        />
      )}
    </div>
  );
}