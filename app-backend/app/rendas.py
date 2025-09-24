"""
Rotas para gerenciamento de rendas.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from datetime import date
from app.schemas import RendaSchema

router = APIRouter(prefix="/rendas", tags=["Rendas"])

# Mock database
_rendas_db: List[RendaSchema] = [
    RendaSchema(id=1, valor=3000.0, data=date(2025, 9, 1), descricao="Salário", categoria_id=1, usuario_id=1),
    RendaSchema(id=2, valor=200.0, data=date(2025, 9, 10), descricao="Freelance", categoria_id=1, usuario_id=1),
]


@router.get("/", response_model=List[RendaSchema])
def listar_rendas() -> List[RendaSchema]:
    """Lista todas as rendas cadastradas."""
    return _rendas_db


@router.post("/", response_model=RendaSchema, status_code=201)
def criar_renda(renda: RendaSchema) -> RendaSchema:
    """Cria uma nova renda."""
    if any(r.id == renda.id for r in _rendas_db):
        raise HTTPException(status_code=400, detail="ID de renda já existe.")
    _rendas_db.append(renda)
    return renda
