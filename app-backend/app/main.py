

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.categorias import router as categorias_router
from app.despesas import router as despesas_router
from app.rendas import router as rendas_router

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


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
