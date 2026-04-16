SHOW DATABASES;
USE acessia;
SHOW TABLES;
DESC canal;


INSERT INTO usuarios
(nome, email, tipo_usuario, unidade, cargo, created_at)
VALUES
('Ana Souza','ana@empresa.com','colaborador','Unidade A','Assistente','2026-04-15 08:00:00'),
('Joao Lima','joao@empresa.com','colaborador','Unidade B','Operador','2026-04-15 08:05:00'),
('Carla Mendes','carla@empresa.com','gestor','Unidade A','Gerente','2026-04-15 08:10:00'),
('Pedro Alves','pedro@empresa.com','colaborador','Unidade C','Tecnico','2026-04-15 08:15:00'),
('Mariana Costa','mariana@empresa.com','rh','Matriz','Analista RH','2026-04-15 08:20:00'),
('Lucas Pereira','lucas@empresa.com','colaborador','Unidade B','Auxiliar','2026-04-15 08:25:00'),
('Fernanda Rocha','fernanda@empresa.com','profissional','Matriz','Psicologa','2026-04-15 08:30:00'),
('Rafael Martins','rafael@empresa.com','colaborador','Unidade A','Operador','2026-04-15 08:35:00'),
('Juliana Gomes','juliana@empresa.com','gestor','Unidade C','Supervisora','2026-04-15 08:40:00'),
('Bruno Silva','bruno@empresa.com','colaborador','Unidade D','Assistente','2026-04-15 08:45:00');	


INSERT INTO solicitacoes
(canal, tipo_barreira, urgencia, area_responsavel, precisa_profissional, confianca_ia, classificacao_ia_json, atualizado_em, criado_em, usuarios_idusuarios)
VALUES
('app','comunicacao','alta','TI',1,0.92,'{"barreira":"comunicacao"}','2026-04-15 09:10:00','2026-04-15 09:00:00',1),
('totem','mobilidade','media','Facilities',1,0.85,'{"barreira":"mobilidade"}','2026-04-15 09:20:00','2026-04-15 09:05:00',2),
('app','sensorial','alta','RH',1,0.88,'{"barreira":"sensorial"}','2026-04-15 09:30:00','2026-04-15 09:10:00',4),
('web','cognitiva','media','Gestor',0,0.80,'{"barreira":"cognitiva"}','2026-04-15 09:40:00','2026-04-15 09:15:00',6),
('app','digital','alta','TI',1,0.90,'{"barreira":"digital"}','2026-04-15 09:50:00','2026-04-15 09:20:00',8),
('app','atitudinal','critica','RH',1,0.95,'{"barreira":"atitudinal"}','2026-04-15 10:00:00','2026-04-15 09:25:00',10),
('totem','mobilidade','alta','Facilities',1,0.87,'{"barreira":"mobilidade"}','2026-04-15 10:10:00','2026-04-15 09:30:00',1),
('app','comunicacao','media','Gestor',0,0.84,'{"barreira":"comunicacao"}','2026-04-15 10:20:00','2026-04-15 09:35:00',2),
('app','sensorial','media','RH',1,0.83,'{"barreira":"sensorial"}','2026-04-15 10:30:00','2026-04-15 09:40:00',4),
('web','organizacional','alta','Gestor',0,0.89,'{"barreira":"organizacional"}','2026-04-15 10:40:00','2026-04-15 09:45:00',6);

INSERT INTO solucoes
(titulo, descricao_problema, solucao_imediata, tipo_barreira, publico_indicado, area_responsavel, ativo)
VALUES
('Legenda reunioes','Nao consegue acompanhar reuniao','Ativar legenda','comunicacao','deficiencia auditiva','TI',1),
('Acesso fisico','Dificuldade locomocao','Liberar acesso','mobilidade','cadeirantes','Facilities',1),
('Reducao ruido','Barulho ambiente','Abafador','sensorial','TEA','RH',1),
('Instrucao simples','Texto complexo','Dividir tarefas','cognitiva','TDAH','Gestor',1),
('Sistema acessivel','Sistema ruim','Corrigir interface','digital','visual','TI',1),
('Treinamento equipe','Falta respeito','Treinar equipe','atitudinal','todos','RH',1),
('Rampa acesso','Escada problema','Instalar rampa','mobilidade','cadeirantes','Facilities',1),
('Pauta previa','Sem informacao','Enviar pauta','comunicacao','todos','Gestor',1),
('Controle luz','Luz forte','Diminuir luz','sensorial','TEA','Facilities',1),
('Rotina clara','Sem organizacao','Checklist','organizacional','TDAH','Gestor',1);

INSERT INTO encaminhamento
(setor_destino, profissional_responsavel, data_encaminhamento, observacao, solicitacoes_idsolicitacoes)
VALUES
('TI','Carlos','2026-04-15 09:15:00','Resolver legenda',1),
('Facilities','Roberto','2026-04-15 09:25:00','Ver acesso',2),
('RH','Fernanda','2026-04-15 09:35:00','Acompanhar caso',3),
('Gestor','Carla','2026-04-15 09:45:00','Rever tarefas',4),
('TI','Lucas','2026-04-15 09:55:00','Corrigir sistema',5),
('RH','Mariana','2026-04-15 10:05:00','Treinar equipe',6),
('Facilities','Roberto','2026-04-15 10:15:00','Instalar rampa',7),
('Gestor','Juliana','2026-04-15 10:25:00','Padronizar reuniao',8),
('RH','Fernanda','2026-04-15 10:35:00','Ajustar ambiente',9),
('Gestor','Carla','2026-04-15 10:45:00','Organizar rotina',10);

INSERT INTO feedbacks
(funcionou, nota_satisfacao, comentario, created_at, solicitacoes_idsolicitacoes)
VALUES
(1,5,'Funcionou bem','2026-04-16 08:00:00',1),
(1,4,'Melhorou','2026-04-16 08:10:00',2),
(1,5,'Muito bom','2026-04-16 08:20:00',3),
(0,2,'Nao resolveu','2026-04-16 08:30:00',4),
(1,5,'Sistema ok','2026-04-16 08:40:00',5),
(1,4,'Equipe melhor','2026-04-16 08:50:00',6),
(1,5,'Acesso resolvido','2026-04-16 09:00:00',7),
(1,4,'Reuniao melhor','2026-04-16 09:10:00',8),
(0,3,'Parcial','2026-04-16 09:20:00',9),
(1,5,'Rotina clara','2026-04-16 09:30:00',10);

INSERT INTO arquivos
(url_arquivo, tipo_arquivo, descricao, created_at, solicitacoes_idsolicitacoes)
VALUES
('file1.mp3','audio','audio reuniao','2026-04-15 09:01:00',1),
('img1.png','imagem','escada','2026-04-15 09:06:00',2),
('audio2.mp3','audio','barulho','2026-04-15 09:11:00',3),
('doc1.pdf','pdf','instrucao','2026-04-15 09:16:00',4),
('img2.png','imagem','erro sistema','2026-04-15 09:21:00',5),
('doc2.pdf','pdf','relato','2026-04-15 09:26:00',6),
('img3.png','imagem','escada','2026-04-15 09:31:00',7),
('doc3.pdf','pdf','material','2026-04-15 09:36:00',8),
('img4.png','imagem','luz','2026-04-15 09:41:00',9),
('doc4.pdf','pdf','rotina','2026-04-15 09:46:00',10);

INSERT INTO solucao_relacionada
(similaridade, foi_aplicada, created_at)
VALUES
(0.95,1,'2026-04-15 11:00:00'),
(0.90,1,'2026-04-15 11:05:00'),
(0.88,1,'2026-04-15 11:10:00'),
(0.80,0,'2026-04-15 11:15:00'),
(0.92,1,'2026-04-15 11:20:00'),
(0.94,1,'2026-04-15 11:25:00'),
(0.91,1,'2026-04-15 11:30:00'),
(0.89,1,'2026-04-15 11:35:00'),
(0.85,0,'2026-04-15 11:40:00'),
(0.90,1,'2026-04-15 11:45:00');

INSERT INTO logs_ia
(entrada_texto, saida_classificacao, modelo_utilizado, tempo_resposta, created_at, solicitacoes_idsolicitacoes)
VALUES
('Reuniao sem legenda','comunicacao alta','IA_v1',1.2,'2026-04-15 09:01:00',1),
('Dificuldade locomocao','mobilidade media','IA_v1',1.1,'2026-04-15 09:06:00',2),
('Barulho alto','sensorial alta','IA_v1',1.3,'2026-04-15 09:11:00',3),
('Texto dificil','cognitiva media','IA_v1',1.0,'2026-04-15 09:16:00',4),
('Sistema ruim','digital alta','IA_v1',1.4,'2026-04-15 09:21:00',5),
('Equipe ruim','atitudinal critica','IA_v1',1.5,'2026-04-15 09:26:00',6),
('Escada problema','mobilidade alta','IA_v1',1.2,'2026-04-15 09:31:00',7),
('Sem pauta','comunicacao media','IA_v1',1.1,'2026-04-15 09:36:00',8),
('Luz forte','sensorial media','IA_v1',1.3,'2026-04-15 09:41:00',9),
('Sem rotina','organizacional alta','IA_v1',1.2,'2026-04-15 09:46:00',10);

INSERT INTO solucoes_has_solicitacoes
(solucoes_idsolucoes, solicitacoes_idsolicitacoes)
VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10);

SELECT * FROM solicitacoes;
SELECT * FROM solucoes;
SELECT * FROM encaminhamento;
SELECT * FROM feedbacks;
SELECT * FROM arquivos;
SELECT * FROM logs_ia;