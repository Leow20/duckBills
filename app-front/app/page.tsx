'use client';

import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { useDashboard } from './contexts/DashboardContext';
import PieChart from './components/PieChart';
import { formatDateToBR, compareDates } from './utils/dateUtils';

interface DashboardStats {
  totalReceitas: number;
  totalDespesas: number;
  balanco: number;
  despesasPorCategoria: Array<{
    categoria: string;
    total: number;
    percentual: number;
    cor: string;
  }>;
  ultimosLancamentos: Array<{
    id: number;
    descricao: string;
    categoria: string;
    data: string;
    valor: number;
  }>;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReceitas: 0,
    totalDespesas: 0,
    balanco: 0,
    despesasPorCategoria: [],
    ultimosLancamentos: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' ou 'YYYY-MM'
  const { refreshTrigger } = useDashboard();

  useEffect(() => {
    loadDashboardData();
  }, [refreshTrigger, selectedMonth]); // Recarrega quando há mudanças ou mês muda

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [rendas, despesas, categorias] = await Promise.all([
        apiService.getRendas(),
        apiService.getDespesas(),
        apiService.getCategorias()
      ]);

      // Filtra por mês se selecionado
      const rendasFiltradas = selectedMonth === 'all' 
        ? rendas 
        : rendas.filter(renda => {
            const rendaMonth = new Date(renda.data).toISOString().slice(0, 7);
            return rendaMonth === selectedMonth;
          });

      const despesasFiltradas = selectedMonth === 'all' 
        ? despesas 
        : despesas.filter(despesa => {
            const despesaMonth = new Date(despesa.data).toISOString().slice(0, 7);
            return despesaMonth === selectedMonth;
          });

      // Calcula totais
      const totalReceitas = rendasFiltradas.reduce((sum, renda) => sum + renda.valor, 0);
      const totalDespesas = despesasFiltradas.reduce((sum, despesa) => sum + despesa.valor, 0);
      const balanco = totalReceitas - totalDespesas;

      // Cria mapa de categorias
      const categoriasMap = new Map(categorias.map(cat => [cat.id, cat.nome]));

      // Calcula despesas por categoria (usando dados filtrados)
      const despesasPorCategoria = new Map<string, number>();
      despesasFiltradas.forEach(despesa => {
        const nomeCategoria = categoriasMap.get(despesa.categoria_id) || 'Outros';
        const atual = despesasPorCategoria.get(nomeCategoria) || 0;
        despesasPorCategoria.set(nomeCategoria, atual + despesa.valor);
      });

      // Converte para array e calcula percentuais
      const coresCategorias: { [key: string]: string } = {
        'Aluguel': '#3b82f6',
        'Supermercado': '#ef4444',
        'Transporte': '#f59e0b',
        'Lazer': '#8b5cf6',
        'Assinaturas': '#10b981',
        'Educação': '#6366f1'
      };

      // Primeiro, pega as top 5 categorias por valor
      const topCategorias = Array.from(despesasPorCategoria.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      // Calcula o total das top 5 categorias
      const totalTopCategorias = topCategorias.reduce((sum, [_, valor]) => sum + valor, 0);

      // Se existem mais de 5 categorias, agrupa o restante em "Outros"
      const totalOutras = totalDespesas - totalTopCategorias;
      
      let despesasPorCategoriaArray = topCategorias.map(([categoria, total]) => ({
        categoria,
        total,
        percentual: totalDespesas > 0 ? (total / totalDespesas) * 100 : 0,
        cor: coresCategorias[categoria] || '#64748b'
      }));

      // Adiciona "Outros" se houver categorias restantes
      if (totalOutras > 0 && despesasPorCategoria.size > 5) {
        despesasPorCategoriaArray.push({
          categoria: 'Outros',
          total: totalOutras,
          percentual: totalDespesas > 0 ? (totalOutras / totalDespesas) * 100 : 0,
          cor: '#9ca3af'
        });
      }

      // Ajusta os percentuais para garantir que somem exatamente 100%
      if (despesasPorCategoriaArray.length > 0 && totalDespesas > 0) {
        const somaPercentuais = despesasPorCategoriaArray.reduce((sum, item) => sum + item.percentual, 0);
        if (Math.abs(somaPercentuais - 100) > 0.01) { // Se a diferença for significativa
          // Ajusta o último item para compensar erros de arredondamento
          const ultimoIndex = despesasPorCategoriaArray.length - 1;
          despesasPorCategoriaArray[ultimoIndex].percentual += (100 - somaPercentuais);
        }
      }

      // Prepara últimos lançamentos (combina rendas e despesas filtradas)
      const todosLancamentos = [
        ...rendasFiltradas.map(renda => ({
          id: renda.id,
          descricao: renda.descricao || 'Renda sem descrição',
          categoria: categoriasMap.get(renda.categoria_id) || 'Categoria',
          data: formatDateToBR(renda.data),
          valor: renda.valor,
          tipo: 'renda' as const
        })),
        ...despesasFiltradas.map(despesa => ({
          id: despesa.id + 10000, // Offset para evitar conflito
          descricao: despesa.descricao || 'Despesa sem descrição', 
          categoria: categoriasMap.get(despesa.categoria_id) || 'Categoria',
          data: formatDateToBR(despesa.data),
          valor: -despesa.valor, // Negativo para despesas
          tipo: 'despesa' as const
        }))
      ]
        .sort((a, b) => compareDates(b.data, a.data))
        .slice(0, 5); // 5 mais recentes

      setStats({
        totalReceitas,
        totalDespesas,
        balanco,
        despesasPorCategoria: despesasPorCategoriaArray,
        ultimosLancamentos: todosLancamentos
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Em caso de erro, mantém valores padrão
    } finally {
      setLoading(false);
    }
  };

    const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: { [key: string]: string } = {
      'Aluguel': '🏠',
      'Supermercado': '🛒',
      'Transporte': '🚗',
      'Salário': '💰',
      'Freelance': '💼',
      'Lazer': '🎯',
      'Assinaturas': '📱',
      'Educação': '📚'
    };
    return icons[categoria] || '💳';
  };

  const formatMonthName = (monthString: string) => {
    if (monthString === 'all') return 'Todos os Meses';
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const getAvailableMonths = () => {
    const months = ['all'];
    const currentDate = new Date();
    
    // Adiciona os últimos 12 meses
    for (let i = 0; i <= 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    
    return months;
  };



  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">Olá, Lori!</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.875rem' }}>
            Período: {formatMonthName(selectedMonth)}
          </p>
        </div>
        <div>
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
              cursor: 'pointer',
              minWidth: '200px'
            }}
          >
            {getAvailableMonths().map(month => (
              <option key={month} value={month}>
                {formatMonthName(month)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Cards de Estatísticas */}
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '2rem',
          color: '#64748b'
        }}>
          Carregando dados...
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Balanço</div>
            <div className={`stat-value ${stats.balanco > 0 ? 'positive' : stats.balanco < 0 ? 'negative' : 'neutral'}`}>
              {formatCurrency(stats.balanco)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Receitas</div>
            <div className="stat-value positive">
              {formatCurrency(stats.totalReceitas)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Despesas</div>
            <div className="stat-value negative">
              {formatCurrency(stats.totalDespesas)}
            </div>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid-2">
        {/* Despesas por Categoria */}
        <div className="card">
          <h2 className="card-title">Despesas por Categoria</h2>
          <div className="chart-container" style={{ minHeight: '320px', padding: '1rem 0' }}>
            <PieChart data={stats.despesasPorCategoria} />
          </div>
          <div className="legend">
            {loading ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>
                Carregando categorias...
              </div>
            ) : stats.despesasPorCategoria.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                <div style={{ marginBottom: '8px' }}>📊</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                  Nenhuma despesa encontrada
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  {selectedMonth === 'all' 
                    ? 'Nenhuma despesa cadastrada no sistema'
                    : `Nenhuma despesa em ${formatMonthName(selectedMonth).toLowerCase()}`
                  }
                </div>
              </div>
            ) : (
              stats.despesasPorCategoria.map((item, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: item.cor }}
                  ></div>
                  <span>{item.categoria} {item.percentual.toFixed(1)}%</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Lançamentos */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Últimos 5 Lançamentos</h2>
          </div>
          <div className="table-container">
            {loading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '2rem',
                color: '#64748b'
              }}>
                Carregando lançamentos...
              </div>
            ) : (
              <table className="table">
                <tbody>
                  {stats.ultimosLancamentos.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ 
                        textAlign: 'center', 
                        padding: '2rem',
                        color: '#64748b'
                      }}>
                        Nenhum lançamento encontrado
                      </td>
                    </tr>
                  ) : (
                    stats.ultimosLancamentos.map((lancamento) => (
                      <tr key={lancamento.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: lancamento.valor > 0 ? '#10b981' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '14px'
                            }}>
                              {getCategoryIcon(lancamento.categoria)}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500' }}>{lancamento.descricao}</div>
                              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                {lancamento.data}
                              </div>
                            </div>
                          </div>
                        </td>
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
      </div>
    </div>
  );
}