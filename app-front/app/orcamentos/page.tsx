export default function Orcamentos() {
  const orcamentos = [
    { 
      categoria: 'Alimentação', 
      gasto: 750.45, 
      orcado: 1000.00, 
      restante: 249.55,
      icon: '🛒',
      color: '#ef4444'
    },
    { 
      categoria: 'Transporte', 
      gasto: 250.00, 
      orcado: 400.00, 
      restante: 150.00,
      icon: '🚗',
      color: '#f59e0b'
    },
    { 
      categoria: 'Lazer', 
      gasto: 280.00, 
      orcado: 600.00, 
      restante: 320.00,
      icon: '🎯',
      color: '#8b5cf6'
    },
    { 
      categoria: 'Moradia', 
      gasto: 1800.00, 
      orcado: 1800.00, 
      restante: 0.00,
      icon: '🏠',
      color: '#3b82f6'
    },
    { 
      categoria: 'Saúde', 
      gasto: 120.00, 
      orcado: 300.00, 
      restante: 180.00,
      icon: '🏥',
      color: '#10b981'
    }
  ];

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
        <button className="btn btn-primary">+ Adicionar</button>
      </div>

      <div className="grid-3">
        {orcamentos.map((orcamento, index) => {
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
        })}
      </div>

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
    </div>
  );
}