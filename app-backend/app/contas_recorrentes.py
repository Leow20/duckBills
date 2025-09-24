"""
Rotas para gerenciamento de contas recorrentes.
"""

from typing import List
from datetime import date
from fastapi import APIRouter, HTTPException
from app.schemas import ContaRecorrenteSchema

router = APIRouter(prefix="/contas-recorrentes", tags=["Contas Recorrentes"])

# Mock database
_contas_recorrentes_db: List[ContaRecorrenteSchema] = [
    ContaRecorrenteSchema(
        id=1,
        valor=120.0,
        descricao="Assinatura Streaming",
        categoria_id=2,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 1),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=2,
        valor=500.0,
        descricao="Aluguel",
        categoria_id=2,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 1),
        frequencia="mensal"
    ),
]


@router.get("/", response_model=List[ContaRecorrenteSchema])
def listar_contas_recorrentes() -> List[ContaRecorrenteSchema]:
    """Lista todas as contas recorrentes cadastradas."""
    return _contas_recorrentes_db


@router.post("/", response_model=ContaRecorrenteSchema, status_code=201)
def criar_conta_recorrente(conta: ContaRecorrenteSchema) -> ContaRecorrenteSchema:
    """Cria uma nova conta recorrente."""
    if any(c.id == conta.id for c in _contas_recorrentes_db):
        raise HTTPException(status_code=400, detail="ID de conta recorrente já existe.")
    _contas_recorrentes_db.append(conta)
    return conta
