"""
Rotas para gerenciamento de metas financeiras.
"""

from typing import List
from datetime import date
from fastapi import APIRouter, HTTPException
from app.schemas import MetaSchema

router = APIRouter(prefix="/metas", tags=["Metas"])

# Mock database
_metas_db: List[MetaSchema] = [
    MetaSchema(
        id=1,
        titulo="Viagem para a Europa",
        valor_atual=7500.00,
        valor_meta=20000.00,
        prazo=date(2026, 6, 1),
        descricao="Viagem de 3 semanas pela Europa",
        usuario_id=1
    ),
    MetaSchema(
        id=2,
        titulo="Macbook Pro Novo",
        valor_atual=3200.00,
        valor_meta=15000.00,
        prazo=date(2025, 12, 31),
        descricao="Novo laptop para trabalho",
        usuario_id=1
    ),
    MetaSchema(
        id=3,
        titulo="Reserva de Emergência",
        valor_atual=12000.00,
        valor_meta=18000.00,
        prazo=date(2025, 12, 31),
        descricao="6 meses de gastos essenciais",
        usuario_id=1
    ),
    MetaSchema(
        id=4,
        titulo="Curso de Especialização",
        valor_atual=800.00,
        valor_meta=5000.00,
        prazo=date(2025, 11, 1),
        descricao="MBA em Gestão de Projetos",
        usuario_id=1
    ),
]


@router.get("/", response_model=List[MetaSchema])
def listar_metas() -> List[MetaSchema]:
    """Lista todas as metas cadastradas."""
    return _metas_db


@router.post("/", response_model=MetaSchema, status_code=201)
def criar_meta(meta: MetaSchema) -> MetaSchema:
    """Cria uma nova meta."""
    # Gera um novo ID automaticamente
    novo_id = max([m.id for m in _metas_db], default=0) + 1
    meta.id = novo_id
    _metas_db.append(meta)
    return meta


@router.put("/{meta_id}", response_model=MetaSchema)
def atualizar_meta(meta_id: int, meta_atualizada: MetaSchema) -> MetaSchema:
    """Atualiza uma meta existente."""
    for i, meta in enumerate(_metas_db):
        if meta.id == meta_id:
            meta_atualizada.id = meta_id
            _metas_db[i] = meta_atualizada
            return meta_atualizada
    raise HTTPException(status_code=404, detail="Meta não encontrada.")


@router.patch("/{meta_id}/adicionar-valor")
def adicionar_valor_meta(meta_id: int, valor: float) -> MetaSchema:
    """Adiciona valor ao valor atual de uma meta."""
    if valor <= 0:
        raise HTTPException(status_code=400, detail="O valor deve ser positivo.")
    
    for i, meta in enumerate(_metas_db):
        if meta.id == meta_id:
            _metas_db[i].valor_atual += valor
            return _metas_db[i]
    raise HTTPException(status_code=404, detail="Meta não encontrada.")


@router.delete("/{meta_id}")
def excluir_meta(meta_id: int) -> dict:
    """Exclui uma meta."""
    for i, meta in enumerate(_metas_db):
        if meta.id == meta_id:
            del _metas_db[i]
            return {"message": "Meta excluída com sucesso."}
    raise HTTPException(status_code=404, detail="Meta não encontrada.")