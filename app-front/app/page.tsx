"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [usuarioLogadoState, setUsuarioLogado] = useState<any>(null);
  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
      router.push("/login");
    } else {
        setUsuarioLogado(usuarioLogado);
    }
  }, [router]);
  const transacoes = [
    { id: 1, descricao: 'Aluguel', categoria: 'Moradia', data: '05/08/2025', valor: -1800.00 },
    { id: 2, descricao: 'Supermercado', categoria: 'Alimentação', data: '02/08/2025', valor: -750.45 },
    { id: 3, descricao: 'Salário Mensal', categoria: 'Salário', data: '01/08/2025', valor: 6500.00 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container">
      <h1 className="page-title">Olá, {JSON.parse(usuarioLogadoState)}!</h1>
      
      {/* Cards de EstatÃ­sticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Balanço</div>
          <div className="stat-value neutral">R$ 6.229,75</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Receitas</div>
          <div className="stat-value positive">R$ 8.300,00</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Despesas</div>
          <div className="stat-value negative">R$ 2.070,25</div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid-2">
        {/* Despesas por Categoria */}
        <div className="card">
          <h2 className="card-title">Despesas por Categoria</h2>
          <div className="chart-container">
            <div className="chart-placeholder"></div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color blue"></div>
              <span>Moradia 60.0%</span>
            </div>
            <div className="legend-item">
              <div className="legend-color red"></div>
              <span>Alimentação 25.0%</span>
            </div>
            <div className="legend-item">
              <div className="legend-color green"></div>
              <span>Transporte 15.0%</span>
            </div>
          </div>
        </div>

        {/* Ãšltimos LanÃ§amentos */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Últimos Lançamentos</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: transacao.categoria === 'Moradia' ? '#3b82f6' : 
                                        transacao.categoria === 'Alimentação' ? '#ef4444' : '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {transacao.categoria === 'Moradia' ? '??' : 
                           transacao.categoria === 'Alimentação' ? '??' : '??'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{transacao.descricao}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {transacao.data}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`stat-value ${transacao.valor > 0 ? 'positive' : 'negative'}`}
                            style={{ fontSize: '1rem', fontWeight: '600' }}>
                        {formatCurrency(transacao.valor)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}