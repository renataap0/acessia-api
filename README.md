# AcessIA API

API REST da plataforma AcessIA, uma solucao para gestao de acessibilidade,
inclusao e apoio a lideranca. A API permite registrar barreiras enfrentadas por
colaboradores, organizar solicitacoes, indicar solucoes, registrar
encaminhamentos, feedbacks, arquivos, logs de IA e indicadores para gestores e RH.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2/promise
- dotenv
- cors
- nodemon

## Como rodar o projeto

1. Crie o banco MySQL
2. Execute o arquivo `database/schema.sql`
3. Execute o arquivo `database/seed.sql`
4. Configure o `.env`
5. Rode `npm install`
6. Rode `npm run dev`

## Estrutura de pastas

```txt
acessia-api/
  .env.example
  .gitignore
  package.json
  README.md
  src/
    app.js
    server.js
    config/
      db.js
      env.js
    controllers/
      arquivosController.js
      encaminhamentosController.js
      feedbacksController.js
      iaController.js
      logsIaController.js
      relatoriosController.js
      solicitacoesController.js
      solicitacoesRestController.js
      solucaoRelacionadaController.js
      solucoesController.js
      solucoesRestController.js
      solucoesSolicitacoesController.js
      usuariosController.js
      usuariosRestController.js
    middlewares/
      asyncHandler.js
      errorHandler.js
      notFound.js
      validate.js
    queries/
      arquivosQueries.js
      encaminhamentosQueries.js
      feedbacksQueries.js
      logsIaQueries.js
      queryHelpers.js
      relatoriosQueries.js
      solicitacoesQueries.js
      solucaoRelacionadaQueries.js
      solucoesQueries.js
      solucoesSolicitacoesQueries.js
      usuariosQueries.js
    routes/
      arquivosRoutes.js
      encaminhamentosRoutes.js
      feedbacksRoutes.js
      iaRoutes.js
      index.js
      logsIaRoutes.js
      relatoriosRoutes.js
      solicitacoesRoutes.js
      solicitacoesRouters.js
      solucaoRelacionadaRoutes.js
      solucoesRoutes.js
      solucoesSolicitacoesRoutes.js
      usuariosRoutes.js
    services/
      arquivosService.js
      encaminhamentosService.js
      feedbacksService.js
      iaService.js
      logsIaService.js
      relatoriosService.js
      solicitacoesService.js
      solucaoRelacionadaService.js
      solucoesService.js
      solucoesSolicitacoesService.js
      usuariosService.js
    utils/
      AppError.js
      normalize.js
```

## Instalacao

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure o banco no `.env`:

```env
PORT=3007
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=acessia
```

## Execucao

Ambiente de desenvolvimento:

```bash
npm run dev
```

Ambiente normal:

```bash
npm start
```

Base URL local:

```txt
http://localhost:3007/api
```

## Tabelas esperadas

A API usa SQL direto com as tabelas ja existentes:

- usuarios
- solicitacoes
- solucoes
- encaminhamento
- feedbacks
- arquivos
- logs_ia
- solucoes_has_solicitacoes
- solucao_relacionada

Os nomes de colunas seguem o padrao ja usado no projeto, por exemplo
`idusuarios`, `idsolicitacoes`, `idsolucoes`,
`usuarios_idusuarios`, `solicitacoes_idsolicitacoes` e
`solucoes_idsolucoes`.

Os arquivos `usuariosController.js`, `solicitacoesController.js`,
`solucoesController.js` e `solicitacoesRouters.js` ficaram como stubs de
compatibilidade para o esqueleto inicial. A implementacao nova esta nos arquivos
`*RestController.js` e em `solicitacoesRoutes.js`.

## Principais rotas

### Usuarios

```txt
POST   /api/usuarios
GET    /api/usuarios
GET    /api/usuarios/:id
PUT    /api/usuarios/:id
```

Body para criar:

```json
{
  "nome": "Ana Silva",
  "email": "ana@empresa.com",
  "tipo_usuario": "colaborador",
  "unidade": "Sao Paulo",
  "cargo": "Analista"
}
```

Body para atualizar:

```json
{
  "cargo": "Analista Senior",
  "unidade": "Remoto"
}
```

### Solicitacoes

```txt
POST   /api/solicitacoes
GET    /api/solicitacoes
GET    /api/solicitacoes/:id
PATCH  /api/solicitacoes/:id/status
PATCH  /api/solicitacoes/:id/urgencia
PATCH  /api/solicitacoes/:id/usuario
```

Filtros:

```txt
GET /api/solicitacoes?tipo_barreira=comunicacao
GET /api/solicitacoes?area_responsavel=RH
GET /api/solicitacoes?status=aberta
GET /api/solicitacoes?usuarios_idusuarios=1
```

Body para criar:

```json
{
  "canal": "painel_colaborador",
  "tipo_barreira": "comunicacao",
  "urgencia": "media",
  "area_responsavel": "Comunicacao interna",
  "status": "aberta",
  "precisa_profissional": false,
  "confianca_ia": 0.79,
  "classificacao_ia_json": {
    "origem": "simulador_regras_v1",
    "observacao": "Classificacao inicial"
  },
  "usuarios_idusuarios": 1
}
```

Body para atualizar status:

```json
{
  "status": "em_andamento"
}
```

Body para classificar urgencia:

```json
{
  "urgencia": "alta"
}
```

Body para associar usuario:

```json
{
  "usuarios_idusuarios": 2
}
```

### Solucoes

```txt
POST   /api/solucoes
GET    /api/solucoes
GET    /api/solucoes/:id
PUT    /api/solucoes/:id
PATCH  /api/solucoes/:id/ativo
```

Filtros:

```txt
GET /api/solucoes?tipo_barreira=mobilidade
GET /api/solucoes?ativo=1
```

Body para criar:

```json
{
  "titulo": "Reunioes com legenda",
  "descricao_problema": "Colaborador nao consegue acompanhar reunioes sem apoio visual.",
  "solucao_imediata": "Ativar legenda automatica e enviar resumo por escrito.",
  "tipo_barreira": "comunicacao",
  "publico_indicado": "colaboradores com barreiras auditivas ou de processamento",
  "area_responsavel": "Comunicacao interna",
  "ativo": true
}
```

Body para marcar ativa ou inativa:

```json
{
  "ativo": false
}
```

### Encaminhamentos

```txt
POST   /api/encaminhamentos
GET    /api/encaminhamentos/solicitacao/:solicitacaoId
PATCH  /api/encaminhamentos/:id
```

Body:

```json
{
  "solicitacoes_idsolicitacoes": 1,
  "profissional_responsavel": "Carla Mendes",
  "observacao": "Encaminhar para avaliacao de ergonomia."
}
```

### Feedbacks

```txt
POST   /api/feedbacks
GET    /api/feedbacks/solicitacao/:solicitacaoId
```

Body:

```json
{
  "solicitacoes_idsolicitacoes": 1,
  "usuarios_idusuarios": 1,
  "nota": 5,
  "comentario": "A solucao ajudou nas reunioes semanais."
}
```

### Arquivos

```txt
POST   /api/arquivos
GET    /api/arquivos/solicitacao/:solicitacaoId
```

Body:

```json
{
  "solicitacoes_idsolicitacoes": 1,
  "usuarios_idusuarios": 1,
  "nome_original": "evidencia-reuniao.pdf",
  "caminho_arquivo": "/uploads/evidencia-reuniao.pdf",
  "mime_type": "application/pdf",
  "tamanho_bytes": 240000
}
```

### Logs de IA

```txt
POST   /api/logs-ia
GET    /api/logs-ia/solicitacao/:solicitacaoId
```

Body:

```json
{
  "solicitacoes_idsolicitacoes": 1,
  "entrada": "Nao consigo acompanhar reuniao sem legenda.",
  "saida": {
    "tipo_barreira": "comunicacao",
    "urgencia": "media"
  },
  "modelo": "simulador_regras_v1",
  "confianca": 0.79
}
```

### Vinculo entre solucoes e solicitacoes

```txt
POST   /api/solucoes-solicitacoes
GET    /api/solucoes-solicitacoes/solicitacao/:solicitacaoId
```

Body:

```json
{
  "solucoes_idsolucoes": 1,
  "solicitacoes_idsolicitacoes": 1
}
```

### Solucao relacionada

```txt
POST   /api/solucao-relacionada
GET    /api/solucao-relacionada/solicitacao/:solicitacaoId
```

Body:

```json
{
  "solicitacoes_idsolicitacoes": 1,
  "solucoes_idsolucoes": 1,
  "similaridade": 0.88,
  "aplicacao_solucao": true
}
```

### Triagem inteligente simulada

```txt
POST /api/ia/triagem
```

Body:

```json
{
  "texto": "Tenho dificuldade em reuniao porque nao ha legenda e o audio fica ruim."
}
```

Resposta esperada:

```json
{
  "tipo_barreira": "comunicacao",
  "urgencia": "media",
  "area_responsavel": "Comunicacao interna",
  "precisa_profissional": false,
  "confianca_ia": 0.79,
  "classificacao_ia_json": {
    "origem": "simulador_regras_v1",
    "texto_analisado": "Tenho dificuldade em reuniao porque nao ha legenda e o audio fica ruim.",
    "regras_consideradas": [],
    "gerado_em": "2026-04-15T00:00:00.000Z"
  }
}
```

Regras iniciais:

- legenda, audio, reuniao: comunicacao
- escada, rampa, locomocao: mobilidade
- barulho, luz, sobrecarga: sensorial
- instrucoes, texto longo, organizacao: cognitiva_organizacional
- sistema, site, leitor de tela, contraste: acesso_digital
- preconceito, piada, constrangimento: atitudinal

### Relatorios e indicadores

```txt
GET /api/relatorios/indicadores
```

Resposta:

```json
{
  "sucesso": true,
  "dados": {
    "total_solicitacoes": 10,
    "solicitacoes_por_status": [],
    "solicitacoes_por_barreira": [],
    "solicitacoes_por_area": [],
    "solucoes_ativas": 8,
    "solucoes_inativas": 2
  }
}
```

## Padrao de resposta

Sucesso:

```json
{
  "sucesso": true,
  "dados": {}
}
```

Erro:

```json
{
  "sucesso": false,
  "erro": {
    "mensagem": "Campos obrigatorios ausentes.",
    "codigo": null,
    "detalhes": {
      "campos": ["email"]
    }
  }
}
```

## Observacoes para evolucao com IA real

A camada `src/services/iaService.js` concentra a triagem simulada. Para integrar
um provedor de IA futuramente, substitua ou complemente esse service mantendo o
contrato da rota `POST /api/ia/triagem`. Os logs podem ser persistidos em
`logs_ia` pela rota `POST /api/logs-ia`.

