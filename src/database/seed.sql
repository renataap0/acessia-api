SHOW DATABASES;
USE acessia;
SHOW TABLES;
DESC solicitacoes;

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
(
  canal,
  tipo_barreira,
  urgencia,
  area_responsavel,
  precisa_profissional,
  confianca_ia,
  classificacao_ia_json,
  atualizado_em,
  criado_em,
  descricao_dificuldade,
  descricao_original,
  contexto_problema,
  impacto_trabalho,
  preferencia_comunicacao,
  apoio_imediato,
  prioridade,
  sla_resposta_horas,
  sla_resolucao_horas,
  data_primeira_resposta,
  data_resolucao,
  usuarios_idusuarios
)
VALUES
('app','comunicacao','alta','TI',1,0.92,'{"barreira":"comunicacao","prioridade":"alta"}','2026-04-15 09:10:00','2026-04-15 09:00:00','Sem legenda','Reuniao sem legenda','Dificuldade em acompanhar reunioes virtuais sem recurso de legenda','Impacta entendimento e participacao','texto',1,'alta',4,24,'2026-04-15 09:05:00','2026-04-16 10:00:00',1),
('totem','mobilidade','media','Facilities',1,0.85,'{"barreira":"mobilidade","prioridade":"media"}','2026-04-15 09:20:00','2026-04-15 09:05:00','Escada no setor','Dificuldade locomocao','Dificuldade de acesso fisico por escadas no setor de trabalho','Impacta deslocamento e autonomia','texto',1,'media',6,48,'2026-04-15 09:15:00','2026-04-17 14:00:00',2),
('app','sensorial','alta','RH',1,0.88,'{"barreira":"sensorial","prioridade":"alta"}','2026-04-15 09:30:00','2026-04-15 09:10:00','Barulho excessivo','Ambiente barulhento','Sobrecarga sensorial em ambiente com muito ruido','Impacta concentracao e bem-estar','texto',1,'alta',4,24,'2026-04-15 09:20:00','2026-04-16 15:00:00',4),
('web','organizacional','media','Gestor',0,0.80,'{"barreira":"organizacional","prioridade":"media"}','2026-04-15 09:40:00','2026-04-15 09:15:00','Instrucao extensa','Texto dificil','Instrucoes longas e pouco objetivas dificultam a execucao','Impacta produtividade','texto',0,'media',8,72,'2026-04-15 10:00:00','2026-04-18 11:00:00',6),
('app','digital','alta','TI',1,0.90,'{"barreira":"digital","prioridade":"alta"}','2026-04-15 09:50:00','2026-04-15 09:20:00','Sistema interno','Sistema inacessivel','Dificuldade para usar sistema corporativo por falta de acessibilidade','Impacta execucao das tarefas','texto',1,'alta',4,24,'2026-04-15 09:30:00','2026-04-16 13:00:00',8),
('app','atitudinal','critica','RH',1,0.95,'{"barreira":"atitudinal","prioridade":"critica"}','2026-04-15 10:00:00','2026-04-15 09:25:00','Tratamento inadequado','Equipe nao respeita','Comportamentos inadequados e falta de respeito as adaptacoes','Impacta clima e permanencia','texto',1,'critica',2,12,'2026-04-15 09:40:00','2026-04-15 18:00:00',10),
('totem','mobilidade','alta','Facilities',1,0.87,'{"barreira":"mobilidade","prioridade":"alta"}','2026-04-15 10:10:00','2026-04-15 09:30:00','Sem rampa','Escada problema','Acesso comprometido por falta de rampa','Impacta seguranca e deslocamento','texto',1,'alta',4,24,'2026-04-15 09:45:00','2026-04-16 17:00:00',1),
('app','comunicacao','media','Gestor',0,0.84,'{"barreira":"comunicacao","prioridade":"media"}','2026-04-15 10:20:00','2026-04-15 09:35:00','Sem pauta','Reuniao sem pauta','Falta de material previo dificulta acompanhamento da reuniao','Impacta entendimento','texto',0,'media',8,48,'2026-04-15 10:10:00','2026-04-17 10:00:00',2),
('app','sensorial','media','RH',1,0.83,'{"barreira":"sensorial","prioridade":"media"}','2026-04-15 10:30:00','2026-04-15 09:40:00','Luz intensa','Iluminacao forte','Excesso de iluminacao causa desconforto sensorial','Impacta conforto e foco','texto',1,'media',6,48,'2026-04-15 10:20:00','2026-04-17 16:00:00',4),
('web','organizacional','alta','Gestor',0,0.89,'{"barreira":"organizacional","prioridade":"alta"}','2026-04-15 10:40:00','2026-04-15 09:45:00','Sem rotina clara','Sem rotina','Falta de organizacao e previsibilidade nas tarefas','Impacta desempenho e autonomia','texto',0,'alta',6,48,'2026-04-15 10:30:00','2026-04-17 18:00:00',6);

INSERT INTO solucoes
(
  solucao_provisoria,
  contexto_problema,
  urgencia,
  tipo_barreira,
  acao_recomendada,
  area_responsavel,
  ativo,
  solucao_estrutural,
  custo_estimado,
  prazo_estimado_dias
)
VALUES
('Ativar legenda automatica','Reunioes sem recurso de acessibilidade','alta','comunicacao','Ativar legenda e enviar pauta antes da reuniao','TI',1,'Padronizar reunioes acessiveis com apoio visual e resumo','150.00',7),
('Liberar rota acessivel provisoria','Dificuldade de locomocao no setor','media','mobilidade','Ajustar acesso e sinalizar rota temporaria','Facilities',1,'Adequar infraestrutura com acessibilidade permanente','800.00',15),
('Disponibilizar abafador','Ambiente com muito ruido','alta','sensorial','Oferecer abafador e posto alternativo','RH',1,'Criar area com menor estimulo sensorial','250.00',10),
('Fornecer checklist simplificado','Instrucoes longas e ambiguas','media','organizacional','Transformar orientacoes em etapas curtas e objetivas','Gestor',1,'Padronizar comunicacao clara na area','50.00',5),
('Ajustar interface rapidamente','Sistema corporativo inacessivel','alta','digital','Corrigir contraste e navegacao principal','TI',1,'Revisar acessibilidade completa do sistema','1200.00',20),
('Realizar intervencao imediata','Postura inadequada da equipe','critica','atitudinal','Acionar RH e orientar equipe imediatamente','RH',1,'Treinamento recorrente de lideranca e equipe sobre inclusao','300.00',12),
('Instalar rampa provisoria','Falta de acesso adequado','alta','mobilidade','Instalar rampa de acesso temporaria','Facilities',1,'Reforma estrutural do acesso','1500.00',30),
('Enviar pauta e resumo simples','Ausencia de material previo','media','comunicacao','Enviar pauta antecipada e resumo posterior','Gestor',1,'Criar protocolo de reunioes acessiveis','80.00',4),
('Reduzir intensidade de luz','Iluminacao excessiva no ambiente','media','sensorial','Ajustar lampadas e posicao de posto','Facilities',1,'Revisar layout luminico da area','400.00',8),
('Criar rotina visual','Falta de previsibilidade nas tarefas','alta','organizacional','Montar rotina com checklist e horario estruturado','Gestor',1,'Padronizar fluxo operacional com rotina clara','100.00',6);

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
('Texto dificil','organizacional media','IA_v1',1.0,'2026-04-15 09:16:00',4),
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

INSERT INTO perfis_funcionais
(habilidades_profissionais, experiencias_anteriores, facilidades_no_ambiente, preferencias_de_comunicacao, dificuldades_encontradas, necessidades_de_adaptacao, barreiras_impactantes, tipo_de_apoio_necessario, created_at, updated_at)
VALUES
('Organizacao, planilhas, atendimento interno','Assistente administrativo','Ambiente calmo e rotina clara','Texto objetivo','Dificuldade com instrucoes ambiguas','Checklist visual','organizacional','Orientacao estruturada','2026-04-15 12:00:00','2026-04-15 12:00:00'),
('Analise de dados, digitacao, sistema','Operador de apoio','Boa comunicacao escrita','Texto e apoio visual','Dificuldade com chamadas telefonicas','Instrucoes escritas','comunicacao','Recursos visuais','2026-04-15 12:05:00','2026-04-15 12:05:00'),
('Foco, precisao, rotina tecnica','Tecnico de processo','Rotina previsivel','Texto direto','Sensibilidade a ruido','Ambiente menos barulhento','sensorial','Reducao de estimulos','2026-04-15 12:10:00','2026-04-15 12:10:00'),
('Dinamismo, multitarefa, energia alta','Auxiliar operacional','Atividades variadas','Orientacao curta','Dificuldade com falta de organizacao','Planejamento claro','organizacional','Acompanhamento inicial','2026-04-15 12:15:00','2026-04-15 12:15:00'),
('Boa adaptacao digital, controle de tarefas','Assistente de suporte','Ambiente acessivel digitalmente','Texto e sistema','Dificuldade de locomocao','Acesso fisico adequado','mobilidade','Posto acessivel','2026-04-15 12:20:00','2026-04-15 12:20:00');

INSERT INTO vagas
(titulo, area, exigencias_do_cargo, rotina_da_funcao, ambiente_de_trabalho, ferramentas_utilizadas, barreiras_potenciais, possibilidade_de_adaptacao, ativo, created_at, updated_at)
VALUES
('Assistente Administrativo','Administrativo','Organizacao, uso de planilhas, comunicacao interna','Rotina estruturada e contato com equipe','Escritorio interno','Planilhas, sistema interno, email','Poucas barreiras de ruido; demanda por organizacao','Alta possibilidade de adaptacao',1,'2026-04-15 13:00:00','2026-04-15 13:00:00'),
('Analista de Dados','TI','Analise, atencao a detalhes, uso intenso de sistema','Rotina previsivel com entregas por projeto','Ambiente de escritorio','BI, sistema, dashboards','Barreiras digitais se sistema for inacessivel','Alta possibilidade de adaptacao',1,'2026-04-15 13:05:00','2026-04-15 13:05:00'),
('Atendimento Presencial','Recepcao','Comunicacao constante e orientacao ao publico','Fluxo continuo e contato com pessoas','Ambiente movimentado','Telefone, sistema, atendimento presencial','Barreiras de comunicacao e sobrecarga','Media possibilidade de adaptacao',1,'2026-04-15 13:10:00','2026-04-15 13:10:00'),
('Controle Operacional','Operacoes','Acompanhamento de rotinas e registros','Rotina parcialmente estruturada','Ambiente industrial moderado','Painel, radio, sistema','Barreiras de ruido e deslocamento','Media possibilidade de adaptacao',1,'2026-04-15 13:15:00','2026-04-15 13:15:00'),
('Suporte Interno','RH','Atendimento interno, organizacao e suporte a processos','Rotina previsivel','Ambiente corporativo','Email, sistema, documentos','Poucas barreiras, depende de organizacao','Alta possibilidade de adaptacao',1,'2026-04-15 13:20:00','2026-04-15 13:20:00');

INSERT INTO matches
(pontuacao_compatibilidade, areas_recomendadas, adaptacoes_recomendadas, riscos_incompatibilidade, justificativa, plano_inicial_acolhimento, created_at, perfis_funcionais_idperfis_funcionais, vagas_idvagas)
VALUES
(92.00,'Administrativo interno','Checklist visual e instrucao objetiva','Baixo risco','Perfil com boa aderencia a rotina estruturada','Acompanhamento semanal inicial','2026-04-15 14:00:00',1,1),
(89.00,'TI e analise de dados','Recursos visuais e comunicacao escrita','Baixo risco','Boa compatibilidade com ambiente digital e comunicacao textual','Treinamento inicial acessivel','2026-04-15 14:05:00',2,2),
(78.00,'Controle operacional','Reducao de ruido e posto mais adequado','Risco medio por ruido','Perfil tecnico com necessidade de ambiente menos estimulante','Ajuste gradual do posto','2026-04-15 14:10:00',3,4),
(81.00,'Suporte interno','Planejamento claro e rotina definida','Risco medio por desorganizacao da area','Boa energia e dinamismo com necessidade de estrutura','Mentoria inicial com gestor','2026-04-15 14:15:00',4,5),
(94.00,'RH e administrativo','Acesso fisico adequado e posto adaptado','Baixo risco','Alta compatibilidade com area interna e menor deslocamento','Validacao das adaptacoes antes do inicio','2026-04-15 14:20:00',5,5);

SELECT * FROM solicitacoes;
SELECT * FROM solucoes;
SELECT * FROM encaminhamento;
SELECT * FROM feedbacks;
SELECT * FROM arquivos;
SELECT * FROM logs_ia;
SELECT * FROM perfis_funcionais;
SELECT * FROM vagas;
SELECT * FROM matches;
