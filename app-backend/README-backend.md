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

## Endpoints Principais

### Categorias
- `GET /categorias/` — Lista todas as categorias
- `POST /categorias/` — Cria uma nova categoria

### Despesas
- `GET /despesas/` — Lista todas as despesas
- `POST /despesas/` — Cria uma nova despesa

### Rendas
- `GET /rendas/` — Lista todas as rendas
- `POST /rendas/` — Cria uma nova renda

### Contas Recorrentes
- `GET /contas-recorrentes/` — Lista todas as contas recorrentes
- `POST /contas-recorrentes/` — Cria uma nova conta recorrente

### Orçamentos
- `GET /orcamentos/` — Lista todos os orçamentos
- `POST /orcamentos/` — Cria um novo orçamento

---

## Exemplos de Uso e Chamadas da API

### Listar todas as categorias
**Requisição:**
```bash
curl -X GET http://localhost:8000/categorias/
```
**Resposta:**
```json
[
	{"id": 1, "nome": "Salário", "tipo": "renda"},
	{"id": 2, "nome": "Freelance", "tipo": "renda"},
	...
]
```

### Criar uma nova despesa
**Requisição:**
```bash
curl -X POST http://localhost:8000/despesas/ \
	-H "Content-Type: application/json" \
	-d '{
		"id": 13,
		"valor": 75.0,
		"data": "2025-10-01",
		"descricao": "Padaria",
		"categoria_id": 4,
		"usuario_id": 1,
		"recorrente": false
	}'
```
**Resposta:**
```json
{
	"id": 13,
	"valor": 75.0,
	"data": "2025-10-01",
	"descricao": "Padaria",
	"categoria_id": 4,
	"usuario_id": 1,
	"recorrente": false
}
```

### Listar todas as rendas
**Requisição:**
```bash
curl -X GET http://localhost:8000/rendas/
```
**Resposta:**
```json
[
	{"id": 1, "valor": 3000.0, "data": "2025-09-01", "descricao": "Salário empresa X", "categoria_id": 1, "usuario_id": 1},
	...
]
```

### Criar uma conta recorrente
**Requisição:**
```bash
curl -X POST http://localhost:8000/contas-recorrentes/ \
	-H "Content-Type: application/json" \
	-d '{
		"id": 16,
		"valor": 99.9,
		"descricao": "Disney+",
		"categoria_id": 7,
		"usuario_id": 1,
		"tipo": "despesa",
		"data_inicio": "2025-10-01",
		"frequencia": "mensal"
	}'
```
**Resposta:**
```json
{
	"id": 16,
	"valor": 99.9,
	"descricao": "Disney+",
	"categoria_id": 7,
	"usuario_id": 1,
	"tipo": "despesa",
	"data_inicio": "2025-10-01",
	"frequencia": "mensal"
}
```

### Dicas de Integração
- Sempre envie e espere respostas em JSON.
- Utilize o Swagger em `/docs` para explorar e testar todos os endpoints.
- Para integração com frontends, utilize bibliotecas como axios, fetch, ou qualquer cliente HTTP.

#### Exemplo de chamada com JavaScript (fetch):
```js
fetch('http://localhost:8000/despesas/', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		id: 14,
		valor: 50.0,
		data: '2025-10-02',
		descricao: 'Farmácia',
		categoria_id: 4,
		usuario_id: 1,
		recorrente: false
	})
})
	.then(res => res.json())
	.then(data => console.log(data));
```

---

## Schemas (Modelos de Dados)

### Categoria
```json
{
	"id": 1,
	"nome": "Salário",
	"tipo": "renda" // ou "despesa"
}
```

### Despesa
```json
{
	"id": 1,
	"valor": 120.0,
	"data": "2025-09-01",
	"descricao": "Supermercado mês",
	"categoria_id": 4,
	"usuario_id": 1,
	"recorrente": false
}
```

### Renda
```json
{
	"id": 1,
	"valor": 3000.0,
	"data": "2025-09-01",
	"descricao": "Salário empresa X",
	"categoria_id": 1,
	"usuario_id": 1
}
```

### Conta Recorrente
```json
{
	"id": 1,
	"valor": 500.0,
	"descricao": "Aluguel apartamento",
	"categoria_id": 3,
	"usuario_id": 1,
	"tipo": "despesa", // ou "renda"
	"data_inicio": "2025-09-01",
	"frequencia": "mensal"
}
```

### Orçamento
```json
{
	"id": 1,
	"categoria_id": 4,
	"usuario_id": 1,
	"valor_limite": 800.0,
	"periodo": "mensal"
}
```

---

## Observações
- Todos os endpoints retornam e aceitam dados em JSON.
- Os dados são mockados em memória, sem persistência.
- Para mais exemplos, utilize a documentação interativa em `/docs`.

---

## Contato e Contribuição
- Para dúvidas, sugestões ou contribuições, abra uma issue ou pull request no repositório.
