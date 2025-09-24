# -*- coding: utf-8 -*-
"""
Módulo schemas.py

Define os modelos de dados (schemas) utilizados para validação e documentação da API DuckBills.
Inclui representações para Usuário, Categoria, Renda, Despesa, Conta Recorrente e Orçamento.
"""


from datetime import date
from typing import Optional
from pydantic import BaseModel


class UsuarioSchema(BaseModel):
    """Schema para representação de um usuário."""
    id: int
    nome: str
    email: str


class CategoriaSchema(BaseModel):
    """Schema para representação de uma categoria de renda ou despesa."""
    id: int
    nome: str
    tipo: str  # 'renda' ou 'despesa'


class RendaSchema(BaseModel):
    """Schema para representação de uma renda (entrada de dinheiro)."""
    id: int
    valor: float
    data: date
    descricao: Optional[str] = None
    categoria_id: int
    usuario_id: int


class DespesaSchema(BaseModel):
    """Schema para representação de uma despesa (saída de dinheiro)."""
    id: int
    valor: float
    data: date
    descricao: Optional[str] = None
    categoria_id: int
    usuario_id: int
    recorrente: bool = False


class ContaRecorrenteSchema(BaseModel):
    """Schema para contas recorrentes (renda ou despesa automática)."""
    id: int
    valor: float
    descricao: Optional[str] = None
    categoria_id: int
    usuario_id: int
    tipo: str  # 'renda' ou 'despesa'
    data_inicio: date
    frequencia: str  # 'mensal', 'semanal', etc.


class OrcamentoSchema(BaseModel):
    """Schema para definição de orçamento por categoria e período."""
    id: int
    categoria_id: int
    usuario_id: int
    valor_limite: float
    periodo: str  # 'mensal', 'anual'
