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
        valor=500.0,
        descricao="Aluguel apartamento",
        categoria_id=3,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 1),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=2,
        valor=35.0,
        descricao="Spotify",
        categoria_id=7,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 5),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=3,
        valor=120.0,
        descricao="Netflix",
        categoria_id=7,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 10),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=4,
        valor=3000.0,
        descricao="Salário empresa X",
        categoria_id=1,
        usuario_id=1,
        tipo="renda",
        data_inicio=date(2025, 9, 1),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=5,
        valor=100.0,
        descricao="Internet banda larga",
        categoria_id=3,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 2),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=6,
        valor=250.0,
        descricao="Plano de saúde",
        categoria_id=3,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 3),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=7,
        valor=80.0,
        descricao="Academia",
        categoria_id=6,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 4),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=8,
        valor=200.0,
        descricao="Aula de inglês",
        categoria_id=8,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 6),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=9,
        valor=150.0,
        descricao="Freelance mensal",
        categoria_id=2,
        usuario_id=1,
        tipo="renda",
        data_inicio=date(2025, 9, 7),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=10,
        valor=60.0,
        descricao="Seguro residencial",
        categoria_id=3,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 8),
        frequencia="anual"
    ),
    ContaRecorrenteSchema(
        id=11,
        valor=45.0,
        descricao="Amazon Prime",
        categoria_id=7,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 9),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=12,
        valor=90.0,
        descricao="Plano odontológico",
        categoria_id=3,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 10),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=13,
        valor=400.0,
        descricao="Bolsa de estudos",
        categoria_id=2,
        usuario_id=1,
        tipo="renda",
        data_inicio=date(2025, 9, 11),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=14,
        valor=75.0,
        descricao="Clube de leitura",
        categoria_id=6,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 12),
        frequencia="mensal"
    ),
    ContaRecorrenteSchema(
        id=15,
        valor=180.0,
        descricao="Aula de música",
        categoria_id=8,
        usuario_id=1,
        tipo="despesa",
        data_inicio=date(2025, 9, 13),
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
