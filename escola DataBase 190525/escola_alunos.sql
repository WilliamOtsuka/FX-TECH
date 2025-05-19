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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 17:04:32
