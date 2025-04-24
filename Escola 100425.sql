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

DROP TABLE IF EXISTS alunos;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE alunos (
  idAluno int NOT NULL AUTO_INCREMENT,
  nome text,
  RA text,
  PRIMARY KEY (idAluno)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES alunos WRITE;
/*!40000 ALTER TABLE alunos DISABLE KEYS */;
INSERT INTO alunos VALUES (1,'William Otsuka','111222333'),(2,'Ana Silva','202300001'),(3,'Bruno Oliveira','202300002'),(4,'Carla Souza','202300003'),(5,'Diego Fernandes','202300004'),(6,'Elisa Ramos','202300005'),(7,'Felipe Costa','202300006'),(8,'Gabriela Lima','202300007'),(9,'Henrique Rocha','202300008'),(10,'Isabela Martins','202300009'),(11,'João Almeida','202300010'),(12,'Karla Monteiro','202300011'),(13,'Lucas Batista','202300012'),(14,'Mariana Dias','202300013'),(15,'Nicolas Teixeira','202300014'),(16,'Olivia Figueiredo','202300015'),(17,'Pedro Henrique','202300016'),(18,'Quésia Barbosa','202300017'),(19,'Rafael Nogueira','202300018'),(20,'Sabrina Carvalho','202300019'),(21,'Thiago Menezes','202300020');
/*!40000 ALTER TABLE alunos ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alunos_turma`
--

DROP TABLE IF EXISTS alunos_turma;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE alunos_turma (
  idAluno int NOT NULL,
  idTurma int NOT NULL,
  PRIMARY KEY (idAluno,idTurma),
  UNIQUE KEY idAluno_UNIQUE (idAluno)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos_turma`
--

LOCK TABLES alunos_turma WRITE;
/*!40000 ALTER TABLE alunos_turma DISABLE KEYS */;
INSERT INTO alunos_turma VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,3),(16,3),(17,3),(18,3),(19,3),(20,3),(21,3);
/*!40000 ALTER TABLE alunos_turma ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atividade`
--

DROP TABLE IF EXISTS atividade;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE atividade (
  idAtividade int NOT NULL AUTO_INCREMENT,
  titulo varchar(255) NOT NULL,
  descricao text,
  dataEntrega date NOT NULL,
  hora time NOT NULL,
  peso int NOT NULL,
  idMateria int NOT NULL,
  PRIMARY KEY (idAtividade),
  KEY atividade_ibfk_1 (idMateria),
  CONSTRAINT atividade_ibfk_1 FOREIGN KEY (idMateria) REFERENCES materia (idMateria)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividade`
--

LOCK TABLES atividade WRITE;
/*!40000 ALTER TABLE atividade DISABLE KEYS */;
INSERT INTO atividade VALUES (1,'Trabalho de Física','Experimento sobre eletricidade','2025-04-10','14:00:00',10,1),(2,'Trabalho de Biologia','Pesquisa sobre anfíbios','2025-04-30','17:59:00',5,3),(11,'Trabalho de Matemática','Progressão Aritmética\n\nan = a1 + (n - 1) r\n\nan: termo geral\na1: 1º termo\nn: número de termos\nr: razão da PA','2025-04-18','15:59:00',25,2);
/*!40000 ALTER TABLE atividade ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `atividades_entregues`
--

DROP TABLE IF EXISTS atividades_entregues;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE atividades_entregues (
  idEntrega int NOT NULL AUTO_INCREMENT,
  idAluno int NOT NULL,
  idAtividade int NOT NULL,
  descricao text,
  dataEntrega datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (idEntrega),
  KEY idAluno (idAluno),
  KEY idAtividade (idAtividade),
  CONSTRAINT atividades_entregues_ibfk_1 FOREIGN KEY (idAluno) REFERENCES alunos (idAluno),
  CONSTRAINT atividades_entregues_ibfk_2 FOREIGN KEY (idAtividade) REFERENCES atividade (idAtividade)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividades_entregues`
--

LOCK TABLES atividades_entregues WRITE;
/*!40000 ALTER TABLE atividades_entregues DISABLE KEYS */;
INSERT INTO atividades_entregues VALUES (2,1,1,'teste','2025-04-08 00:00:00');
/*!40000 ALTER TABLE atividades_entregues ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colaboradores`
--

DROP TABLE IF EXISTS colaboradores;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE colaboradores (
  idColaboradores int NOT NULL AUTO_INCREMENT,
  nome text,
  ra text,
  permition int DEFAULT NULL,
  cargo text,
  PRIMARY KEY (idColaboradores),
  UNIQUE KEY idColaboradores_UNIQUE (idColaboradores)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colaboradores`
--

LOCK TABLES colaboradores WRITE;
/*!40000 ALTER TABLE colaboradores DISABLE KEYS */;
INSERT INTO colaboradores VALUES (1,'admin','0001112223',2,'funcionario'),(2,'Professor1','1111111111',1,'professor'),(3,'Professro2','2222222222',1,'professor');
/*!40000 ALTER TABLE colaboradores ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS materia;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE materia (
  idMateria int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  PRIMARY KEY (idMateria)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES materia WRITE;
/*!40000 ALTER TABLE materia DISABLE KEYS */;
INSERT INTO materia VALUES (1,'Física'),(2,'Matemática'),(3,'Biologia'),(4,'Português'),(5,'História'),(6,'Geografia'),(7,'Química'),(8,'Filosofia'),(9,'Sociologia'),(10,'Artes'),(11,'Educação Física'),(12,'Ciências');
/*!40000 ALTER TABLE materia ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor_turma`
--

DROP TABLE IF EXISTS professor_turma;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE professor_turma (
  idColaboradores int NOT NULL,
  idTurma int NOT NULL,
  idMateria int NOT NULL,
  PRIMARY KEY (idColaboradores)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_turma`
--

LOCK TABLES professor_turma WRITE;
/*!40000 ALTER TABLE professor_turma DISABLE KEYS */;
INSERT INTO professor_turma VALUES (1,2,1),(2,1,1),(3,1,2);
/*!40000 ALTER TABLE professor_turma ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma_materias`
--

DROP TABLE IF EXISTS turma_materias;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE turma_materias (
  idTurma int NOT NULL,
  idMateria int NOT NULL,
  PRIMARY KEY (idTurma,idMateria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma_materias`
--

LOCK TABLES turma_materias WRITE;
/*!40000 ALTER TABLE turma_materias DISABLE KEYS */;
INSERT INTO turma_materias VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(3,2),(3,4),(3,5),(3,6),(3,8),(3,9),(3,10),(3,11),(3,12);
/*!40000 ALTER TABLE turma_materias ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turmas`
--

DROP TABLE IF EXISTS turmas;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE turmas (
  idTurma int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  ano int DEFAULT NULL,
  nivel enum('fundamental','médio') NOT NULL,
  PRIMARY KEY (idTurma)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--

LOCK TABLES turmas WRITE;
/*!40000 ALTER TABLE turmas DISABLE KEYS */;
INSERT INTO turmas VALUES (1,'1º ano A',2025,'médio'),(2,'1º ano B',2025,'médio'),(3,'9º ano A',2025,'fundamental');
/*!40000 ALTER TABLE turmas ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS usuarios;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE usuarios (
  idUsuario int NOT NULL AUTO_INCREMENT,
  senha text NOT NULL,
  tipo enum('aluno','professor','funcionario') NOT NULL,
  idReferencia int NOT NULL,
  PRIMARY KEY (idUsuario)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES usuarios WRITE;
/*!40000 ALTER TABLE usuarios DISABLE KEYS */;
INSERT INTO usuarios VALUES (1,'123456','aluno',1),(2,'139980','funcionario',1),(3,'111111','professor',2),(4,'222222','professor',3),(5,'234567','aluno',2),(6,'345678','aluno',3),(7,'456789','aluno',4),(8,'567890','aluno',5),(9,'678901','aluno',6),(10,'789012','aluno',7),(11,'890123','aluno',8),(12,'901234','aluno',9),(13,'112233','aluno',10),(14,'223344','aluno',11),(15,'334455','aluno',12),(16,'445566','aluno',13),(17,'556677','aluno',14),(18,'667788','aluno',15),(19,'778899','aluno',16),(20,'889900','aluno',17),(21,'990011','aluno',18),(22,'101010','aluno',19),(23,'202020','aluno',20),(24,'303030','aluno',21);
/*!40000 ALTER TABLE usuarios ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10 18:37:52
