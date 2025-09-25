
# DuckBills API Backend - Documentação

## Visão Geral

DuckBills é uma API RESTful para controle financeiro pessoal, permitindo o cadastro e consulta de rendas, despesas, contas recorrentes, orçamentos e categorias. Ideal para integração com frontends web/mobile.

---

## Instalação e Configuração

1. **Clone o repositório:**
	 ```bash
	 git clone https://github.com/Leow20/duckBills.git
	 cd duckBills
	 ```
2. **Crie e ative o ambiente virtual:**
	 ```bash
	 python3 -m venv venv
	 source venv/bin/activate
	 ```
3. **Instale as dependências:**
	 ```bash
	 pip install -r requirements.txt
	 ```
4. **Execute a API:**
	 ```bash
	 cd app-backend
	 uvicorn app.main:app --reload
	 ```
	 Acesse a documentação interativa em: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Estrutura de Pastas

```
duckBills/
├── app-backend/
│   └── app/
│       ├── main.py              # Inicialização da API FastAPI
│       ├── schemas.py           # Schemas Pydantic (modelos de dados)
│       ├── categorias.py        # Rotas de categorias
│       ├── despesas.py          # Rotas de despesas
│       ├── rendas.py            # Rotas de rendas
│       ├── contas_recorrentes.py# Rotas de contas recorrentes
│       ├── orcamentos.py        # Rotas de orçamentos
│       └── __init__.py          # Torna o diretório um pacote Python
├── requirements.txt             # Dependências do projeto
└── ...
```

---

# DuckBills - Documentação

Este repositório possui documentação separada para backend e frontend:

- [Backend - API de Controle Financeiro](app-backend/README-backend.md)
- [Frontend - Interface Web](app-front/README-frontend.md)

Consulte o README correspondente para instruções de instalação, exemplos de uso, integração e detalhes de cada parte do sistema.
- `POST /despesas/` — Cria uma nova despesa
