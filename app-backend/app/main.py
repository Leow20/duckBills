"""
Módulo principal da API DuckBills.

Inicializa a aplicação FastAPI, configura CORS e inclui as rotas principais do sistema de controle financeiro.
"""


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.categorias import router as categorias_router
from app.despesas import router as despesas_router
from app.rendas import router as rendas_router
from app.contas_recorrentes import router as contas_recorrentes_router
from app.orcamentos import router as orcamentos_router
from app.metas import router as metas_router

app = FastAPI(
    title="DuckBills API",
    description="API para gerenciamento financeiro pessoal (MVP)",
    version="0.1.0"
)

# CORS para facilitar integração com frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas de categorias
app.include_router(categorias_router)

# Inclui as rotas de despesas
app.include_router(despesas_router)

# Inclui as rotas de rendas
app.include_router(rendas_router)

# Inclui as rotas de contas recorrentes
app.include_router(contas_recorrentes_router)

# Inclui as rotas de orçamentos
app.include_router(orcamentos_router)

# Inclui as rotas de metas
app.include_router(metas_router)


@app.get("/health", tags=["Health"])
def health_check():
    """Endpoint de verificação de saúde da API (health check)."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
