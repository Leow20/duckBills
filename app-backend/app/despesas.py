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
    DespesaSchema(id=1, valor=120.0, data=date(2025, 9, 1), descricao="Supermercado mês", categoria_id=4, usuario_id=1, recorrente=False),
    DespesaSchema(id=2, valor=50.0, data=date(2025, 9, 5), descricao="Uber ida trabalho", categoria_id=5, usuario_id=1, recorrente=False),
    DespesaSchema(id=3, valor=500.0, data=date(2025, 9, 1), descricao="Aluguel apartamento", categoria_id=3, usuario_id=1, recorrente=True),
    DespesaSchema(id=4, valor=60.0, data=date(2025, 9, 10), descricao="Cinema com amigos", categoria_id=6, usuario_id=1, recorrente=False),
    DespesaSchema(id=5, valor=35.0, data=date(2025, 9, 12), descricao="Spotify", categoria_id=7, usuario_id=1, recorrente=True),
    DespesaSchema(id=6, valor=200.0, data=date(2025, 9, 15), descricao="Curso online Python", categoria_id=8, usuario_id=1, recorrente=False),
    DespesaSchema(id=7, valor=80.0, data=date(2025, 9, 18), descricao="Academia", categoria_id=6, usuario_id=1, recorrente=True),
    DespesaSchema(id=8, valor=100.0, data=date(2025, 9, 20), descricao="Internet", categoria_id=3, usuario_id=1, recorrente=True),
    DespesaSchema(id=9, valor=45.0, data=date(2025, 9, 22), descricao="Amazon Prime", categoria_id=7, usuario_id=1, recorrente=True),
    DespesaSchema(id=10, valor=90.0, data=date(2025, 9, 25), descricao="Plano odontológico", categoria_id=3, usuario_id=1, recorrente=True),
    DespesaSchema(id=11, valor=75.0, data=date(2025, 9, 27), descricao="Clube de leitura", categoria_id=6, usuario_id=1, recorrente=True),
    DespesaSchema(id=12, valor=180.0, data=date(2025, 9, 29), descricao="Aula de música", categoria_id=8, usuario_id=1, recorrente=True),
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
