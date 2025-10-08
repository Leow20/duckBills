"""
Rotas para gerenciamento de rendas.
"""

from typing import List
from datetime import date
from fastapi import APIRouter, HTTPException
from app.schemas import RendaSchema

router = APIRouter(prefix="/rendas", tags=["Rendas"])

# Mock database
_rendas_db: List[RendaSchema] = [
    RendaSchema(id=1, valor=3000.0, data=date(2025, 9, 1), descricao="Salário empresa X", categoria_id=1, usuario_id=1),
    RendaSchema(id=2, valor=800.0, data=date(2025, 9, 10), descricao="Projeto site", categoria_id=2, usuario_id=1),
    RendaSchema(id=3, valor=150.0, data=date(2025, 9, 15), descricao="Aula particular", categoria_id=2, usuario_id=1),
    RendaSchema(id=4, valor=100.0, data=date(2025, 9, 20), descricao="Venda de item usado", categoria_id=2, usuario_id=1),
    RendaSchema(id=5, valor=400.0, data=date(2025, 9, 25), descricao="Bolsa de estudos", categoria_id=2, usuario_id=1),
    RendaSchema(id=6, valor=200.0, data=date(2025, 9, 28), descricao="Restituição imposto", categoria_id=2, usuario_id=1),
    RendaSchema(id=7, valor=250.0, data=date(2025, 9, 30), descricao="Prêmio concurso", categoria_id=2, usuario_id=1),
    RendaSchema(id=8, valor=120.0, data=date(2025, 10, 2), descricao="Venda de livro", categoria_id=2, usuario_id=1),
]


@router.get("/", response_model=List[RendaSchema])
def listar_rendas() -> List[RendaSchema]:
    """Lista todas as rendas cadastradas."""
    return _rendas_db


@router.post("/", response_model=RendaSchema, status_code=201)
def criar_renda(renda: RendaSchema) -> RendaSchema:
    """Cria uma nova renda."""
    # Gera um novo ID automaticamente
    novo_id = max([r.id for r in _rendas_db], default=0) + 1
    renda.id = novo_id
    _rendas_db.append(renda)
    return renda


@router.put("/{renda_id}", response_model=RendaSchema)
def atualizar_renda(renda_id: int, renda_atualizada: RendaSchema) -> RendaSchema:
    """Atualiza uma renda existente."""
    for i, renda in enumerate(_rendas_db):
        if renda.id == renda_id:
            renda_atualizada.id = renda_id
            _rendas_db[i] = renda_atualizada
            return renda_atualizada
    raise HTTPException(status_code=404, detail="Renda não encontrada.")


@router.delete("/{renda_id}")
def excluir_renda(renda_id: int) -> dict:
    """Exclui uma renda."""
    for i, renda in enumerate(_rendas_db):
        if renda.id == renda_id:
            del _rendas_db[i]
            return {"message": "Renda excluída com sucesso."}
    raise HTTPException(status_code=404, detail="Renda não encontrada.")
