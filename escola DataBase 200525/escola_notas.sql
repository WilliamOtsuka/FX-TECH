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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-20 14:35:20
