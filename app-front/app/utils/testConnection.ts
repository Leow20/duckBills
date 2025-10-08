import { apiService } from '../services/api';

export async function testBackendConnection(): Promise<{
  isConnected: boolean;
  message: string;
  data?: any;
}> {
  try {
    // Testa se o backend está respondendo
    const response = await fetch('http://localhost:5000/health');
    
    if (!response.ok) {
      return {
        isConnected: false,
        message: `Backend respondeu com erro: ${response.status}`
      };
    }

    const healthData = await response.json();
    
    // Testa se consegue buscar dados
    const [categorias, rendas, despesas] = await Promise.all([
      apiService.getCategorias(),
      apiService.getRendas(),
      apiService.getDespesas()
    ]);

    return {
      isConnected: true,
      message: 'Conexão com backend estabelecida com sucesso!',
      data: {
        health: healthData,
        stats: {
          categorias: categorias.length,
          rendas: rendas.length,
          despesas: despesas.length,
          totalReceitas: rendas.reduce((sum, r) => sum + r.valor, 0),
          totalDespesas: despesas.reduce((sum, d) => sum + d.valor, 0)
        }
      }
    };

  } catch (error) {
    return {
      isConnected: false,
      message: `Erro ao conectar com o backend: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}