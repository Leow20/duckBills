// Serviço local para metas (não existe no backend ainda)
export interface Meta {
  id: number;
  titulo: string;
  valorAtual: number;
  valorMeta: number;
  prazo: string;
  descricao: string;
  icon: string;
  color: string;
}

class MetasService {
  private static readonly STORAGE_KEY = 'duckbills_metas';

  private getMetasFromStorage(): Meta[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(MetasService.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        titulo: 'Viagem para a Europa',
        valorAtual: 7500.00,
        valorMeta: 20000.00,
        prazo: '2026-06-01',
        descricao: 'Viagem de 3 semanas pela Europa',
        icon: '✈️',
        color: '#3b82f6'
      },
      {
        id: 2,
        titulo: 'Macbook Pro Novo',
        valorAtual: 3200.00,
        valorMeta: 15000.00,
        prazo: '2025-12-31',
        descricao: 'Novo laptop para trabalho',
        icon: '💻',
        color: '#6366f1'
      },
      {
        id: 3,
        titulo: 'Reserva de Emergência',
        valorAtual: 12000.00,
        valorMeta: 18000.00,
        prazo: '2025-12-31',
        descricao: '6 meses de gastos essenciais',
        icon: '🛡️',
        color: '#10b981'
      },
      {
        id: 4,
        titulo: 'Curso de Especialização',
        valorAtual: 800.00,
        valorMeta: 5000.00,
        prazo: '2025-11-01',
        descricao: 'MBA em Gestão de Projetos',
        icon: '🎓',
        color: '#f59e0b'
      }
    ];
  }

  private saveMetas(metas: Meta[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MetasService.STORAGE_KEY, JSON.stringify(metas));
    }
  }

  async getMetas(): Promise<Meta[]> {
    return this.getMetasFromStorage();
  }

  async createMeta(meta: Omit<Meta, 'id'>): Promise<Meta> {
    const metas = this.getMetasFromStorage();
    const newMeta: Meta = {
      ...meta,
      id: Date.now()
    };
    
    metas.push(newMeta);
    this.saveMetas(metas);
    
    return newMeta;
  }

  async updateMeta(id: number, updates: Partial<Meta>): Promise<Meta | null> {
    const metas = this.getMetasFromStorage();
    const index = metas.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    metas[index] = { ...metas[index], ...updates };
    this.saveMetas(metas);
    
    return metas[index];
  }

  async deleteMeta(id: number): Promise<boolean> {
    const metas = this.getMetasFromStorage();
    const filteredMetas = metas.filter(m => m.id !== id);
    
    if (filteredMetas.length === metas.length) return false;
    
    this.saveMetas(filteredMetas);
    return true;
  }
}

export const metasService = new MetasService();