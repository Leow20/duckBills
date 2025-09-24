"""
Rotas para gerenciamento de orçamentos.
"""

from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas import OrcamentoSchema

router = APIRouter(prefix="/orcamentos", tags=["Orçamentos"])

# Mock database
_orcamentos_db: List[OrcamentoSchema] = [
    OrcamentoSchema(id=1, categoria_id=2, usuario_id=1, valor_limite=1000.0, periodo="mensal"),
    OrcamentoSchema(id=2, categoria_id=1, usuario_id=1, valor_limite=5000.0, periodo="anual"),
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
