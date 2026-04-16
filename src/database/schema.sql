-- =====================================================
-- Banco de dados: acessia
-- Projeto: AcessIA
-- Descricao: plataforma de gestao de acessibilidade e inclusao corporativa.
--
-- Este script recria o banco inteiro e pode ser executado do inicio ao fim
-- no MySQL Workbench ou no terminal MySQL.
-- =====================================================

DROP DATABASE IF EXISTS acessia;
CREATE DATABASE acessia;
ALTER DATABASE acessia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE acessia;

-- =====================================================
-- Tabela: usuarios
-- Armazena colaboradores, gestores, RH e profissionais envolvidos no fluxo.
-- Relacionamento:
--   usuarios 1:N solicitacoes
--   usuarios 1:N feedbacks
--   usuarios 1:N arquivos
-- =====================================================
CREATE TABLE usuarios (
  idusuarios INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria do usuario.',
  nome VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'Nome completo do usuario.',
  email VARCHAR(150) NULL DEFAULT NULL COMMENT 'E-mail corporativo do usuario.',
  tipo_usuario VARCHAR(30) NOT NULL DEFAULT 'colaborador' COMMENT 'Perfil: colaborador, gestor, rh ou profissional.',
  unidade VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'Unidade, filial ou local de trabalho.',
  cargo VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'Cargo ou funcao do usuario.',
  ativo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Indica se o usuario esta ativo no sistema.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Alias de criacao usado por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  PRIMARY KEY (idusuarios),
  UNIQUE KEY uk_usuarios_email (email),
  INDEX idx_usuarios_tipo_usuario (tipo_usuario),
  INDEX idx_usuarios_ativo (ativo)
) ENGINE=InnoDB
  COMMENT='Usuarios da plataforma AcessIA.';

-- =====================================================
-- Tabela: solicitacoes
-- Registra dificuldades/barreiras informadas pelos colaboradores.
-- Tipos de barreira esperados:
--   comunicacao, mobilidade, digital, cognitiva, sensorial,
--   organizacional, atitudinal.
-- Relacionamento:
--   cada solicitacao pode pertencer a um usuario.
-- =====================================================
CREATE TABLE solicitacoes (
  idsolicitacoes INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria da solicitacao.',
  canal VARCHAR(30) NOT NULL DEFAULT 'web' COMMENT 'Canal de entrada: web, app, totem ou outro.',
  tipo_barreira VARCHAR(30) NOT NULL DEFAULT 'organizacional' COMMENT 'Tipo da barreira registrada.',
  urgencia VARCHAR(20) NOT NULL DEFAULT 'media' COMMENT 'Nivel de urgencia: baixa, media, alta ou critica.',
  area_responsavel VARCHAR(100) NOT NULL DEFAULT 'RH' COMMENT 'Area responsavel pela tratativa.',
  status VARCHAR(30) NOT NULL DEFAULT 'aberta' COMMENT 'Status da solicitacao no fluxo de atendimento.',
  descricao TEXT NULL COMMENT 'Descricao livre da dificuldade relatada.',
  precisa_profissional TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Booleano: 1 quando precisa de profissional especializado.',
  confianca_ia DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Confianca da classificacao de IA, de 0.00 a 1.00.',
  classificacao_ia_json JSON NULL COMMENT 'Payload JSON com detalhes da classificacao da IA.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao usada por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  usuarios_idusuarios INT NULL DEFAULT NULL COMMENT 'FK para o usuario solicitante.',
  PRIMARY KEY (idsolicitacoes),
  INDEX idx_solicitacoes_usuarios (usuarios_idusuarios),
  INDEX idx_solicitacoes_tipo_barreira (tipo_barreira),
  INDEX idx_solicitacoes_urgencia (urgencia),
  INDEX idx_solicitacoes_status (status),
  INDEX idx_solicitacoes_area_responsavel (area_responsavel),
  INDEX idx_solicitacoes_created_at (created_at),
  -- Relacionamento solicitacoes -> usuarios.
  CONSTRAINT fk_solicitacoes_usuarios
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES usuarios (idusuarios)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Solicitacoes de acessibilidade abertas pelos colaboradores.';

-- =====================================================
-- Tabela: solucoes
-- Catalogo de solucoes imediatas ou estruturais para barreiras de acesso.
-- Relacionamento:
--   solucoes N:N solicitacoes por solucoes_has_solicitacoes
--   solucoes 1:N solucao_relacionada
-- =====================================================
CREATE TABLE solucoes (
  idsolucoes INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria da solucao.',
  titulo VARCHAR(150) NOT NULL DEFAULT '' COMMENT 'Titulo resumido da solucao.',
  descricao_problema TEXT NULL COMMENT 'Descricao do problema que a solucao atende.',
  solucao_imediata TEXT NULL COMMENT 'Acao de curto prazo sugerida.',
  solucao_estrutural TEXT NULL COMMENT 'Acao estrutural ou preventiva sugerida.',
  tipo_barreira VARCHAR(30) NOT NULL DEFAULT 'organizacional' COMMENT 'Tipo de barreira relacionado a solucao.',
  publico_indicado VARCHAR(150) NULL DEFAULT NULL COMMENT 'Publico ou perfil indicado para a solucao.',
  area_responsavel VARCHAR(100) NOT NULL DEFAULT 'RH' COMMENT 'Area responsavel pela solucao.',
  ativo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Booleano: 1 para solucao ativa, 0 para inativa.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Alias de criacao usado por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  PRIMARY KEY (idsolucoes),
  INDEX idx_solucoes_tipo_barreira (tipo_barreira),
  INDEX idx_solucoes_area_responsavel (area_responsavel),
  INDEX idx_solucoes_ativo (ativo)
) ENGINE=InnoDB
  COMMENT='Catalogo de solucoes de acessibilidade e inclusao.';

-- =====================================================
-- Tabela: encaminhamento
-- Registra encaminhamentos internos para tratar uma solicitacao.
-- Relacionamento:
--   cada encaminhamento pertence a uma solicitacao.
-- =====================================================
CREATE TABLE encaminhamento (
  idencaminhamento INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria do encaminhamento.',
  setor_destino VARCHAR(100) NULL DEFAULT NULL COMMENT 'Setor para onde a solicitacao foi encaminhada.',
  profissional_responsavel VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'Pessoa ou profissional responsavel pelo atendimento.',
  observacao TEXT NULL COMMENT 'Observacoes sobre o encaminhamento.',
  data_encaminhamento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data em que o encaminhamento foi feito.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao usada por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  solicitacoes_idsolicitacoes INT NULL DEFAULT NULL COMMENT 'FK para a solicitacao encaminhada.',
  PRIMARY KEY (idencaminhamento),
  INDEX idx_encaminhamento_solicitacoes (solicitacoes_idsolicitacoes),
  INDEX idx_encaminhamento_profissional (profissional_responsavel),
  INDEX idx_encaminhamento_data (data_encaminhamento),
  -- Relacionamento encaminhamento -> solicitacoes.
  CONSTRAINT fk_encaminhamento_solicitacoes
    FOREIGN KEY (solicitacoes_idsolicitacoes)
    REFERENCES solicitacoes (idsolicitacoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Encaminhamentos das solicitacoes para areas ou profissionais responsaveis.';

-- =====================================================
-- Tabela: feedbacks
-- Registra avaliacao do colaborador sobre a solucao/atendimento recebido.
-- Relacionamentos:
--   cada feedback pertence a uma solicitacao.
--   cada feedback pode estar associado a um usuario.
-- =====================================================
CREATE TABLE feedbacks (
  idfeedbacks INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria do feedback.',
  funcionou TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Booleano: 1 quando a solucao funcionou.',
  nota INT NOT NULL DEFAULT 0 COMMENT 'Nota de satisfacao usada pela API.',
  nota_satisfacao INT NULL DEFAULT NULL COMMENT 'Nota de satisfacao usada por cargas antigas.',
  comentario TEXT NULL COMMENT 'Comentario livre do usuario.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao usada por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  solicitacoes_idsolicitacoes INT NULL DEFAULT NULL COMMENT 'FK para a solicitacao avaliada.',
  usuarios_idusuarios INT NULL DEFAULT NULL COMMENT 'FK para o usuario que enviou o feedback.',
  PRIMARY KEY (idfeedbacks),
  INDEX idx_feedbacks_solicitacoes (solicitacoes_idsolicitacoes),
  INDEX idx_feedbacks_usuarios (usuarios_idusuarios),
  INDEX idx_feedbacks_nota (nota),
  -- Relacionamento feedbacks -> solicitacoes.
  CONSTRAINT fk_feedbacks_solicitacoes
    FOREIGN KEY (solicitacoes_idsolicitacoes)
    REFERENCES solicitacoes (idsolicitacoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Relacionamento feedbacks -> usuarios.
  CONSTRAINT fk_feedbacks_usuarios
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES usuarios (idusuarios)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Feedbacks dos usuarios sobre solicitacoes e solucoes aplicadas.';

-- =====================================================
-- Tabela: arquivos
-- Armazena metadados de anexos vinculados a uma solicitacao.
-- Relacionamentos:
--   cada arquivo pertence a uma solicitacao.
--   cada arquivo pode estar associado ao usuario que fez o envio.
-- =====================================================
CREATE TABLE arquivos (
  idarquivos INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria do arquivo.',
  nome_original VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Nome original do arquivo enviado.',
  caminho_arquivo VARCHAR(500) NOT NULL DEFAULT '' COMMENT 'Caminho ou chave de armazenamento do arquivo.',
  mime_type VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream' COMMENT 'Tipo MIME do arquivo.',
  tamanho_bytes INT NOT NULL DEFAULT 0 COMMENT 'Tamanho do arquivo em bytes.',
  url_arquivo VARCHAR(500) NULL DEFAULT NULL COMMENT 'URL publica ou interna usada por cargas antigas.',
  tipo_arquivo VARCHAR(50) NULL DEFAULT NULL COMMENT 'Categoria simples do arquivo usada por cargas antigas.',
  descricao VARCHAR(255) NULL DEFAULT NULL COMMENT 'Descricao opcional do anexo.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao usada por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  solicitacoes_idsolicitacoes INT NULL DEFAULT NULL COMMENT 'FK para a solicitacao relacionada.',
  usuarios_idusuarios INT NULL DEFAULT NULL COMMENT 'FK para o usuario que enviou o arquivo.',
  PRIMARY KEY (idarquivos),
  INDEX idx_arquivos_solicitacoes (solicitacoes_idsolicitacoes),
  INDEX idx_arquivos_usuarios (usuarios_idusuarios),
  INDEX idx_arquivos_mime_type (mime_type),
  -- Relacionamento arquivos -> solicitacoes.
  CONSTRAINT fk_arquivos_solicitacoes
    FOREIGN KEY (solicitacoes_idsolicitacoes)
    REFERENCES solicitacoes (idsolicitacoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Relacionamento arquivos -> usuarios.
  CONSTRAINT fk_arquivos_usuarios
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES usuarios (idusuarios)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Metadados de arquivos anexados as solicitacoes.';

-- =====================================================
-- Tabela: logs_ia
-- Guarda entrada, saida e metadados de classificacoes feitas pela IA.
-- Relacionamento:
--   cada log de IA pertence a uma solicitacao.
-- =====================================================
CREATE TABLE logs_ia (
  idlogs_ia INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria do log de IA.',
  entrada TEXT NULL COMMENT 'Texto ou payload enviado para a IA.',
  saida JSON NULL COMMENT 'Resposta estruturada da IA em JSON.',
  modelo VARCHAR(80) NOT NULL DEFAULT 'simulador_regras_v1' COMMENT 'Modelo ou estrategia usada pela IA.',
  confianca DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Confianca retornada pela IA, de 0.00 a 1.00.',
  entrada_texto TEXT NULL COMMENT 'Entrada textual usada por cargas antigas.',
  saida_classificacao TEXT NULL COMMENT 'Saida textual usada por cargas antigas.',
  modelo_utilizado VARCHAR(80) NULL DEFAULT NULL COMMENT 'Nome do modelo usado por cargas antigas.',
  tempo_resposta DECIMAL(8,3) NULL DEFAULT NULL COMMENT 'Tempo de resposta em segundos.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao usada por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  solicitacoes_idsolicitacoes INT NULL DEFAULT NULL COMMENT 'FK para a solicitacao analisada pela IA.',
  PRIMARY KEY (idlogs_ia),
  INDEX idx_logs_ia_solicitacoes (solicitacoes_idsolicitacoes),
  INDEX idx_logs_ia_modelo (modelo),
  INDEX idx_logs_ia_created_at (created_at),
  -- Relacionamento logs_ia -> solicitacoes.
  CONSTRAINT fk_logs_ia_solicitacoes
    FOREIGN KEY (solicitacoes_idsolicitacoes)
    REFERENCES solicitacoes (idsolicitacoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Logs de classificacoes e respostas de IA vinculados as solicitacoes.';

-- =====================================================
-- Tabela: solucoes_has_solicitacoes
-- Tabela de relacionamento N:N entre solucoes e solicitacoes.
-- Relacionamentos:
--   uma solicitacao pode ter varias solucoes.
--   uma solucao pode atender varias solicitacoes.
-- =====================================================
CREATE TABLE solucoes_has_solicitacoes (
  idsolucoes_has_solicitacoes INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria do vinculo.',
  solucoes_idsolucoes INT NOT NULL COMMENT 'FK para solucoes.',
  solicitacoes_idsolicitacoes INT NOT NULL COMMENT 'FK para solicitacoes.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do vinculo.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Alias de criacao usado por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  PRIMARY KEY (idsolucoes_has_solicitacoes),
  UNIQUE KEY uk_solucoes_has_solicitacoes (solucoes_idsolucoes, solicitacoes_idsolicitacoes),
  INDEX idx_solucoes_has_solicitacoes_solucoes (solucoes_idsolucoes),
  INDEX idx_solucoes_has_solicitacoes_solicitacoes (solicitacoes_idsolicitacoes),
  -- Relacionamento solucoes_has_solicitacoes -> solucoes.
  CONSTRAINT fk_shs_solucoes
    FOREIGN KEY (solucoes_idsolucoes)
    REFERENCES solucoes (idsolucoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Relacionamento solucoes_has_solicitacoes -> solicitacoes.
  CONSTRAINT fk_shs_solicitacoes
    FOREIGN KEY (solicitacoes_idsolicitacoes)
    REFERENCES solicitacoes (idsolicitacoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Relacionamento N:N entre solucoes cadastradas e solicitacoes abertas.';

-- =====================================================
-- Tabela: solucao_relacionada
-- Registra sugestoes ou solucoes relacionadas a uma solicitacao.
-- Relacionamentos:
--   cada registro conecta uma solicitacao a uma solucao recomendada/aplicada.
-- =====================================================
CREATE TABLE solucao_relacionada (
  idsolucao_relacionada INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primaria da solucao relacionada.',
  similaridade DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Indice de similaridade entre solicitacao e solucao.',
  aplicacao_solucao TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Booleano: 1 quando a solucao foi aplicada.',
  foi_aplicada TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Alias legado para aplicacao da solucao.',
  data_aplicacao DATETIME NULL DEFAULT NULL COMMENT 'Data em que a solucao foi aplicada.',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro.',
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Alias de criacao usado por partes da API.',
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao.',
  solicitacoes_idsolicitacoes INT NULL DEFAULT NULL COMMENT 'FK para a solicitacao relacionada.',
  solucoes_idsolucoes INT NULL DEFAULT NULL COMMENT 'FK para a solucao relacionada.',
  PRIMARY KEY (idsolucao_relacionada),
  UNIQUE KEY uk_solucao_relacionada (solicitacoes_idsolicitacoes, solucoes_idsolucoes),
  INDEX idx_solucao_relacionada_solicitacoes (solicitacoes_idsolicitacoes),
  INDEX idx_solucao_relacionada_solucoes (solucoes_idsolucoes),
  INDEX idx_solucao_relacionada_similaridade (similaridade),
  -- Relacionamento solucao_relacionada -> solicitacoes.
  CONSTRAINT fk_solucao_relacionada_solicitacoes
    FOREIGN KEY (solicitacoes_idsolicitacoes)
    REFERENCES solicitacoes (idsolicitacoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Relacionamento solucao_relacionada -> solucoes.
  CONSTRAINT fk_solucao_relacionada_solucoes
    FOREIGN KEY (solucoes_idsolucoes)
    REFERENCES solucoes (idsolucoes)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT='Solucoes recomendadas ou aplicadas para solicitacoes especificas.';
