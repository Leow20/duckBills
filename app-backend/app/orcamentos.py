"""
Rotas para gerenciamento de orçamentos.
"""

from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas import OrcamentoSchema

router = APIRouter(prefix="/orcamentos", tags=["Orçamentos"])

# Mock database
_orcamentos_db: List[OrcamentoSchema] = [
    OrcamentoSchema(id=1, categoria_id=4, usuario_id=1, valor_limite=800.0, periodo="mensal"),
    OrcamentoSchema(id=2, categoria_id=5, usuario_id=1, valor_limite=300.0, periodo="mensal"),
    OrcamentoSchema(id=3, categoria_id=6, usuario_id=1, valor_limite=200.0, periodo="mensal"),
    OrcamentoSchema(id=4, categoria_id=7, usuario_id=1, valor_limite=100.0, periodo="mensal"),
    OrcamentoSchema(id=5, categoria_id=1, usuario_id=1, valor_limite=5000.0, periodo="anual"),
]


@router.get("/", response_model=List[OrcamentoSchema])
def listar_orcamentos() -> List[OrcamentoSchema]:
    """Lista todos os orçamentos cadastrados."""
    return _orcamentos_db


@router.post("/", response_model=OrcamentoSchema, status_code=201)
def criar_orcamento(orcamento: OrcamentoSchema) -> OrcamentoSchema:
    """Cria um novo orçamento."""
    if any(o.id == orcamento.id for o in _orcamentos_db):
        raise HTTPException(status_code=400, detail="ID de orçamento já existe.")
    _orcamentos_db.append(orcamento)
    return orcamento


@router.put("/{orcamento_id}", response_model=OrcamentoSchema)
def atualizar_orcamento(orcamento_id: int, orcamento_atualizado: OrcamentoSchema) -> OrcamentoSchema:
    """Atualiza um orçamento existente."""
    for i, orcamento in enumerate(_orcamentos_db):
        if orcamento.id == orcamento_id:
            orcamento_atualizado.id = orcamento_id
            _orcamentos_db[i] = orcamento_atualizado
            return orcamento_atualizado
    raise HTTPException(status_code=404, detail="Orçamento não encontrado.")


@router.delete("/{orcamento_id}")
def excluir_orcamento(orcamento_id: int) -> dict:
    """Exclui um orçamento."""
    for i, orcamento in enumerate(_orcamentos_db):
        if orcamento.id == orcamento_id:
            del _orcamentos_db[i]
            return {"message": "Orçamento excluído com sucesso."}
    raise HTTPException(status_code=404, detail="Orçamento não encontrado.")
