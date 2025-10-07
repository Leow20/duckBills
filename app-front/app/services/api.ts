const API_BASE_URL = 'http://localhost:5000';

// Interfaces baseadas nos schemas do backend
export interface Categoria {
  id: number;
  nome: string;
  tipo: 'renda' | 'despesa';
}

export interface Renda {
  id: number;
  valor: number;
  data: string; // ISO date string
  descricao?: string;
  categoria_id: number;
  usuario_id: number;
}

export interface Despesa {
  id: number;
  valor: number;
  data: string; // ISO date string
  descricao?: string;
  categoria_id: number;
  usuario_id: number;
  recorrente: boolean;
}

export interface Orcamento {
  id: number;
  categoria_id: number;
  usuario_id: number;
  valor_limite: number;
  periodo: string;
}

export interface ContaRecorrente {
  id: number;
  valor: number;
  descricao?: string;
  categoria_id: number;
  usuario_id: number;
  tipo: 'renda' | 'despesa';
  data_inicio: string;
  frequencia: string;
}

// Funções para comunicação com a API
class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Categorias
  async getCategorias(): Promise<Categoria[]> {
    return this.request<Categoria[]>('/categorias/');
  }

  async createCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    return this.request<Categoria>('/categorias/', {
      method: 'POST',
      body: JSON.stringify({ 
        ...categoria, 
        id: Date.now() // Temporary ID generation
      }),
    });
  }

  // Rendas
  async getRendas(): Promise<Renda[]> {
    return this.request<Renda[]>('/rendas/');
  }

  async createRenda(renda: Omit<Renda, 'id'>): Promise<Renda> {
    return this.request<Renda>('/rendas/', {
      method: 'POST',
      body: JSON.stringify({ 
        ...renda, 
        id: Date.now() // Temporary ID generation
      }),
    });
  }

  // Despesas
  async getDespesas(): Promise<Despesa[]> {
    return this.request<Despesa[]>('/despesas/');
  }

  async createDespesa(despesa: Omit<Despesa, 'id'>): Promise<Despesa> {
    return this.request<Despesa>('/despesas/', {
      method: 'POST',
      body: JSON.stringify({ 
        ...despesa, 
        id: Date.now() // Temporary ID generation
      }),
    });
  }

  // Orçamentos
  async getOrcamentos(): Promise<Orcamento[]> {
    return this.request<Orcamento[]>('/orcamentos/');
  }

  async createOrcamento(orcamento: Omit<Orcamento, 'id'>): Promise<Orcamento> {
    return this.request<Orcamento>('/orcamentos/', {
      method: 'POST',
      body: JSON.stringify({ 
        ...orcamento, 
        id: Date.now() // Temporary ID generation
      }),
    });
  }

  // Contas Recorrentes
  async getContasRecorrentes(): Promise<ContaRecorrente[]> {
    return this.request<ContaRecorrente[]>('/contas-recorrentes/');
  }

  async createContaRecorrente(conta: Omit<ContaRecorrente, 'id'>): Promise<ContaRecorrente> {
    return this.request<ContaRecorrente>('/contas-recorrentes/', {
      method: 'POST',
      body: JSON.stringify({ 
        ...conta, 
        id: Date.now() // Temporary ID generation
      }),
    });
  }

  // Método para buscar lançamentos (rendas + despesas combinadas)
  async getLancamentos(): Promise<Array<{
    id: number;
    descricao: string;
    categoria: string;
    data: string;
    valor: number;
    tipo: 'renda' | 'despesa';
  }>> {
    const [rendas, despesas, categorias] = await Promise.all([
      this.getRendas(),
      this.getDespesas(),
      this.getCategorias()
    ]);

    const categoriasMap = new Map(categorias.map(cat => [cat.id, cat.nome]));

    const lancamentos = [
      ...rendas.map(renda => ({
        id: renda.id,
        descricao: renda.descricao || 'Renda sem descrição',
        categoria: categoriasMap.get(renda.categoria_id) || 'Categoria não encontrada',
        data: new Date(renda.data).toLocaleDateString('pt-BR'),
        valor: renda.valor,
        tipo: 'renda' as const
      })),
      ...despesas.map(despesa => ({
        id: despesa.id + 10000, // Offset para evitar conflito de IDs
        descricao: despesa.descricao || 'Despesa sem descrição',
        categoria: categoriasMap.get(despesa.categoria_id) || 'Categoria não encontrada',
        data: new Date(despesa.data).toLocaleDateString('pt-BR'),
        valor: -despesa.valor, // Negativo para despesas
        tipo: 'despesa' as const
      }))
    ];

    return lancamentos.sort((a, b) => new Date(b.data.split('/').reverse().join('-')).getTime() - new Date(a.data.split('/').reverse().join('-')).getTime());
  }
}

export const apiService = new ApiService();