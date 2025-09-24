"""
Rotas para gerenciamento de despesas.
"""


from typing import List
from datetime import date
from fastapi import APIRouter, HTTPException
from app.schemas import DespesaSchema

router = APIRouter(prefix="/despesas", tags=["Despesas"])

# Mock database
_despesas_db: List[DespesaSchema] = [
    DespesaSchema(id=1, valor=100.0, data=date(2025, 9, 1), descricao="Supermercado", categoria_id=2, usuario_id=1, recorrente=False),
    DespesaSchema(id=2, valor=50.0, data=date(2025, 9, 5), descricao="Transporte", categoria_id=2, usuario_id=1, recorrente=False),
]


@router.get("/", response_model=List[DespesaSchema])
def listar_despesas() -> List[DespesaSchema]:
    """Lista todas as despesas cadastradas."""
    return _despesas_db


@router.post("/", response_model=DespesaSchema, status_code=201)
def criar_despesa(despesa: DespesaSchema) -> DespesaSchema:
    """Cria uma nova despesa."""
    if any(d.id == despesa.id for d in _despesas_db):
        raise HTTPException(status_code=400, detail="ID de despesa já existe.")
    _despesas_db.append(despesa)
    return despesa
