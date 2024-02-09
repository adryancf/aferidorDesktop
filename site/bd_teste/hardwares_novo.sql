-- phpMyAdmin SQL Dump
-- version 4.0.8
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 09/02/2024 às 17:08
-- Versão do servidor: 5.0.67
-- Versão do PHP: 5.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de dados: `aferidordelicensas`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `hardwares_novo`
--

CREATE TABLE IF NOT EXISTS `hardwares_novo` (
  `id_hardware` int(11) unsigned NOT NULL auto_increment,
  `fk_funcionario` int(11) unsigned NOT NULL,
  `fk_empresa` int(11) unsigned default NULL,
  `processador` varchar(255) default NULL,
  `memoria_ram` varchar(255) default NULL,
  `hd` varchar(255) default NULL,
  `placa_video` varchar(255) default NULL,
  `drivers` varchar(255) default NULL,
  `motherboard` varchar(255) default NULL,
  `tipo` enum('n','d') NOT NULL,
  `numero` varchar(10) default NULL,
  `data_cadastro` date NOT NULL,
  `data_atualizacao` date NOT NULL,
  PRIMARY KEY  (`id_hardware`),
  UNIQUE KEY `id_hardware` (`id_hardware`),
  KEY `hardware_funcionario_fk_teste` (`fk_funcionario`),
  KEY `hw_empresa` (`fk_empresa`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=601 ;

--
-- Fazendo dump de dados para tabela `hardwares_novo`
--

INSERT INTO `hardwares_novo` (`id_hardware`, `fk_funcionario`, `fk_empresa`, `processador`, `memoria_ram`, `hd`, `placa_video`, `drivers`, `motherboard`, `tipo`, `numero`, `data_cadastro`, `data_atualizacao`) VALUES
(406, 1290, 1, 'Intel Core i5 10a', '8GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '534', '2022-03-14', '2023-07-12'),
(407, 1292, 1, 'i3 3,1GHz', '16GB', '500GB/1TB', 'FX1500', NULL, NULL, 'd', 'EST-08', '2022-03-14', '2023-06-14'),
(408, 1302, 1, 'XEON E3 3,1GHz', '8GB', '1TB/2TB', NULL, NULL, NULL, 'd', '452', '2022-03-14', '2023-06-14'),
(409, 102, 1, 'i3 3,1GHz', '8GB', '250GB/500GB', 'R5220', NULL, NULL, 'd', 'EST-02', '2022-03-14', '2022-10-25'),
(411, 82, 1, 'i3 3,1GHz', '8GB', '500GB/2TB', 'Radeon R5 220', NULL, NULL, 'd', 'EST-11', '2022-03-14', '2022-03-14'),
(413, 1330, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'n', '500', '2022-03-14', '2022-03-14'),
(414, 1384, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '507', '2022-03-14', '2022-03-14'),
(415, 198, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '367', '2022-03-23', '2022-03-23'),
(416, 1329, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', 'EST-07', '2022-03-23', '2022-03-23'),
(417, 1329, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '450', '2022-03-23', '2022-03-23'),
(418, 1329, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '403', '2022-03-23', '2022-03-23'),
(419, 1439, 1, 'i3-8100', '16GB', NULL, 'RX550', NULL, NULL, 'd', '477', '2022-03-23', '2024-01-09'),
(420, 1329, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '478', '2022-03-23', '2022-03-23'),
(421, 1329, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '479', '2022-03-23', '2022-03-23'),
(422, 254, 1, 'AMD Ryzen 7 5700X 8-Core Processor 3.40 GHz', '16 GB', 'SSD 480GB / HD 2TB', 'RADEON RX550', NULL, NULL, 'd', '509', '2022-10-03', '2023-08-29'),
(423, 15, 1, 'i7-8700 ', '16GB', 'SSD 480GB / 2x 1TB', 'NVIDIA GTX 1050 TI', NULL, NULL, 'd', '480', '2022-10-21', '2023-07-19'),
(424, 1283, 1, 'Core i5-10400F', '16 GB', 'SSD 480 GB / HD 500GB', 'AMD RADEON R5 220', NULL, NULL, 'd', '510', '2022-10-24', '2023-07-19'),
(425, 1303, 1, 'Intel Core i9-11900K ', '64 GB', 'SSD 2TB / 4x HD 8TB', 'AMD Radeon RX 6600 XT', NULL, NULL, 'd', '513', '2022-11-22', '2023-07-19'),
(426, 298, 1, ' Intel Core i5 10400', '16GB', 'SSD 480GB', 'NVIDIA GeForce GT210', NULL, NULL, 'd', '515', '2022-11-30', '2023-07-12'),
(427, 1262, 1, 'Intel Core i7', 'DDR4 16 GB', 'SSD 480GB - SATA 2 TB', NULL, NULL, NULL, 'd', '514', '2022-11-04', '2022-11-04'),
(428, 1313, 1, 'Intel Core i9-11900K 3.50GHz', '64GB', 'SSD 2TB / 4x HD 8TB', 'AMD Radeon RX 6600 XT', NULL, NULL, 'd', '512', '2023-01-09', '2023-07-17'),
(433, 121, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '517', '2023-03-01', '2023-03-02'),
(434, 1167, 1, 'I5-10400F', '16 GB', 'SSD 120 GB - SATA 1TB', 'NVIDIA GT 730 4GB', NULL, NULL, 'd', '519', '2023-03-02', '2023-08-24'),
(435, 1215, 1, 'Intel Core i5 10a', '8GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '520', '2023-04-03', '2023-07-13'),
(436, 1402, 1, 'Intel Core i5 10a', '8GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '521', '2023-04-03', '2023-07-12'),
(437, 1393, 1, 'Intel Core i5 10a', '8GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '522', '2023-04-03', '2023-07-12'),
(438, 1271, 1, 'Intel Core i5 10a', '8GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '523', '2023-04-03', '2023-07-12'),
(439, 1289, 1, 'Intel Core i5 10a', '8 GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '524', '2023-04-03', '2023-07-12'),
(440, 1400, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '528', '2023-05-05', '2023-05-05'),
(441, 934, 1, 'Intel Core i5 10a', '32GB', 'SSD 240GB / 2TB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '529', '2023-05-12', '2023-07-12'),
(442, 131, 1, 'Intel Core i5 10a', '8GB', 'SSD 240GB / 2TB', 'Pcyes NVIDIA GeForce G210', NULL, NULL, 'd', '530', '2023-05-12', '2023-07-12'),
(443, 1309, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '536', '2023-06-14', '2023-06-14'),
(444, 224, 1, '12th Gen Intel(R) Core(TM) i7-12650H 2.30 GHz', '32 GB', 'SSD 1TB', 'NVIDIA GeForce RTX 3070', NULL, NULL, 'n', '535', '2023-06-16', '2023-07-20'),
(446, 1300, 1, 'Intel Core i5 10400F', '8GB', 'SSD 240GB', 'Pcyes NVIDIA GeForce G210', NULL, 'ASUS H 510M-E LGA 1200P', 'd', '539', '2023-07-12', '2023-07-19'),
(448, 1410, 1, 'Intel Core i3', '12GB', 'HD 2TB', ' GeForce 8400GS', NULL, NULL, 'd', '384', '2023-07-12', '2023-07-12'),
(571, 1222, 1, 'i9-10900F', '32GB', 'SSD 2TB /2x 8TB', 'READON RX 6600 XT', NULL, NULL, 'd', '541', '2023-07-18', '2023-07-18'),
(572, 1303, 1, 'i9-10900F', '32GB', 'SSD 2TB / 4x HD 8TB', 'AMD Radeon RX 6600 XT', NULL, NULL, 'd', '540', '2023-07-19', '2023-07-19'),
(573, 1411, 1, 'i7-11800H', '16GB', 'SSD 2TB', 'RTX 3050 TI', NULL, NULL, 'n', '526', '2023-07-19', '2023-07-19'),
(574, 1280, 1, 'I5-10400F', '16GB', '1TB, 120GB', 'NVIDIA GT 730 4GB', NULL, NULL, 'd', '531', '2023-05-22', '2023-08-24'),
(576, 129, 1, 'I7-12650H', '32GB', 'SSD 1TB', 'NVIDIA GeForce RTX 3060', NULL, NULL, 'n', '518', '2023-07-20', '2023-07-20'),
(577, 1390, 1, 'I5-10400F', '8GB', 'SSD 240GB', 'NVIDIA G210', NULL, 'ASUS H 510M-E LGA 1200P', 'd', '542', '2023-07-21', '2023-07-21'),
(581, 135, 1, 'I5-10500H', '16GB', 'SSD 480G', 'NVIDIA 1650', NULL, NULL, 'n', '511', '2023-08-23', '2023-09-13'),
(582, 1390, 3, 'INTEL CORE I7 10700', '32GB 3200MHZ', 'SSD 2TB CRUCIAL BX500', 'NVIDIA GEFORCE GTX 1650 GALAX', 'GABINETE ATX WISE CASE RAJC-3308', 'ASUS H 510M-E LGA 1200P', 'd', '543', '2023-09-13', '2023-09-13'),
(583, 1390, 3, 'INTEL CORE I7 10700', '32GB 3200MHZ', 'SSD 2TB CRUCIAL BX500', 'NVIDIA GEFORCE GTX 1650 GALAX', 'GABINETE ATX WISE CASE RAJC-3308', 'ASUS H 510M-E LGA 1200P', 'd', '544', '2023-09-13', '2023-09-13'),
(584, 1201, 1, 'i9-10900F', '64GB', '2X 4TB / SSD 500GB', 'Radeon RX 460', NULL, NULL, 'd', '548', '2023-10-04', '2023-10-17'),
(585, 57, 1, 'Intel Core i7', '64GB ', NULL, 'Nvidia Quadro M4000', NULL, NULL, 'd', '549', '2023-10-17', '2023-10-18'),
(586, 242, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '550', '2023-10-31', '2023-10-31'),
(587, 1425, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '551', '2023-10-31', '2023-10-31'),
(588, 1302, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'd', '546', '2023-10-31', '2023-12-04'),
(589, 1323, 1, 'Intel(R) Core(TM) i5-4460  CPU @ 3.20GHz   3.20 GHz', '16GB', NULL, 'RX 550', NULL, NULL, 'd', '451', '2024-01-03', '2024-01-09');

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `hardwares_novo`
--
ALTER TABLE `hardwares_novo`
  ADD CONSTRAINT `hardware_funcionario_fk_teste` FOREIGN KEY (`fk_funcionario`) REFERENCES `padrao`.`funcionarios` (`id_funcionario`),
  ADD CONSTRAINT `hw_empresa` FOREIGN KEY (`fk_empresa`) REFERENCES `empresas` (`id_empresa`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
