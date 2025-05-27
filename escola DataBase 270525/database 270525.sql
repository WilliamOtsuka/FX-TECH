CREATE DATABASE  IF NOT EXISTS `escola` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `escola`;
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
  PRIMARY KEY (`idAluno`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
INSERT INTO `alunos` VALUES (1,'Gilberto Otsuka','Lucy Otsuka'),(2,'Carlos Silva','Ana Silva'),(3,'Roberto Oliveira','Cláudia Oliveira'),(4,'Eduardo Souza','Patrícia Souza'),(5,'Fernando Fernandes','Juliana Fernandes'),(6,'Marcelo Ramos','Eliane Ramos'),(7,'Paulo Costa','Renata Costa'),(8,'Ricardo Lima','Gabriela Lima'),(9,'André Rocha','Camila Rocha'),(10,'Bruno Martins','Isabela Martins'),(11,'João Almeida','Sônia Almeida'),(12,'Luiz Monteiro','Karla Monteiro'),(13,'Lucas Batista','Fernanda Batista'),(14,'Marcos Dias','Mariana Dias'),(15,'Sérgio Teixeira','Nathalia Teixeira'),(16,'Rafael Figueiredo','Olivia Figueiredo'),(17,'Pedro Henrique','Larissa Henrique'),(18,'Antônio Barbosa','Quésia Barbosa'),(19,'José Nogueira','Rafaela Nogueira'),(20,'Carlos Carvalho','Sabrina Carvalho'),(21,'Thiago Menezes','Luciana Menezes');
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alunos_turma`
--

DROP TABLE IF EXISTS `alunos_turma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos_turma` (
  `idAluno` int NOT NULL,
  `idTurma` int NOT NULL,
  PRIMARY KEY (`idAluno`,`idTurma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos_turma`
--

LOCK TABLES `alunos_turma` WRITE;
/*!40000 ALTER TABLE `alunos_turma` DISABLE KEYS */;
INSERT INTO `alunos_turma` VALUES (1,1),(1,6),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3);
/*!40000 ALTER TABLE `alunos_turma` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  CONSTRAINT `atividades_ibfk_1` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplinas` (`idDisciplina`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividades`
--

LOCK TABLES `atividades` WRITE;
/*!40000 ALTER TABLE `atividades` DISABLE KEYS */;
INSERT INTO `atividades` VALUES (21,'Trabalho de Física 2º Bimestre','Teste Trabalho 1','2025-05-06','18:08:00',10,1,'indisponivel',1,'atividade'),(25,'teste prova','prova','2025-09-18','18:25:00',70,1,'disponivel',1,'avaliativa'),(28,'asdfasdasdasdsad','teste','2025-05-13','14:29:00',11,1,'indisponivel',1,'atividade'),(31,'teste atbsadsadsa','sdsadasdas','2025-09-20','14:05:00',4,1,'disponivel',1,'atividade');
/*!40000 ALTER TABLE `atividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atividades_entregues`
--

DROP TABLE IF EXISTS `atividades_entregues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atividades_entregues` (
  `idEntrega` int NOT NULL AUTO_INCREMENT,
  `idAluno` int NOT NULL,
  `idAtividade` int NOT NULL,
  `descricao` text,
  `dataEntrega` datetime DEFAULT CURRENT_TIMESTAMP,
  `correcao` enum('pendente','corrigida') NOT NULL,
  `arquivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idEntrega`),
  KEY `idAluno` (`idAluno`),
  KEY `idAtividade` (`idAtividade`),
  CONSTRAINT `atividades_entregues_ibfk_1` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`),
  CONSTRAINT `atividades_entregues_ibfk_2` FOREIGN KEY (`idAtividade`) REFERENCES `atividades` (`idAtividade`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividades_entregues`
--

LOCK TABLES `atividades_entregues` WRITE;
/*!40000 ALTER TABLE `atividades_entregues` DISABLE KEYS */;
INSERT INTO `atividades_entregues` VALUES (1,1,21,'teste envio tarefa','2025-05-06 00:00:00','corrigida',NULL),(2,2,21,'testesdfsad','2025-05-06 00:00:00','pendente',NULL),(3,1,25,NULL,'2025-05-06 18:25:34','corrigida',NULL),(4,2,25,NULL,'2025-05-06 18:25:34','pendente',NULL),(5,3,25,NULL,'2025-05-06 18:25:34','pendente',NULL),(6,4,25,NULL,'2025-05-06 18:25:34','pendente',NULL),(7,5,25,NULL,'2025-05-06 18:25:34','pendente',NULL),(8,6,25,NULL,'2025-05-06 18:25:34','pendente',NULL),(9,7,25,NULL,'2025-05-06 18:25:34','pendente',NULL),(40,1,28,'adsadas','2025-05-08 00:00:00','pendente',NULL),(43,1,31,'Sem descrição','2025-05-21 00:00:00','pendente','1747862509604-teste.7z');
/*!40000 ALTER TABLE `atividades_entregues` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`idNota`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
INSERT INTO `notas` VALUES (1,3,21,'Não entregue',0,'nao'),(2,4,21,'Não entregue',0,'nao'),(3,5,21,'Não entregue',0,'nao'),(4,6,21,'Não entregue',0,'nao'),(5,7,21,'Não entregue',0,'nao'),(6,1,21,'corrigir tarefa legal',10,'sim'),(7,1,25,'parabens!',10,'sim'),(64,2,28,'Não entregue',0,'nao'),(65,3,28,'Não entregue',0,'nao'),(66,4,28,'Não entregue',0,'nao'),(67,5,28,'Não entregue',0,'nao'),(68,6,28,'Não entregue',0,'nao'),(69,7,28,'Não entregue',0,'nao'),(79,1,31,'Não entregue',0,'nao'),(80,2,31,'Não entregue',0,'nao'),(81,3,31,'Não entregue',0,'nao'),(82,4,31,'Não entregue',0,'nao'),(83,5,31,'Não entregue',0,'nao'),(84,6,31,'Não entregue',0,'nao'),(85,7,31,'Não entregue',0,'nao');
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
  PRIMARY KEY (`idPeriodo_letivo`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`idColaboradores`,`idTurma`,`idDisciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_turma`
--

LOCK TABLES `professor_turma` WRITE;
/*!40000 ALTER TABLE `professor_turma` DISABLE KEYS */;
INSERT INTO `professor_turma` VALUES (2,1,1),(2,2,1),(2,6,2),(2,7,12),(3,6,12);
/*!40000 ALTER TABLE `professor_turma` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`idTurma`,`idDisciplina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma_disciplinas`
--

LOCK TABLES `turma_disciplinas` WRITE;
/*!40000 ALTER TABLE `turma_disciplinas` DISABLE KEYS */;
INSERT INTO `turma_disciplinas` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),(3,10),(3,11),(4,1),(4,2),(4,3),(4,4),(4,5),(4,6),(4,7),(4,8),(4,9),(4,10),(4,11),(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,9),(5,10),(5,11),(6,2),(6,4),(6,5),(6,6),(6,10),(6,11),(6,12),(7,2),(7,4),(7,5),(7,6),(7,10),(7,11),(7,12);
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
  `idSerie` varchar(50) NOT NULL,
  `idAno_letivo` int NOT NULL,
  `codigo` enum('A','B','C') NOT NULL,
  `turno` enum('manhã','tarde','noite') NOT NULL,
  PRIMARY KEY (`idTurma`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--

LOCK TABLES `turmas` WRITE;
/*!40000 ALTER TABLE `turmas` DISABLE KEYS */;
INSERT INTO `turmas` VALUES (1,'10',1,'A','manhã'),(2,'11',1,'B','manhã'),(3,'12',1,'C','manhã'),(4,'10',1,'B','manhã'),(5,'10',2,'A','manhã'),(6,'9',1,'A','manhã'),(7,'9',2,'A','manhã');
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
  `senha` text NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `email_pessoal` varchar(255) DEFAULT NULL,
  `email_educacional` varchar(255) DEFAULT NULL,
  `contato` varchar(15) DEFAULT NULL,
  `tipo` enum('aluno','colaborador') NOT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `idReferencia` int NOT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'William Otsuka','202300021','123456','000.000.000-01','william.otsuka60@hotmail.com','william.otsuka@horizon.com.br','(11) 90000-0001','aluno','Rua das Flores, 123','2006-01-10',1),(2,'Coordenador','102300001','139980','000.000.000-02','coordenador@email.com','coordenador.coord@horizon.br','(11) 90000-0002','colaborador','Avenida Central, 456','1980-02-15',1),(3,'Professor de Física','102400001','111111','000.000.000-03','professorFísica@gmail.com','professorFísica.prof@horizon.br','(11) 90000-0003','colaborador','Rua do Professor, 789','1985-03-20',2),(4,'Professor2','102500001','222222','000.000.000-04','professor2@hotmail.com','professor2.professor2@horizon.br','(11) 90000-0004','colaborador','Rua dos Mestres, 101','1987-04-25',3),(5,'Ana Silva','202300001','234567','000.000.000-05','ana_silva23@yahoo.com','ana.silva@horizon.com.br','(11) 90000-0005','aluno','Rua das Acácias, 202','2006-05-05',2),(6,'Bruno Oliveira','202300002','345678','000.000.000-06','bruno.oliveira13@outlook.com','bruno.oliveira@horizon.com.br','(11) 90000-0006','aluno','Rua dos Estudantes, 303','2006-06-12',3),(7,'Carla Souza','202300003','456789','000.000.000-07','carla_souza79@gmail.com','carla.souza@horizon.com.br','(11) 90000-0007','aluno','Rua das Palmeiras, 404','2006-07-18',4),(8,'Diego Fernandes','202300004','567890','000.000.000-08','diego.fernandes76@hotmail.com','diego.fernandes@horizon.com.br','(11) 90000-0008','aluno','Rua das Laranjeiras, 505','2006-08-22',5),(9,'Elisa Ramos','202300005','678901','000.000.000-09','elisa_ramos43@yahoo.com','elisa.ramos@horizon.com.br','(11) 90000-0009','aluno','Rua das Oliveiras, 606','2006-09-30',6),(10,'Felipe Costa','202300006','789012','000.000.000-10','felipe.costa69@outlook.com','felipe.costa@horizon.com.br','(11) 90000-0010','aluno','Rua das Hortências, 707','2006-10-11',7),(11,'Gabriela Lima','202300007','890123','000.000.000-11','gabriela_lima25@gmail.com','gabriela.lima@horizon.com.br','(11) 90000-0011','aluno','Rua das Rosas, 808','2006-11-03',8),(12,'Henrique Rocha','202300008','901234','000.000.000-12','henrique.rocha90@hotmail.com','henrique.rocha@horizon.com.br','(11) 90000-0012','aluno','Rua das Violetas, 909','2006-12-14',9),(13,'Isabela Martins','202300009','112233','000.000.000-13','isabela_martins94@yahoo.com','isabela.martins@horizon.com.br','(11) 90000-0013','aluno','Rua das Margaridas, 111','2007-01-09',10),(14,'João Almeida','202300010','223344','000.000.000-14','joão.almeida11@outlook.com','joão.almeida@horizon.com.br','(11) 90000-0014','aluno','Rua das Tulipas, 222','2007-02-17',11),(15,'Karla Monteiro','202300011','334455','000.000.000-15','karla_monteiro33@gmail.com','karla.monteiro@horizon.com.br','(11) 90000-0015','aluno','Rua das Orquídeas, 333','2007-03-23',12),(16,'Lucas Batista','202300012','445566','000.000.000-16','lucas.batista34@hotmail.com','lucas.batista@horizon.com.br','(11) 90000-0016','aluno','Rua das Azaleias, 444','2007-04-28',13),(17,'Mariana Dias','202300013','556677','000.000.000-17','mariana_dias59@yahoo.com','mariana.dias@horizon.com.br','(11) 90000-0017','aluno','Rua das Bromélias, 555','2007-05-06',14),(18,'Nicolas Teixeira','202300014','667788','000.000.000-18','nicolas.teixeira95@outlook.com','nicolas.teixeira@horizon.com.br','(11) 90000-0018','aluno','Rua das Dalias, 666','2007-06-13',15),(19,'Olivia Figueiredo','202300015','778899','000.000.000-19','olivia_figueiredo19@gmail.com','olivia.figueiredo@horizon.com.br','(11) 90000-0019','aluno','Rua das Camélias, 777','2007-07-21',16),(20,'Pedro Henrique','202300016','889900','000.000.000-20','pedro.henrique69@hotmail.com','pedro.henrique@horizon.com.br','(11) 90000-0020','aluno','Rua das Begônias, 888','2007-08-29',17),(21,'Quésia Barbosa','202300017','990011','000.000.000-21','quésia_barbosa98@yahoo.com','quésia.barbosa@horizon.com.br','(11) 90000-0021','aluno','Rua das Petúnias, 999','2007-09-30',18),(22,'Rafael Nogueira','202300018','101010','000.000.000-22','rafael.nogueira95@outlook.com','rafael.nogueira@horizon.com.br','(11) 90000-0022','aluno','Rua das Amarílis, 100','2007-10-15',19),(23,'Sabrina Carvalho','202300019','202020','000.000.000-23','sabrina_carvalho83@gmail.com','sabrina.carvalho@horizon.com.br','(11) 90000-0023','aluno','Rua das Gardênias, 200','2007-11-20',20),(24,'Thiago Menezes','202300020','303030','000.000.000-24','thiago.menezes28@hotmail.com','thiago.menezes@horizon.com.br','(11) 90000-0024','aluno','Rua das Magnólias, 300','2007-12-25',21),(26,'Professor de PT','102300002','333333','000.000.000-25','professorPT@gmail.com','professorPT.prof@horizon.br','(11) 90000-0025','colaborador','Rua dos Professores, 400','1988-05-10',4),(27,'Professor História','102400002','historia','000.000.000-26','professor_história@gmail.com','professor.historia@horizon.com.br','1899913271','colaborador',NULL,NULL,7),(29,'Professor História','102500002','sdasdasda','321.312.312-31','dsadsadadsa','professor.historia@horizon.com.br','(32) 13213-1231','colaborador',NULL,NULL,9);
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

-- Dump completed on 2025-05-27 19:08:33
