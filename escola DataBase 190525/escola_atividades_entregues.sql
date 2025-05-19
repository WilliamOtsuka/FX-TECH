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
  PRIMARY KEY (`idEntrega`),
  KEY `idAluno` (`idAluno`),
  KEY `idAtividade` (`idAtividade`),
  CONSTRAINT `atividades_entregues_ibfk_1` FOREIGN KEY (`idAluno`) REFERENCES `alunos` (`idAluno`),
  CONSTRAINT `atividades_entregues_ibfk_2` FOREIGN KEY (`idAtividade`) REFERENCES `atividades` (`idAtividade`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividades_entregues`
--

LOCK TABLES `atividades_entregues` WRITE;
/*!40000 ALTER TABLE `atividades_entregues` DISABLE KEYS */;
INSERT INTO `atividades_entregues` VALUES (1,1,21,'teste envio tarefa','2025-05-06 00:00:00','corrigida'),(2,2,21,'testesdfsad','2025-05-06 00:00:00','pendente'),(3,1,25,NULL,'2025-05-06 18:25:34','corrigida'),(4,2,25,NULL,'2025-05-06 18:25:34','pendente'),(5,3,25,NULL,'2025-05-06 18:25:34','pendente'),(6,4,25,NULL,'2025-05-06 18:25:34','pendente'),(7,5,25,NULL,'2025-05-06 18:25:34','pendente'),(8,6,25,NULL,'2025-05-06 18:25:34','pendente'),(9,7,25,NULL,'2025-05-06 18:25:34','pendente'),(40,1,28,'adsadas','2025-05-08 00:00:00','pendente');
/*!40000 ALTER TABLE `atividades_entregues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 17:04:33
