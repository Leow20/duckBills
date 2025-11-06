"""
Rotas para gerenciamento de login.
"""

from typing import List
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter(prefix="/login", tags=["Login"])

# Define o schema para os dados de login
class LoginSchema(BaseModel):
    email: str
    senha: str

# Rota para realizar login
@router.post("/", response_model=dict)
def fazer_login(dados: LoginSchema):
    """Realiza o login com base no e-mail e senha fornecidos."""
    email_fixo = "lori@duckbills.com"
    senha_fixa = "loriOMelhorProfessor+5P0nt0s"

    if dados.email != email_fixo:
        raise HTTPException(status_code=401, detail="E-mail inválido")

    if dados.senha != senha_fixa:
        raise HTTPException(status_code=401, detail="Senha inválida")

    return JSONResponse(status_code=200, content={"message": "Login realizado com sucesso!"})