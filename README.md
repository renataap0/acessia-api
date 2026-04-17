# AcessIA API

API REST da plataforma AcessIA para acessibilidade, inclusao e performance
organizacional. A API registra demandas vindas por app, web e totem, classifica
barreiras, consulta solucoes validadas, apoia gestores/RH com indicadores e
calcula match orientativo entre perfil funcional e vagas/cargos.

## Stack

- Node.js
- Express
- MySQL
- mysql2/promise
- SQL puro, sem ORM

## Como Rodar

```bash
npm install
```

Configure o `.env`:

```env
PORT=3007
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=acessia
```

Crie o banco e dados iniciais:

```bash
mysql -u root -p < src/database/schema.sql
mysql -u root -p acessia < src/database/seed.sql
```

Inicie a API:

```bash
npm run dev
```

Base local:

```txt
http://localhost:3007/api
```

## Tipos Aceitos

Tipos de barreira:

```txt
comunicacao, mobilidade, sensorial, atitudinal, digital, organizacional
```

Canais:

```txt
app, web, totem
```

Urgencias/prioridades:

```txt
baixa, media, alta, critica
```

Status de solicitacao:

```txt
aberta, em_triagem, em_andamento, encaminhada, resolvida, concluida, cancelada
```

## Rotas

### Usuarios

```txt
POST /api/usuarios
GET  /api/usuarios
GET  /api/usuarios/:id
PUT  /api/usuarios/:id
```

### Solicitacoes

```txt
POST  /api/solicitacoes
GET   /api/solicitacoes
GET   /api/solicitacoes/:id
PUT   /api/solicitacoes/:id
PATCH /api/solicitacoes/:id/status
PATCH /api/solicitacoes/:id/urgencia
PATCH /api/solicitacoes/:id/usuario
```

Filtros:

```txt
GET /api/solicitacoes?canal=totem
GET /api/solicitacoes?tipo_barreira=digital
GET /api/solicitacoes?area_responsavel=RH
GET /api/solicitacoes?status=aberta
```

Body:

```json
{
  "usuarios_idusuarios": 1,
  "canal": "web",
  "tipo_barreira": "comunicacao",
  "dificuldade_encontrada": "Nao consigo acompanhar reunioes sem legenda.",
  "contexto": "Reunioes semanais por video.",
  "impacto_trabalho": "Perco decisoes e proximos passos.",
  "urgencia": "alta",
  "preferencia_comunicacao": "texto",
  "necessidade_apoio_imediato": false,
  "area_responsavel": "Comunicacao interna",
  "status": "aberta",
  "classificacao_ia_json": {
    "tipo_barreira": "comunicacao",
    "prioridade": "alta"
  }
}
```

### Triagem Inteligente

```txt
POST /api/ia/classificar
POST /api/ia/triagem
```

Body:

```json
{
  "texto": "O portal nao funciona com leitor de tela e nao consigo registrar o ponto.",
  "metadados": {
    "canal": "app",
    "urgencia": "alta"
  }
}
```

Resposta:

```json
{
  "sucesso": true,
  "dados": {
    "tipo_barreira": "digital",
    "prioridade": "alta",
    "area_responsavel": "Tecnologia da informacao",
    "precisa_profissional": false,
    "confianca_ia": 0.65,
    "acao_imediata_sugerida": "Disponibilizar canal alternativo acessivel enquanto o sistema e avaliado por tecnologia.",
    "classificacao_ia_json": {}
  }
}
```

### Solucoes

```txt
POST  /api/solucoes
GET   /api/solucoes
GET   /api/solucoes/:id
PUT   /api/solucoes/:id
PATCH /api/solucoes/:id/ativo
POST  /api/solucoes-solicitacoes
GET   /api/solucoes-solicitacoes/solicitacao/:solicitacaoId
```

Filtros:

```txt
GET /api/solucoes?tipo_barreira=mobilidade
GET /api/solucoes?area_responsavel=Facilities
GET /api/solucoes?ativo=1
```

Body:

```json
{
  "titulo": "Reunioes acessiveis",
  "tipo_barreira": "comunicacao",
  "contexto_problema": "Pessoa nao acompanha reunioes sem apoio textual.",
  "acao_recomendada": "Ativar legenda, enviar pauta e registrar decisoes.",
  "area_responsavel": "Comunicacao interna",
  "urgencia": "media",
  "solucao_provisoria": "Ativar legenda automatica na proxima reuniao.",
  "solucao_estrutural": "Criar padrao corporativo de reunioes acessiveis.",
  "ativo": true
}
```

Vinculo com solicitacao:

```json
{
  "solucoes_idsolucoes": 1,
  "solicitacoes_idsolicitacoes": 1
}
```

### Dashboard Gestor/RH

```txt
GET /api/dashboard
GET /api/dashboard/indicadores
GET /api/relatorios/indicadores
```

Retorna:

```txt
total_demandas_abertas
total_por_status
total_por_tipo_barreira
tempo_medio_resposta_horas
tempo_medio_resolucao_horas
percentual_resolvido
reincidencia_por_barreira
satisfacao_media
gargalos_por_area
```

### Perfis Funcionais

```txt
POST /api/perfis-funcionais
GET  /api/perfis-funcionais
GET  /api/perfis-funcionais/:id
PUT  /api/perfis-funcionais/:id
```

Body:

```json
{
  "usuarios_idusuarios": 1,
  "identificador": "Perfil Ana Souza",
  "habilidades_profissionais": ["analise de dados", "organizacao", "atendimento"],
  "experiencias_anteriores": "Assistente administrativa por 3 anos.",
  "facilidades_no_ambiente": ["rotina previsivel", "comunicacao escrita"],
  "dificuldades_encontradas": ["reuniao sem legenda", "mudanca repentina"],
  "preferencias_de_comunicacao": "texto e email",
  "necessidades_de_adaptacao": ["legenda", "pauta previa"],
  "barreiras_que_impactam_o_desempenho": ["comunicacao", "organizacional"],
  "tipo_de_apoio_necessario": "apoio do gestor"
}
```

### Vagas/Cargos/Areas

```txt
POST /api/vagas
GET  /api/vagas
GET  /api/vagas/:id
PUT  /api/vagas/:id
```

Body:

```json
{
  "titulo": "Analista Administrativo",
  "area": "Administrativo",
  "exigencias_do_cargo": ["organizacao", "planilhas", "atendimento interno"],
  "rotina_da_funcao": "Rotina com prazos, reunioes semanais e documentos.",
  "ambiente_de_trabalho": "Escritorio hibrido com reunioes online.",
  "ferramentas_utilizadas": ["planilhas", "portal interno", "email"],
  "barreiras_potenciais": ["comunicacao", "digital", "organizacional"],
  "possibilidade_de_adaptacao": "alta: permite pauta previa e canais escritos"
}
```

### Match Inteligente

```txt
POST /api/match/avaliar
GET  /api/match/:id
```

Body com IDs:

```json
{
  "perfil_funcional_id": 1,
  "vaga_ids": [1, 2, 3]
}
```

Body com objetos embutidos:

```json
{
  "perfil_funcional": {
    "habilidades_profissionais": ["organizacao", "planilhas"],
    "dificuldades_encontradas": ["reuniao sem legenda"],
    "preferencias_de_comunicacao": "email",
    "necessidades_de_adaptacao": ["legenda"],
    "barreiras_que_impactam_o_desempenho": ["comunicacao"]
  },
  "vagas": [
    {
      "titulo": "Assistente de RH",
      "area": "RH",
      "exigencias_do_cargo": ["organizacao", "comunicacao escrita"],
      "rotina_da_funcao": "Triagem de demandas e reunioes online.",
      "ambiente_de_trabalho": "Administrativo hibrido.",
      "ferramentas_utilizadas": ["email", "planilhas"],
      "barreiras_potenciais": ["comunicacao", "organizacional"],
      "possibilidade_de_adaptacao": "alta"
    }
  ]
}
```

Resposta inclui:

```txt
areas_com_maior_compatibilidade
cargos_com_menor_incidencia_de_barreiras
adaptacoes_recomendadas
riscos_de_incompatibilidade
justificativa
plano_inicial_de_acolhimento
ranking_compatibilidade
```

O match e apenas orientativo e nao deve excluir automaticamente uma pessoa de
nenhuma vaga.

### Demais Modulos Existentes

```txt
POST /api/encaminhamentos
GET  /api/encaminhamentos/solicitacao/:solicitacaoId
PATCH /api/encaminhamentos/:id

POST /api/feedbacks
GET  /api/feedbacks/solicitacao/:solicitacaoId

POST /api/arquivos
GET  /api/arquivos/solicitacao/:solicitacaoId

POST /api/logs-ia
GET  /api/logs-ia/solicitacao/:solicitacaoId

POST /api/solucao-relacionada
GET  /api/solucao-relacionada/solicitacao/:solicitacaoId
```

## Padrao de Resposta

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
