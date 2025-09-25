export default function Lancamentos() {
  const lancamentos = [
    { id: 1, descricao: 'Salário Mensal', categoria: 'Salário', data: '01/08/2025', valor: 6500.00 },
    { id: 2, descricao: 'Aluguel', categoria: 'Moradia', data: '05/08/2025', valor: -1800.00 },
    { id: 3, descricao: 'Supermercado Pão de Açúcar', categoria: 'Alimentação', data: '02/08/2025', valor: -750.45 },
    { id: 4, descricao: 'Uber', categoria: 'Transporte', data: '03/08/2025', valor: -25.50 },
    { id: 5, descricao: 'Netflix', categoria: 'Lazer', data: '01/08/2025', valor: -45.90 },
    { id: 6, descricao: 'Freelance Design', categoria: 'Renda Extra', data: '07/08/2025', valor: 1200.00 },
  ];

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
        <button className="btn btn-primary">+ Adicionar</button>
      </div>

      <div className="card">
        <div className="table-container">
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
              {lancamentos.map((lancamento) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}