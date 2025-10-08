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
    CategoriaSchema(id=2, nome="Freelance", tipo="renda"),
    CategoriaSchema(id=3, nome="Aluguel", tipo="despesa"),
    CategoriaSchema(id=4, nome="Supermercado", tipo="despesa"),
    CategoriaSchema(id=5, nome="Transporte", tipo="despesa"),
    CategoriaSchema(id=6, nome="Lazer", tipo="despesa"),
    CategoriaSchema(id=7, nome="Assinaturas", tipo="despesa"),
    CategoriaSchema(id=8, nome="Educação", tipo="despesa"),
]


@router.get("/", response_model=List[CategoriaSchema])
def listar_categorias() -> List[CategoriaSchema]:
    """Lista todas as categorias cadastradas."""
    return categorias_db


@router.post("/", response_model=CategoriaSchema, status_code=201)
def criar_categoria(categoria: CategoriaSchema) -> CategoriaSchema:
    """Cria uma nova categoria."""
    # Gera um novo ID automaticamente
    novo_id = max([cat.id for cat in categorias_db], default=0) + 1
    categoria.id = novo_id
    categorias_db.append(categoria)
    return categoria
