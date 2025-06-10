-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: escola
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos` (
  `idAluno` int NOT NULL AUTO_INCREMENT,
  `pai` varchar(45) DEFAULT NULL,
  `mae` varchar(45) DEFAULT NULL,
  `historico_escolar` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`idAluno`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
INSERT INTO `alunos` VALUES (1,'Gilberto Otsuka','Lucy Otsuka',NULL),(2,'Carlos Silva','Ana Silva',NULL),(3,'Roberto Oliveira','Cláudia Oliveira',NULL),(4,'Eduardo Souza','Patrícia Souza',NULL),(5,'Fernando Fernandes','Juliana Fernandes',NULL),(6,'Marcelo Ramos','Eliane Ramos',NULL),(7,'Paulo Costa','Renata Costa',NULL),(8,'Ricardo Lima','Gabriela Lima',NULL),(9,'André Rocha','Camila Rocha',NULL),(10,'Bruno Martins','Isabela Martins',NULL),(11,'João Almeida','Sônia Almeida',NULL),(12,'Luiz Monteiro','Karla Monteiro',NULL),(13,'Lucas Batista','Fernanda Batista',NULL),(14,'Marcos Dias','Mariana Dias',NULL),(15,'Sérgio Teixeira','Nathalia Teixeira',NULL),(16,'Rafael Figueiredo','Olivia Figueiredo',NULL),(17,'Pedro Henrique','Larissa Henrique',NULL),(18,'Antônio Barbosa','Quésia Barbosa',NULL),(19,'José Nogueira','Rafaela Nogueira',NULL),(20,'Carlos Carvalho','Sabrina Carvalho',NULL),(21,'Thiago Menezes','Luciana Menezes',NULL),(40,'Gilberto Otsuka','Lucy Otsuka',NULL);
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ano_letivo`
--

DROP TABLE IF EXISTS `ano_letivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ano_letivo` (
  `idAno_letivo` int NOT NULL AUTO_INCREMENT,
  `ano` varchar(20) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `situacao` enum('planejado','ativo','encerrado') NOT NULL DEFAULT 'planejado',
  `ano_corrente` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idAno_letivo`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ano_letivo`
--

LOCK TABLES `ano_letivo` WRITE;
/*!40000 ALTER TABLE `ano_letivo` DISABLE KEYS */;
INSERT INTO `ano_letivo` VALUES (1,'2025','2025-02-01','2025-12-20','ativo',1),(2,'2024','2024-02-05','2024-12-13','encerrado',0);
/*!40000 ALTER TABLE `ano_letivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atividades`
--

DROP TABLE IF EXISTS `atividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atividades` (
  `idAtividade` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `dataEntrega` date NOT NULL,
  `hora` time NOT NULL,
  `peso` int NOT NULL,
  `idDisciplina` int NOT NULL,
  `status` enum('disponivel','indisponivel') NOT NULL,
  `idTurma` int NOT NULL,
  `tipo` enum('atividade','avaliativa') NOT NULL,
  PRIMARY KEY (`idAtividade`),
  KEY `atividade_ibfk_1` (`idDisciplina`),
  KEY `atividadeas_ibfk_2_idx` (`idTurma`),
  CONSTRAINT `atividadeas_ibfk_2` FOREIGN KEY (`idTurma`) REFERENCES `turmas` (`idTurma`),
  CONSTRAINT `atividades_ibfk_1` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplinas` (`idDisciplina`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividades`
--

LOCK TABLES `atividades` WRITE;
/*!40000 ALTER TABLE `atividades` DISABLE KEYS */;
INSERT INTO `atividades` VALUES (35,'Trabalho de Física 2º Bimestre','Exercícios das páginas - 203 até 204 do livro','2025-06-09','18:34:00',10,1,'indisponivel',1,'atividade');
/*!40000 ALTER TABLE `atividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colaboradores`
--

DROP TABLE IF EXISTS `colaboradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colaboradores` (
  `idColaboradores` int NOT NULL AUTO_INCREMENT,
  `permition` int NOT NULL,
  `cargo` text NOT NULL,
  PRIMARY KEY (`idColaboradores`),
  UNIQUE KEY `idColaboradores_UNIQUE` (`idColaboradores`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colaboradores`
--

LOCK TABLES `colaboradores` WRITE;
/*!40000 ALTER TABLE `colaboradores` DISABLE KEYS */;
INSERT INTO `colaboradores` VALUES (1,2,'coordenador'),(2,1,'professor'),(3,1,'professor'),(4,1,'professor'),(5,1,'professor'),(6,1,'professor'),(7,1,'professor'),(9,1,'professor');
/*!40000 ALTER TABLE `colaboradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disciplinas`
--

DROP TABLE IF EXISTS `disciplinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disciplinas` (
  `idDisciplina` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`idDisciplina`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disciplinas`
--

LOCK TABLES `disciplinas` WRITE;
/*!40000 ALTER TABLE `disciplinas` DISABLE KEYS */;
INSERT INTO `disciplinas` VALUES (1,'Física'),(2,'Matemática'),(3,'Biologia'),(4,'Português'),(5,'História'),(6,'Geografia'),(7,'Química'),(8,'Filosofia'),(9,'Sociologia'),(10,'Artes'),(11,'Educação Física'),(12,'Ciências');
/*!40000 ALTER TABLE `disciplinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matricula`
--

DROP TABLE IF EXISTS `matricula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matricula` (
  `idMatricula` int NOT NULL AUTO_INCREMENT,
  `status` enum('cancelada','pendente','concluida','ativa','trancada') NOT NULL,
  `data_matricula` date DEFAULT NULL,
  `tipo` enum('rematricula','inicial') NOT NULL,
  `data_validade` date DEFAULT NULL,
  `data_inscricao` date DEFAULT NULL,
  `data_prazo` date DEFAULT NULL,
  `idAluno` int DEFAULT NULL,
  `idTurma` int DEFAULT NULL,
  `idAno_letivo` int DEFAULT NULL,
  PRIMARY KEY (`idMatricula`),
  KEY `matricula_fk1_idx` (`idAluno`),
  KEY `matricula_fk2_idx` (`idAno_letivo`),
  KEY `matricula_fk3_idx` (`idTurma`),
  CONSTRAINT `matricula_fk1` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`),
  CONSTRAINT `matricula_fk2` FOREIGN KEY (`idAno_letivo`) REFERENCES `ano_letivo` (`idAno_letivo`),
  CONSTRAINT `matricula_fk3` FOREIGN KEY (`idTurma`) REFERENCES `turmas` (`idTurma`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matricula`
--

LOCK TABLES `matricula` WRITE;
/*!40000 ALTER TABLE `matricula` DISABLE KEYS */;
INSERT INTO `matricula` VALUES (1,'ativa','2025-01-02','inicial','2025-12-20',NULL,NULL,1,1,1),(3,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,5,1,1),(4,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,6,1,1),(5,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,7,1,1),(6,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,8,2,1),(7,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,9,2,1),(8,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,10,2,1),(9,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,11,2,1),(10,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,12,2,1),(11,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,13,2,1),(12,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,14,2,1),(13,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,15,3,1),(14,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,16,3,1),(15,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,17,3,1),(16,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,18,3,1),(17,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,19,3,1),(18,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,20,3,1),(19,'ativa','2025-02-01','inicial','2025-12-20',NULL,NULL,21,3,1),(62,'pendente',NULL,'inicial',NULL,'2025-06-09','2025-07-09',40,NULL,NULL);
/*!40000 ALTER TABLE `matricula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas`
--

DROP TABLE IF EXISTS `notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas` (
  `idNota` int NOT NULL AUTO_INCREMENT,
  `idAluno` int NOT NULL,
  `idAtividade` int NOT NULL,
  `feedback` varchar(1000) NOT NULL,
  `nota` float NOT NULL,
  `entregue` enum('nao','sim') NOT NULL,
  `arquivo_feedback` varchar(255) DEFAULT NULL,
  `descricao` text,
  `dataEntrega` date DEFAULT NULL,
  `correcao` enum('pendente','corrigida') NOT NULL,
  `arquivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idNota`),
  KEY `notas_ibfk_1_idx` (`idAluno`),
  KEY `notas_ibfk_2_idx` (`idAtividade`),
  CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`),
  CONSTRAINT `notas_ibfk_2` FOREIGN KEY (`idAtividade`) REFERENCES `atividades` (`idAtividade`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
INSERT INTO `notas` VALUES (103,3,35,'parabens!',9,'sim','1749507024761-bulb.png','Exercicios:\r\n1- a)\r\n2- a)\r\n3- c)\r\n4- b)\r\n5- a)\r\n6- d)','2025-06-09','corrigida',NULL),(116,1,35,'Não entregue',0,'nao',NULL,NULL,NULL,'corrigida',NULL),(117,2,35,'Não entregue',0,'nao',NULL,NULL,NULL,'corrigida',NULL),(118,4,35,'Não entregue',0,'nao',NULL,NULL,NULL,'corrigida',NULL),(119,5,35,'Não entregue',0,'nao',NULL,NULL,NULL,'corrigida',NULL),(120,6,35,'Não entregue',0,'nao',NULL,NULL,NULL,'corrigida',NULL),(121,7,35,'Não entregue',0,'nao',NULL,NULL,NULL,'corrigida',NULL);
/*!40000 ALTER TABLE `notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodo_letivo`
--

DROP TABLE IF EXISTS `periodo_letivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodo_letivo` (
  `idPeriodo_letivo` int NOT NULL AUTO_INCREMENT,
  `idAno_letivo` int NOT NULL,
  `nome` varchar(50) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  PRIMARY KEY (`idPeriodo_letivo`,`idAno_letivo`),
  KEY `periodo_fk_idx` (`idAno_letivo`),
  CONSTRAINT `periodo_fk` FOREIGN KEY (`idAno_letivo`) REFERENCES `ano_letivo` (`idAno_letivo`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodo_letivo`
--

LOCK TABLES `periodo_letivo` WRITE;
/*!40000 ALTER TABLE `periodo_letivo` DISABLE KEYS */;
INSERT INTO `periodo_letivo` VALUES (1,1,'1º Bimestre','2025-02-01','2025-04-05'),(2,1,'2º Bimestre','2025-04-06','2025-06-15'),(3,1,'3º Bimestre','2025-08-04','2025-10-01'),(4,1,'4º Bimestre','2025-10-02','2025-12-03'),(9,2,'1º Bimestre','2024-02-05','2024-04-12'),(10,2,'2º Bimestre','2024-04-15','2024-06-21'),(11,2,'3º Bimestre','2024-07-22','2024-09-27'),(12,2,'4º Bimestre','2024-09-30','2024-12-13');
/*!40000 ALTER TABLE `periodo_letivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor_turma`
--

DROP TABLE IF EXISTS `professor_turma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor_turma` (
  `idColaboradores` int NOT NULL,
  `idTurma` int NOT NULL,
  `idDisciplina` int NOT NULL,
  PRIMARY KEY (`idColaboradores`,`idTurma`,`idDisciplina`),
  KEY `pt_fk2_idx` (`idTurma`),
  KEY `pt_fk3_idx` (`idDisciplina`),
  CONSTRAINT `pt_fk1` FOREIGN KEY (`idColaboradores`) REFERENCES `colaboradores` (`idColaboradores`),
  CONSTRAINT `pt_fk2` FOREIGN KEY (`idTurma`) REFERENCES `turmas` (`idTurma`),
  CONSTRAINT `pt_fk3` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplinas` (`idDisciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_turma`
--

LOCK TABLES `professor_turma` WRITE;
/*!40000 ALTER TABLE `professor_turma` DISABLE KEYS */;
INSERT INTO `professor_turma` VALUES (2,1,1),(2,2,1),(2,6,2),(3,6,12);
/*!40000 ALTER TABLE `professor_turma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quadro`
--

DROP TABLE IF EXISTS `quadro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quadro` (
  `idAluno` int NOT NULL,
  `idAtividade` int NOT NULL,
  `idDisciplina` int NOT NULL,
  `idTurma` int NOT NULL,
  PRIMARY KEY (`idAluno`,`idAtividade`,`idDisciplina`,`idTurma`),
  KEY `aluno_idx` (`idAluno`),
  KEY `turma_idx` (`idTurma`),
  KEY `disciplina_idx` (`idDisciplina`),
  KEY `atividade_idx` (`idAtividade`),
  CONSTRAINT `aluno` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`),
  CONSTRAINT `atividade` FOREIGN KEY (`idAtividade`) REFERENCES `atividades` (`idAtividade`),
  CONSTRAINT `disciplina` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplinas` (`idDisciplina`),
  CONSTRAINT `turma` FOREIGN KEY (`idTurma`) REFERENCES `turmas` (`idTurma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quadro`
--

LOCK TABLES `quadro` WRITE;
/*!40000 ALTER TABLE `quadro` DISABLE KEYS */;
/*!40000 ALTER TABLE `quadro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `idAluno` int NOT NULL,
  `idTurma` int NOT NULL,
  PRIMARY KEY (`idAluno`,`idTurma`),
  KEY `turma_idx` (`idTurma`),
  CONSTRAINT `turma_fk1` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`),
  CONSTRAINT `turma_fk2` FOREIGN KEY (`idTurma`) REFERENCES `turmas` (`idTurma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3);
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serie`
--

DROP TABLE IF EXISTS `serie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serie` (
  `idSerie` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `ensino` enum('fundamental','médio') NOT NULL,
  PRIMARY KEY (`idSerie`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serie`
--

LOCK TABLES `serie` WRITE;
/*!40000 ALTER TABLE `serie` DISABLE KEYS */;
INSERT INTO `serie` VALUES (1,'1º ano','fundamental'),(2,'2º ano','fundamental'),(3,'3º ano','fundamental'),(4,'4º ano','fundamental'),(5,'5º ano','fundamental'),(6,'6º ano','fundamental'),(7,'7º ano','fundamental'),(8,'8º ano','fundamental'),(9,'9º ano','fundamental'),(10,'1º ano','médio'),(11,'2º ano','médio'),(12,'3º ano','médio');
/*!40000 ALTER TABLE `serie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma_disciplinas`
--

DROP TABLE IF EXISTS `turma_disciplinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turma_disciplinas` (
  `idTurma` int NOT NULL,
  `idDisciplina` int NOT NULL,
  PRIMARY KEY (`idTurma`,`idDisciplina`),
  KEY `td_fk2_idx` (`idDisciplina`),
  CONSTRAINT `td_fk1` FOREIGN KEY (`idTurma`) REFERENCES `turmas` (`idTurma`),
  CONSTRAINT `td_fk2` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplinas` (`idDisciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma_disciplinas`
--

LOCK TABLES `turma_disciplinas` WRITE;
/*!40000 ALTER TABLE `turma_disciplinas` DISABLE KEYS */;
INSERT INTO `turma_disciplinas` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(9,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(1,3),(2,3),(3,3),(4,3),(5,3),(9,3),(1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(9,4),(1,5),(2,5),(3,5),(4,5),(5,5),(6,5),(1,6),(2,6),(3,6),(4,6),(5,6),(6,6),(1,7),(2,7),(3,7),(4,7),(5,7),(1,8),(2,8),(3,8),(4,8),(5,8),(1,9),(2,9),(3,9),(4,9),(5,9),(1,10),(2,10),(3,10),(4,10),(5,10),(6,10),(1,11),(2,11),(3,11),(4,11),(5,11),(6,11),(6,12),(9,12);
/*!40000 ALTER TABLE `turma_disciplinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turmas`
--

DROP TABLE IF EXISTS `turmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turmas` (
  `idTurma` int NOT NULL AUTO_INCREMENT,
  `idSerie` int NOT NULL,
  `idAno_letivo` int NOT NULL,
  `codigo` enum('A','B','C') NOT NULL,
  `turno` enum('manhã','tarde','noite') NOT NULL,
  PRIMARY KEY (`idTurma`,`idAno_letivo`,`idSerie`),
  KEY `t_fk1_idx` (`idSerie`),
  KEY `t_fk2_idx` (`idAno_letivo`),
  CONSTRAINT `t_fk1` FOREIGN KEY (`idSerie`) REFERENCES `serie` (`idSerie`),
  CONSTRAINT `t_fk2` FOREIGN KEY (`idAno_letivo`) REFERENCES `ano_letivo` (`idAno_letivo`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--

LOCK TABLES `turmas` WRITE;
/*!40000 ALTER TABLE `turmas` DISABLE KEYS */;
INSERT INTO `turmas` VALUES (1,10,1,'A','manhã'),(2,11,1,'B','manhã'),(3,12,1,'C','manhã'),(4,10,1,'B','manhã'),(5,10,2,'A','manhã'),(6,9,1,'A','manhã'),(9,2,1,'A','tarde');
/*!40000 ALTER TABLE `turmas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `RA` varchar(20) DEFAULT NULL,
  `senha` text,
  `rg` varchar(12) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `email_pessoal` varchar(255) DEFAULT NULL,
  `email_educacional` varchar(255) DEFAULT NULL,
  `contato` varchar(15) DEFAULT NULL,
  `tipo` enum('aluno','colaborador') NOT NULL,
  `cep` varchar(100) DEFAULT NULL,
  `numero` int DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `idReferencia` int NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`,`idReferencia`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'William Otsuka','202300021','123456','11.111.111-1','000.000.000-01','william.otsuka60@hotmail.com','william.otsuka@horizon.com.br','(11) 90000-0001','aluno','01000-000',1001,'2006-01-10',1,NULL),(2,'Coordenador','102300001','139980','22.222.222-2','000.000.000-02','coordenador@email.com','coordenador.coord@horizon.br','(11) 90000-0002','colaborador','01000-001',1002,'1980-02-15',1,NULL),(3,'Professor de Física','102400001','111111','33.333.333-3','000.000.000-03','professorFísica@gmail.com','professorFísica.prof@horizon.br','(11) 90000-0003','colaborador','01000-002',1003,'1985-03-20',2,NULL),(4,'Professor2','102500001','222222','44.444.444-4','000.000.000-04','professor2@hotmail.com','professor2.professor2@horizon.br','(11) 90000-0004','colaborador','01000-003',1004,'1987-04-25',3,NULL),(5,'Ana Silva','202300001','234567','55.555.555-5','000.000.000-05','ana_silva23@yahoo.com','ana.silva@horizon.com.br','(11) 90000-0005','aluno','01000-004',1005,'2006-05-05',2,NULL),(6,'Bruno Oliveira','202300002','345678','66.666.666-6','000.000.000-06','bruno.oliveira13@outlook.com','bruno.oliveira@horizon.com.br','(11) 90000-0006','aluno','01000-005',1006,'2006-06-12',3,NULL),(7,'Carla Souza','202300003','456789','77.777.777-7','000.000.000-07','carla_souza79@gmail.com','carla.souza@horizon.com.br','(11) 90000-0007','aluno','01000-006',1007,'2006-07-18',4,NULL),(8,'Diego Fernandes','202300004','567890','88.888.888-8','000.000.000-08','diego.fernandes76@hotmail.com','diego.fernandes@horizon.com.br','(11) 90000-0008','aluno','01000-007',1008,'2006-08-22',5,NULL),(9,'Elisa Ramos','202300005','678901','99.999.999-9','000.000.000-09','elisa_ramos43@yahoo.com','elisa.ramos@horizon.com.br','(11) 90000-0009','aluno','01000-008',1009,'2006-09-30',6,NULL),(10,'Felipe Costa','202300006','789012','10.101.010-1','000.000.000-10','felipe.costa69@outlook.com','felipe.costa@horizon.com.br','(11) 90000-0010','aluno','01000-009',1010,'2006-10-11',7,NULL),(11,'Gabriela Lima','202300007','890123','11.202.020-2','000.000.000-11','gabriela_lima25@gmail.com','gabriela.lima@horizon.com.br','(11) 90000-0011','aluno','01000-010',1011,'2006-11-03',8,NULL),(12,'Henrique Rocha','202300008','901234','12.303.030-3','000.000.000-12','henrique.rocha90@hotmail.com','henrique.rocha@horizon.com.br','(11) 90000-0012','aluno','01000-011',1012,'2006-12-14',9,NULL),(13,'Isabela Martins','202300009','112233','13.404.040-4','000.000.000-13','isabela_martins94@yahoo.com','isabela.martins@horizon.com.br','(11) 90000-0013','aluno','01000-012',1013,'2007-01-09',10,NULL),(14,'João Almeida','202300010','223344','14.505.050-5','000.000.000-14','joão.almeida11@outlook.com','joão.almeida@horizon.com.br','(11) 90000-0014','aluno','01000-013',1014,'2007-02-17',11,NULL),(15,'Karla Monteiro','202300011','334455','15.606.060-6','000.000.000-15','karla_monteiro33@gmail.com','karla.monteiro@horizon.com.br','(11) 90000-0015','aluno','01000-014',1015,'2007-03-23',12,NULL),(16,'Lucas Batista','202300012','445566','16.707.070-7','000.000.000-16','lucas.batista34@hotmail.com','lucas.batista@horizon.com.br','(11) 90000-0016','aluno','01000-015',1016,'2007-04-28',13,NULL),(17,'Mariana Dias','202300013','556677','17.808.080-8','000.000.000-17','mariana_dias59@yahoo.com','mariana.dias@horizon.com.br','(11) 90000-0017','aluno','01000-016',1017,'2007-05-06',14,NULL),(18,'Nicolas Teixeira','202300014','667788','18.909.090-9','000.000.000-18','nicolas.teixeira95@outlook.com','nicolas.teixeira@horizon.com.br','(11) 90000-0018','aluno','01000-017',1018,'2007-06-13',15,NULL),(19,'Olivia Figueiredo','202300015','778899','19.010.101-0','000.000.000-19','olivia_figueiredo19@gmail.com','olivia.figueiredo@horizon.com.br','(11) 90000-0019','aluno','01000-018',1019,'2007-07-21',16,NULL),(20,'Pedro Henrique','202300016','889900','20.121.212-1','000.000.000-20','pedro.henrique69@hotmail.com','pedro.henrique@horizon.com.br','(11) 90000-0020','aluno','01000-019',1020,'2007-08-29',17,NULL),(21,'Quésia Barbosa','202300017','990011','21.232.323-2','000.000.000-21','quésia_barbosa98@yahoo.com','quésia.barbosa@horizon.com.br','(11) 90000-0021','aluno','01000-020',1021,'2007-09-30',18,NULL),(22,'Rafael Nogueira','202300018','101010','22.343.434-3','000.000.000-22','rafael.nogueira95@outlook.com','rafael.nogueira@horizon.com.br','(11) 90000-0022','aluno','01000-021',1022,'2007-10-15',19,NULL),(23,'Sabrina Carvalho','202300019','202020','23.454.545-4','000.000.000-23','sabrina_carvalho83@gmail.com','sabrina.carvalho@horizon.com.br','(11) 90000-0023','aluno','01000-022',1023,'2007-11-20',20,NULL),(24,'Thiago Menezes','202300020','303030','24.565.656-5','000.000.000-24','thiago.menezes28@hotmail.com','thiago.menezes@horizon.com.br','(11) 90000-0024','aluno','01000-023',1024,'2007-12-25',21,NULL),(26,'Professor de PT','102300002','333333','25.676.767-6','000.000.000-25','professorPT@gmail.com','professorPT.prof@horizon.br','(11) 90000-0025','colaborador','01000-024',1025,'1988-05-10',4,NULL),(27,'Professor História','102400002','historia','26.787.878-7','000.000.000-26','professor_história@gmail.com','professor.historia@horizon.com.br','1899913271','colaborador','01000-025',1026,NULL,7,NULL),(37,'William Akio Otsuka','20250001',NULL,'28.909.090-9','000.000.000-27','wotsuka@unoeste.edu.br',NULL,'(18)98808-5361','aluno','19042-040',470,'2003-11-21',40,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-09 21:12:13
