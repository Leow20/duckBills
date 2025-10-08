import { formatDateToBR } from '../utils/dateUtils';

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

export interface Meta {
  id: number;
  titulo: string;
  valor_atual: number;
  valor_meta: number;
  prazo: string; // ISO date string
  descricao?: string;
  usuario_id: number;
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
        id: 0 // O backend irá gerar o ID automaticamente
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
        id: 0 // O backend irá gerar o ID automaticamente
      }),
    });
  }

  async updateRenda(id: number, renda: Omit<Renda, 'id'>): Promise<Renda> {
    return this.request<Renda>(`/rendas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...renda, id }),
    });
  }

  async deleteRenda(id: number): Promise<void> {
    return this.request<void>(`/rendas/${id}`, {
      method: 'DELETE',
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
        id: 0 // O backend irá gerar o ID automaticamente
      }),
    });
  }

  async updateDespesa(id: number, despesa: Omit<Despesa, 'id'>): Promise<Despesa> {
    return this.request<Despesa>(`/despesas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...despesa, id }),
    });
  }

  async deleteDespesa(id: number): Promise<void> {
    return this.request<void>(`/despesas/${id}`, {
      method: 'DELETE',
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
        id: 0 // O backend irá gerar o ID automaticamente
      }),
    });
  }

  async updateOrcamento(id: number, orcamento: Omit<Orcamento, 'id'>): Promise<Orcamento> {
    return this.request<Orcamento>(`/orcamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...orcamento, id }),
    });
  }

  async deleteOrcamento(id: number): Promise<void> {
    return this.request<void>(`/orcamentos/${id}`, {
      method: 'DELETE',
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
        id: 0 // O backend irá gerar o ID automaticamente
      }),
    });
  }

  // Metas
  async getMetas(): Promise<Meta[]> {
    return this.request<Meta[]>('/metas/');
  }

  async createMeta(meta: Omit<Meta, 'id'>): Promise<Meta> {
    return this.request<Meta>('/metas/', {
      method: 'POST',
      body: JSON.stringify({ 
        ...meta, 
        id: 0 // O backend irá gerar o ID automaticamente
      }),
    });
  }

  async updateMeta(id: number, meta: Omit<Meta, 'id'>): Promise<Meta> {
    return this.request<Meta>(`/metas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...meta, id }),
    });
  }

  async deleteMeta(id: number): Promise<void> {
    return this.request<void>(`/metas/${id}`, {
      method: 'DELETE',
    });
  }

  async adicionarValorMeta(id: number, valor: number): Promise<Meta> {
    return this.request<Meta>(`/metas/${id}/adicionar-valor?valor=${valor}`, {
      method: 'PATCH',
    });
  }

  // Método para buscar lançamentos (rendas + despesas combinadas)
  async getLancamentos(): Promise<Array<{
    id: number;
    originalId: number;
    descricao: string;
    categoria: string;
    categoria_id: number;
    data: string;
    dataOriginal: string;
    valor: number;
    tipo: 'renda' | 'despesa';
    recorrente?: boolean;
  }>> {
    const [rendas, despesas, categorias] = await Promise.all([
      this.getRendas(),
      this.getDespesas(),
      this.getCategorias()
    ]);

    const categoriasMap = new Map(categorias.map(cat => [cat.id, cat.nome]));

    const lancamentos = [
      ...rendas.map(renda => ({
        id: renda.id, // ID real da renda
        originalId: renda.id,
        descricao: renda.descricao || 'Renda sem descrição',
        categoria: categoriasMap.get(renda.categoria_id) || 'Categoria não encontrada',
        categoria_id: renda.categoria_id,
        data: formatDateToBR(renda.data),
        dataOriginal: renda.data,
        valor: renda.valor,
        tipo: 'renda' as const
      })),
      ...despesas.map(despesa => ({
        id: despesa.id + 100000, // Offset grande para evitar conflito de IDs na interface
        originalId: despesa.id,
        descricao: despesa.descricao || 'Despesa sem descrição',
        categoria: categoriasMap.get(despesa.categoria_id) || 'Categoria não encontrada',
        categoria_id: despesa.categoria_id,
        data: formatDateToBR(despesa.data),
        dataOriginal: despesa.data,
        valor: -despesa.valor, // Negativo para despesas
        tipo: 'despesa' as const,
        recorrente: despesa.recorrente
      }))
    ];

    return lancamentos.sort((a, b) => new Date(b.data.split('/').reverse().join('-')).getTime() - new Date(a.data.split('/').reverse().join('-')).getTime());
  }

  // Métodos para edição e exclusão de lançamentos
  async updateLancamento(lancamento: {
    id: number;
    originalId: number;
    tipo: 'renda' | 'despesa';
    descricao: string;
    valor: number;
    data: string;
    categoria_id: number;
    recorrente?: boolean;
  }): Promise<void> {
    if (lancamento.tipo === 'renda') {
      await this.updateRenda(lancamento.originalId, {
        valor: lancamento.valor,
        data: lancamento.data,
        descricao: lancamento.descricao,
        categoria_id: lancamento.categoria_id,
        usuario_id: 1
      });
    } else {
      await this.updateDespesa(lancamento.originalId, {
        valor: lancamento.valor,
        data: lancamento.data,
        descricao: lancamento.descricao,
        categoria_id: lancamento.categoria_id,
        usuario_id: 1,
        recorrente: lancamento.recorrente || false
      });
    }
  }

  async deleteLancamento(originalId: number, tipo: 'renda' | 'despesa'): Promise<void> {
    if (tipo === 'renda') {
      await this.deleteRenda(originalId);
    } else {
      await this.deleteDespesa(originalId);
    }
  }
}

export const apiService = new ApiService();