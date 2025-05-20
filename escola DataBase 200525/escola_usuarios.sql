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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'William Otsuka','111222333','123456','000.000.000-01','william.otsuka60@hotmail.com','william.otsuka@horizon.com.br','(11) 90000-0001','aluno','Rua das Flores, 123','2006-01-10',1),(2,'Coordenador','100000000','139980','000.000.000-02','coordenador@email.com','coordenador.coord@horizon.br','(11) 90000-0002','colaborador','Avenida Central, 456','1980-02-15',1),(3,'Professor de Física','111111111','111111','000.000.000-03','professorFísica@gmail.com','professorFísica.prof@horizon.br','(11) 90000-0003','colaborador','Rua do Professor, 789','1985-03-20',2),(4,'Professor2','222222222','222222','000.000.000-04','professor2@hotmail.com','professor2.professor2@horizon.br','(11) 90000-0004','colaborador','Rua dos Mestres, 101','1987-04-25',3),(5,'Ana Silva','202300001','234567','000.000.000-05','ana_silva23@yahoo.com','ana.silva@horizon.com.br','(11) 90000-0005','aluno','Rua das Acácias, 202','2006-05-05',2),(6,'Bruno Oliveira','202300002','345678','000.000.000-06','bruno.oliveira13@outlook.com','bruno.oliveira@horizon.com.br','(11) 90000-0006','aluno','Rua dos Estudantes, 303','2006-06-12',3),(7,'Carla Souza','202300003','456789','000.000.000-07','carla_souza79@gmail.com','carla.souza@horizon.com.br','(11) 90000-0007','aluno','Rua das Palmeiras, 404','2006-07-18',4),(8,'Diego Fernandes','202300004','567890','000.000.000-08','diego.fernandes76@hotmail.com','diego.fernandes@horizon.com.br','(11) 90000-0008','aluno','Rua das Laranjeiras, 505','2006-08-22',5),(9,'Elisa Ramos','202300005','678901','000.000.000-09','elisa_ramos43@yahoo.com','elisa.ramos@horizon.com.br','(11) 90000-0009','aluno','Rua das Oliveiras, 606','2006-09-30',6),(10,'Felipe Costa','202300006','789012','000.000.000-10','felipe.costa69@outlook.com','felipe.costa@horizon.com.br','(11) 90000-0010','aluno','Rua das Hortências, 707','2006-10-11',7),(11,'Gabriela Lima','202300007','890123','000.000.000-11','gabriela_lima25@gmail.com','gabriela.lima@horizon.com.br','(11) 90000-0011','aluno','Rua das Rosas, 808','2006-11-03',8),(12,'Henrique Rocha','202300008','901234','000.000.000-12','henrique.rocha90@hotmail.com','henrique.rocha@horizon.com.br','(11) 90000-0012','aluno','Rua das Violetas, 909','2006-12-14',9),(13,'Isabela Martins','202300009','112233','000.000.000-13','isabela_martins94@yahoo.com','isabela.martins@horizon.com.br','(11) 90000-0013','aluno','Rua das Margaridas, 111','2007-01-09',10),(14,'João Almeida','202300010','223344','000.000.000-14','joão.almeida11@outlook.com','joão.almeida@horizon.com.br','(11) 90000-0014','aluno','Rua das Tulipas, 222','2007-02-17',11),(15,'Karla Monteiro','202300011','334455','000.000.000-15','karla_monteiro33@gmail.com','karla.monteiro@horizon.com.br','(11) 90000-0015','aluno','Rua das Orquídeas, 333','2007-03-23',12),(16,'Lucas Batista','202300012','445566','000.000.000-16','lucas.batista34@hotmail.com','lucas.batista@horizon.com.br','(11) 90000-0016','aluno','Rua das Azaleias, 444','2007-04-28',13),(17,'Mariana Dias','202300013','556677','000.000.000-17','mariana_dias59@yahoo.com','mariana.dias@horizon.com.br','(11) 90000-0017','aluno','Rua das Bromélias, 555','2007-05-06',14),(18,'Nicolas Teixeira','202300014','667788','000.000.000-18','nicolas.teixeira95@outlook.com','nicolas.teixeira@horizon.com.br','(11) 90000-0018','aluno','Rua das Dalias, 666','2007-06-13',15),(19,'Olivia Figueiredo','202300015','778899','000.000.000-19','olivia_figueiredo19@gmail.com','olivia.figueiredo@horizon.com.br','(11) 90000-0019','aluno','Rua das Camélias, 777','2007-07-21',16),(20,'Pedro Henrique','202300016','889900','000.000.000-20','pedro.henrique69@hotmail.com','pedro.henrique@horizon.com.br','(11) 90000-0020','aluno','Rua das Begônias, 888','2007-08-29',17),(21,'Quésia Barbosa','202300017','990011','000.000.000-21','quésia_barbosa98@yahoo.com','quésia.barbosa@horizon.com.br','(11) 90000-0021','aluno','Rua das Petúnias, 999','2007-09-30',18),(22,'Rafael Nogueira','202300018','101010','000.000.000-22','rafael.nogueira95@outlook.com','rafael.nogueira@horizon.com.br','(11) 90000-0022','aluno','Rua das Amarílis, 100','2007-10-15',19),(23,'Sabrina Carvalho','202300019','202020','000.000.000-23','sabrina_carvalho83@gmail.com','sabrina.carvalho@horizon.com.br','(11) 90000-0023','aluno','Rua das Gardênias, 200','2007-11-20',20),(24,'Thiago Menezes','202300020','303030','000.000.000-24','thiago.menezes28@hotmail.com','thiago.menezes@horizon.com.br','(11) 90000-0024','aluno','Rua das Magnólias, 300','2007-12-25',21),(26,'Professor de PT','333333333','333333','000.000.000-25','professorPT@gmail.com','professorPT.prof@horizon.br','(11) 90000-0025','colaborador','Rua dos Professores, 400','1988-05-10',4);
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

-- Dump completed on 2025-05-20 14:35:19
