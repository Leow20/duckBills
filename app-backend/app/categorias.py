"""
Rotas para gerenciamento de categorias (renda e despesa).
"""

from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas import CategoriaSchema

router = APIRouter(prefix="/categorias", tags=["Categorias"])

# Mock database
categorias_db: List[CategoriaSchema] = [
    CategoriaSchema(id=1, nome="Salário", tipo="renda"),
    CategoriaSchema(id=2, nome="Aluguel", tipo="despesa"),
]


@router.get("/", response_model=List[CategoriaSchema])
def listar_categorias() -> List[CategoriaSchema]:
    """Lista todas as categorias cadastradas."""
    return categorias_db


@router.post("/", response_model=CategoriaSchema, status_code=201)
def criar_categoria(categoria: CategoriaSchema) -> CategoriaSchema:
    """Cria uma nova categoria."""
    if any(cat.id == categoria.id for cat in categorias_db):
        raise HTTPException(status_code=400, detail="ID de categoria já existe.")
    categorias_db.append(categoria)
    return categoria
