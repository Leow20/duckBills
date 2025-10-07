'use client';

import { useState, useEffect } from 'react';
import { metasService, Meta } from '../services/metas';
import ModalMeta from '../components/ModalMeta';

export default function Metas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetas();
  }, []);

  const loadMetas = async () => {
    try {
      setLoading(true);
      const metasData = await metasService.getMetas();
      setMetas(metasData);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeta = () => {
    loadMetas(); // Recarrega os dados após salvar
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressPercentage = (atual: number, meta: number) => {
    return Math.min((atual / meta) * 100, 100);
  };

  const getDaysUntilDeadline = (prazo: string) => {
    const today = new Date();
    const deadline = new Date(prazo);
    const diffTime = deadline.getTime() - today.getTime();
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
          const percentage = getProgressPercentage(meta.valorAtual, meta.valorMeta);
          const daysLeft = getDaysUntilDeadline(meta.prazo);
          const statusColor = getStatusColor(percentage, daysLeft);
          const restante = meta.valorMeta - meta.valorAtual;

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
                    {formatCurrency(meta.valorAtual)}
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
                    {formatCurrency(meta.valorMeta)}
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
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                    Editar
                  </button>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                    + Valor
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
              {formatCurrency(metas.reduce((sum, meta) => sum + meta.valorAtual, 0))}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total das Metas</div>
            <div className="stat-value neutral">
              {formatCurrency(metas.reduce((sum, meta) => sum + meta.valorMeta, 0))}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Falta Poupar</div>
            <div className="stat-value negative">
              {formatCurrency(metas.reduce((sum, meta) => sum + (meta.valorMeta - meta.valorAtual), 0))}
            </div>
          </div>
        </div>
      </div>
      
      <ModalMeta
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveMeta}
      />
    </div>
  );
}