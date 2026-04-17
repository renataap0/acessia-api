# AcessIA API

API Node.js + Express + MySQL (`mysql2/promise`) para gestao de acessibilidade
organizacional. A implementacao usa SQL puro e mantem a organizacao em
`routes`, `controllers`, `services` e `queries`.

## Rodar

```bash
npm install
npm run dev
```

Base local:

```txt
http://localhost:3007/api
```

Configure o `.env` com o banco ja existente:

```env
PORT=3007
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=acessia
```

## Rotas Principais

```txt
POST /api/solicitacoes
GET  /api/solicitacoes
GET  /api/solicitacoes/:id
PUT  /api/solicitacoes/:id

POST /api/ia/classificar

GET  /api/dashboard/resumo
GET  /api/dashboard/barreiras
GET  /api/dashboard/tempo-medio

POST /api/solucoes
GET  /api/solucoes
GET  /api/solucoes/:id
PUT  /api/solucoes/:id

POST /api/match/avaliar
GET  /api/match
GET  /api/match/:id
```

## Solicitacao

Ao criar uma solicitacao, a API chama a triagem por regras, salva
`classificacao_ia_json`, registra log de IA e vincula solucoes ativas
compativeis quando existirem.

```json
{
  "usuarios_idusuarios": 1,
  "canal": "web",
  "descricao_dificuldade": "Nao consigo acompanhar reunioes sem legenda.",
  "descricao_original": "Reuniao sem legenda",
  "contexto_problema": "Reunioes semanais por video.",
  "impacto_trabalho": "Perco decisoes e proximos passos.",
  "preferencia_comunicacao": "texto",
  "apoio_imediato": true,
  "urgencia": "alta",
  "prioridade": "alta",
  "sla_resposta_horas": 4,
  "sla_resolucao_horas": 24
}
```

## Triagem IA

```json
{
  "texto": "O portal nao funciona com leitor de tela e nao consigo registrar o ponto.",
  "contexto": "Sistema interno de RH"
}
```

Retorna:

```json
{
  "sucesso": true,
  "dados": {
    "tipo_barreira": "digital",
    "prioridade": "baixa",
    "area_responsavel": "Tecnologia da informacao",
    "precisa_profissional": false,
    "confianca_ia": 0.95,
    "acao_imediata": "Disponibilizar canal alternativo acessivel enquanto o sistema e avaliado por tecnologia."
  }
}
```

## Solucao

```json
{
  "solucao_provisoria": "Ativar legenda automatica.",
  "contexto_problema": "Reunioes sem recurso de acessibilidade.",
  "urgencia": "alta",
  "tipo_barreira": "comunicacao",
  "acao_recomendada": "Ativar legenda e enviar pauta antes da reuniao.",
  "area_responsavel": "TI",
  "ativo": true,
  "solucao_estrutural": "Padronizar reunioes acessiveis.",
  "custo_estimado": 150.0,
  "prazo_estimado_dias": 7
}
```

## Match

Com objetos:

```json
{
  "perfil_funcional": {
    "habilidades_profissionais": "Organizacao, planilhas, atendimento interno",
    "experiencias_anteriores": "Assistente administrativo",
    "facilidades_no_ambiente": "Ambiente calmo e rotina clara",
    "preferencias_de_comunicacao": "Texto objetivo",
    "dificuldades_encontradas": "Dificuldade com instrucoes ambiguas",
    "necessidades_de_adaptacao": "Checklist visual",
    "barreiras_impactantes": "organizacional",
    "tipo_de_apoio_necessario": "Orientacao estruturada"
  },
  "vaga": {
    "titulo": "Assistente Administrativo",
    "area": "Administrativo",
    "exigencias_do_cargo": "Organizacao, planilhas, comunicacao interna",
    "rotina_da_funcao": "Rotina estruturada",
    "ambiente_de_trabalho": "Escritorio interno",
    "ferramentas_utilizadas": "Planilhas, sistema interno, email",
    "barreiras_potenciais": "organizacional",
    "possibilidade_de_adaptacao": "Alta possibilidade de adaptacao"
  }
}
```

Com IDs, a avaliacao tambem e persistida em `matches`:

```json
{
  "perfil_funcional_id": 1,
  "vaga_id": 1
}
```

Resposta:

```json
{
  "sucesso": true,
  "dados": {
    "pontuacao_compatibilidade": 88,
    "areas_recomendadas": ["Administrativo", "Assistente Administrativo"],
    "adaptacoes_recomendadas": ["Criar checklist, rotina clara, prioridades explicitas e acompanhamento inicial."],
    "riscos": [],
    "justificativa": "Compatibilidade calculada por termos profissionais em comum, barreiras de risco e possibilidade de adaptacao da vaga."
  }
}
```

O match e apenas orientativo e nunca exclui automaticamente uma pessoa de vagas.

## Dashboard

As rotas usam `COUNT`, `AVG` e `GROUP BY`:

```txt
GET /api/dashboard/resumo
GET /api/dashboard/barreiras
GET /api/dashboard/tempo-medio
```

## Padrao de Erro

```json
{
  "sucesso": false,
  "erro": {
    "mensagem": "Campos obrigatorios ausentes.",
    "codigo": null,
    "detalhes": {
      "campos": ["descricao_dificuldade"]
    }
  }
}
```
