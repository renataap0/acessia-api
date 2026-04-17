-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema acessia
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `acessia` ;

-- -----------------------------------------------------
-- Schema acessia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `acessia` DEFAULT CHARACTER SET utf8mb3 ;
USE `acessia` ;

-- -----------------------------------------------------
-- Table `acessia`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `acessia`.`usuarios` (
  `idusuarios` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `tipo_usuario` VARCHAR(20) NOT NULL,
  `unidade` VARCHAR(100) NOT NULL,
  `cargo` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`idusuarios`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`solicitacoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`solicitacoes` ;

CREATE TABLE IF NOT EXISTS `acessia`.`solicitacoes` (
  `idsolicitacoes` INT NOT NULL AUTO_INCREMENT,
  `canal` VARCHAR(20) NOT NULL,
  `tipo_barreira` VARCHAR(30) NOT NULL,
  `urgencia` VARCHAR(20) NOT NULL,
  `area_responsavel` VARCHAR(100) NOT NULL,
  `precisa_profissional` TINYINT NULL DEFAULT NULL,
  `confianca_ia` DECIMAL(5,2) NULL DEFAULT NULL,
  `classificacao_ia_json` JSON NOT NULL,
  `atualizado_em` DATETIME NOT NULL,
  `criado_em` DATETIME NOT NULL,
  `descricao_dificuldade` TEXT NOT NULL,
  `descricao_original` TEXT NOT NULL,
  `contexto_problema` TEXT NULL,
  `impacto_trabalho` TEXT NULL,
  `preferencia_comunicacao` VARCHAR(100) NULL,
  `apoio_imediato` TINYINT NULL,
  `prioridade` VARCHAR(20) NULL,
  `sla_resposta_horas` INT NULL,
  `sla_resolucao_horas` INT NULL,
  `data_primeira_resposta` DATETIME NOT NULL,
  `data_resolucao` DATETIME NOT NULL,
  `usuarios_idusuarios` INT NOT NULL,
  PRIMARY KEY (`idsolicitacoes`),
  INDEX `fk_solicitacoes_usuarios_idx` (`usuarios_idusuarios` ASC) VISIBLE,
  CONSTRAINT `fk_solicitacoes_usuarios`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `acessia`.`usuarios` (`idusuarios`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`arquivos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`arquivos` ;

CREATE TABLE IF NOT EXISTS `acessia`.`arquivos` (
  `idarquivos` INT NOT NULL AUTO_INCREMENT,
  `url_arquivo` VARCHAR(255) NOT NULL,
  `tipo_arquivo` VARCHAR(30) NOT NULL,
  `descricao` VARCHAR(150) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `solicitacoes_idsolicitacoes` INT NOT NULL,
  PRIMARY KEY (`idarquivos`),
  INDEX `fk_arquivos_solicitacoes1_idx` (`solicitacoes_idsolicitacoes` ASC) VISIBLE,
  CONSTRAINT `fk_arquivos_solicitacoes1`
    FOREIGN KEY (`solicitacoes_idsolicitacoes`)
    REFERENCES `acessia`.`solicitacoes` (`idsolicitacoes`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`encaminhamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`encaminhamento` ;

CREATE TABLE IF NOT EXISTS `acessia`.`encaminhamento` (
  `idencaminhamento` INT NOT NULL AUTO_INCREMENT,
  `setor_destino` VARCHAR(100) NOT NULL,
  `profissional_responsavel` VARCHAR(100) NOT NULL,
  `data_encaminhamento` DATETIME NOT NULL,
  `observacao` TEXT NULL DEFAULT NULL,
  `solicitacoes_idsolicitacoes` INT NOT NULL,
  PRIMARY KEY (`idencaminhamento`),
  INDEX `fk_encaminhamento_solicitacoes1_idx` (`solicitacoes_idsolicitacoes` ASC) VISIBLE,
  CONSTRAINT `fk_encaminhamento_solicitacoes1`
    FOREIGN KEY (`solicitacoes_idsolicitacoes`)
    REFERENCES `acessia`.`solicitacoes` (`idsolicitacoes`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`feedbacks`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`feedbacks` ;

CREATE TABLE IF NOT EXISTS `acessia`.`feedbacks` (
  `idfeedbacks` INT NOT NULL AUTO_INCREMENT,
  `funcionou` TINYINT NOT NULL,
  `nota_satisfacao` INT NOT NULL,
  `comentario` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `solicitacoes_idsolicitacoes` INT NOT NULL,
  PRIMARY KEY (`idfeedbacks`),
  INDEX `fk_feedbacks_solicitacoes1_idx` (`solicitacoes_idsolicitacoes` ASC) VISIBLE,
  CONSTRAINT `fk_feedbacks_solicitacoes1`
    FOREIGN KEY (`solicitacoes_idsolicitacoes`)
    REFERENCES `acessia`.`solicitacoes` (`idsolicitacoes`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`logs_ia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`logs_ia` ;

CREATE TABLE IF NOT EXISTS `acessia`.`logs_ia` (
  `idlogs_ia` INT NOT NULL AUTO_INCREMENT,
  `entrada_texto` TEXT NOT NULL,
  `saida_classificacao` TEXT NOT NULL,
  `modelo_utilizado` VARCHAR(50) NULL DEFAULT NULL,
  `tempo_resposta` DECIMAL(6,2) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `solicitacoes_idsolicitacoes` INT NOT NULL,
  PRIMARY KEY (`idlogs_ia`),
  INDEX `fk_logs_ia_solicitacoes1_idx` (`solicitacoes_idsolicitacoes` ASC) VISIBLE,
  CONSTRAINT `fk_logs_ia_solicitacoes1`
    FOREIGN KEY (`solicitacoes_idsolicitacoes`)
    REFERENCES `acessia`.`solicitacoes` (`idsolicitacoes`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`solucao_relacionada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`solucao_relacionada` ;

CREATE TABLE IF NOT EXISTS `acessia`.`solucao_relacionada` (
  `idsolucao_relacionada` INT NOT NULL AUTO_INCREMENT,
  `similaridade` DECIMAL(5,2) NULL DEFAULT NULL,
  `foi_aplicada` TINYINT NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`idsolucao_relacionada`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`solucoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`solucoes` ;

CREATE TABLE IF NOT EXISTS `acessia`.`solucoes` (
  `idsolucoes` INT NOT NULL AUTO_INCREMENT,
  `solucao_provisoria` TEXT NOT NULL,
  `contexto_problema` TEXT NOT NULL,
  `urgencia` VARCHAR(20) NULL DEFAULT NULL,
  `tipo_barreira` VARCHAR(30) NULL DEFAULT NULL,
  `acao_recomendada` TEXT NULL DEFAULT NULL,
  `area_responsavel` VARCHAR(100) NOT NULL,
  `ativo` TINYINT NOT NULL,
  `solucao_estrutural` TEXT NULL,
  `custo_estimado` DECIMAL(10,2) NOT NULL,
  `prazo_estimado_dias` INT NOT NULL,
  PRIMARY KEY (`idsolucoes`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`solucoes_has_solicitacoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`solucoes_has_solicitacoes` ;

CREATE TABLE IF NOT EXISTS `acessia`.`solucoes_has_solicitacoes` (
  `solucoes_idsolucoes` INT NOT NULL,
  `solicitacoes_idsolicitacoes` INT NOT NULL,
  PRIMARY KEY (`solucoes_idsolucoes`, `solicitacoes_idsolicitacoes`),
  INDEX `fk_solucoes_has_solicitacoes_solicitacoes1_idx` (`solicitacoes_idsolicitacoes` ASC) VISIBLE,
  INDEX `fk_solucoes_has_solicitacoes_solucoes1_idx` (`solucoes_idsolucoes` ASC) VISIBLE,
  CONSTRAINT `fk_solucoes_has_solicitacoes_solicitacoes1`
    FOREIGN KEY (`solicitacoes_idsolicitacoes`)
    REFERENCES `acessia`.`solicitacoes` (`idsolicitacoes`),
  CONSTRAINT `fk_solucoes_has_solicitacoes_solucoes1`
    FOREIGN KEY (`solucoes_idsolucoes`)
    REFERENCES `acessia`.`solucoes` (`idsolucoes`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `acessia`.`perfis_funcionais`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`perfis_funcionais` ;

CREATE TABLE IF NOT EXISTS `acessia`.`perfis_funcionais` (
  `idperfis_funcionais` INT NOT NULL AUTO_INCREMENT,
  `habilidades_profissionais` TEXT NULL,
  `experiencias_anteriores` TEXT NULL,
  `facilidades_no_ambiente` TEXT NULL,
  `preferencias_de_comunicacao` TEXT NULL,
  `dificuldades_encontradas` TEXT NULL,
  `necessidades_de_adaptacao` TEXT NULL,
  `barreiras_impactantes` TEXT NULL,
  `tipo_de_apoio_necessario` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  PRIMARY KEY (`idperfis_funcionais`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `acessia`.`vagas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`vagas` ;

CREATE TABLE IF NOT EXISTS `acessia`.`vagas` (
  `idvagas` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(150) NOT NULL,
  `area` VARCHAR(150) NOT NULL,
  `exigencias_do_cargo` TEXT NULL,
  `rotina_da_funcao` TEXT NULL,
  `ambiente_de_trabalho` TEXT NULL,
  `ferramentas_utilizadas` TEXT NULL,
  `barreiras_potenciais` TEXT NULL,
  `possibilidade_de_adaptacao` TEXT NULL,
  `ativo` TINYINT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  PRIMARY KEY (`idvagas`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `acessia`.`matches`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `acessia`.`matches` ;

CREATE TABLE IF NOT EXISTS `acessia`.`matches` (
  `idmatches` INT NOT NULL AUTO_INCREMENT,
  `pontuacao_compatibilidade` DECIMAL(5,2) NULL,
  `areas_recomendadas` TEXT NULL,
  `adaptacoes_recomendadas` TEXT NULL,
  `riscos_incompatibilidade` TEXT NULL,
  `justificativa` TEXT NULL,
  `plano_inicial_acolhimento` TEXT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `perfis_funcionais_idperfis_funcionais` INT NOT NULL,
  `vagas_idvagas` INT NOT NULL,
  PRIMARY KEY (`idmatches`),
  INDEX `fk_matches_perfis_funcionais1_idx` (`perfis_funcionais_idperfis_funcionais` ASC) VISIBLE,
  INDEX `fk_matches_vagas1_idx` (`vagas_idvagas` ASC) VISIBLE,
  CONSTRAINT `fk_matches_perfis_funcionais1`
    FOREIGN KEY (`perfis_funcionais_idperfis_funcionais`)
    REFERENCES `acessia`.`perfis_funcionais` (`idperfis_funcionais`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_matches_vagas1`
    FOREIGN KEY (`vagas_idvagas`)
    REFERENCES `acessia`.`vagas` (`idvagas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
