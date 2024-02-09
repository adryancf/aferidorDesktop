-- phpMyAdmin SQL Dump
-- version 4.0.8
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 09/02/2024 às 17:18
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
-- Estrutura para tabela `softwares`
--

CREATE TABLE IF NOT EXISTS `softwares` (
  `id_software` int(11) unsigned NOT NULL auto_increment,
  `nome` varchar(255) NOT NULL,
  `n_licencas` int(11) unsigned default '0',
  PRIMARY KEY  (`id_software`),
  UNIQUE KEY `id_software` (`id_software`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=260 ;

--
-- Fazendo dump de dados para tabela `softwares`
--

INSERT INTO `softwares` (`id_software`, `nome`, `n_licencas`) VALUES
(1, 'Windows 98', 14),
(3, 'Windows Server 2003', 1),
(4, 'Windows Server 2008', 1),
(5, 'Windows 7 - FPP', 10),
(6, 'Office XP STD - Open', 50),
(7, 'Office XP PRO - Open - PFWTJ', 5),
(8, 'Office 97 Pro Upg - Open', 10),
(9, 'Office 2007 PRO Open - 43 Lic - JQWW7', 43),
(10, 'Project 98', 9),
(12, 'Project  2003 Upg - FPP', 1),
(13, 'Project  2007 - FPP', 2),
(14, 'AutoCAD R14', 4),
(15, 'AutoCAD Map5', 5),
(16, 'AutoCAD Map 3D 2007 - Rede', 5),
(17, 'Autocad Civil 3D 2007', 4),
(18, 'AutoCAD Map 3D 2009 - SA', 5),
(19, 'AutoCAD Map 3D 2009 - Rede', 4),
(20, 'Raster 2007', 5),
(21, 'Raster 2009 - Rede', 4),
(22, 'Photoshop CS3', 0),
(23, 'Corel Draw  9.0', 3),
(24, 'Acrobat 6.0', 1),
(26, 'Visual Studio 2005 - FPP', 1),
(27, 'Visual Studio 2003 - UPG', 1),
(28, 'Visual Studio 2008 Upg - FPP', 1),
(29, 'Visual Studio 2010 - Open', 1),
(31, 'Office 2007 PRO Open - 10 lic - K8364', 10),
(32, 'Civil Survey', 0),
(33, 'Dreamweaver CS5', 0),
(34, 'AutoCAD Map 3D 2011  - Rede', 7),
(35, 'Raster 2011 - Rede', 3),
(36, 'Windows Vista Business UPG', 5),
(43, 'Autocad Civil 3D 2011 - Subcrisption', 3),
(47, 'Photoshop CS5', 1),
(48, 'Corel Draw 12', 1),
(57, 'Windows Ultimate 7 FPP - Ã‚ngela', 1),
(59, 'Windows XP PRO x64 - FPP', 1),
(60, 'Windows PRO 2000 - FPP', 1),
(62, 'Office XP - FPP', 1),
(63, 'Windows XP - FPP', 1),
(64, 'Windows NT 4.0 - Open', 5),
(65, 'Windows Millennium Open ', 30),
(66, 'SQL Server 2008', 1),
(68, 'Visual Studio 2005 - Open', 1),
(69, 'Windows XP PRO Upg Open - V3HCQ', 71),
(70, 'Windows XP PRO Open - TVMX2', 7),
(71, 'PhotoShop CS4 UPG ', 3),
(72, 'AutoCAD Map 3D 2009 ', 0),
(73, 'Windows 7 - Notebook', 0),
(74, 'Acrobat X Pro - FPP 1118 1084', 1),
(75, 'Acrobat X Pro - Open - 1118-1084', 2),
(76, 'PhotoShop CS2', 0),
(84, 'Windows XP - Campo', 0),
(86, 'Office STD - Campo', 0),
(87, 'Office 2007 PRO - Campo', 0),
(88, 'Map 3D 2009 - Campo', 0),
(89, 'Map 3D 2011 - Campo', 0),
(97, 'MicroStation V8i', 0),
(99, 'Windows Vista', 5),
(103, 'Map 3D 2007 - Campo', 0),
(104, 'Office 2007 PRO Open - 15 Lic - VK2T7', 15),
(106, 'Windows 8 Original Notebook', 7),
(107, 'Windows 8 Upg FPP', 4),
(109, 'Office 2013 STD', 4),
(110, 'Windows 8.1 PRO FPP FULL', 6),
(112, 'Photoshop CS6', 0),
(113, 'Corel DRAW X6', 0),
(114, 'Corel DRAW X4', 0),
(115, 'Corel DRAW X5', 0),
(116, 'PSCC 2014', 0),
(119, 'Office 2010', 0),
(123, 'Photoshop CC 2015', 0),
(124, 'Windows 10 - Campo', 0),
(125, 'Windows 7 - GE', 0),
(127, 'Office 2013', 0),
(128, 'Windows 10 - NoteBook 467', 1),
(130, 'Corel DRAW X7', 0),
(131, 'Global Mapper', 3),
(133, 'Visual Studio Enterprise 2017', 0),
(134, 'AutoCAD Map 3D 2011  - S.A - P', 0),
(135, 'Raster 2011 - S.A - P', 0),
(138, 'PhotoShop CC 2017', 0),
(139, 'Photoshop Assinatura', 5),
(141, 'Windows 7 Home Basic', 1),
(147, 'Windows 7 DELL', 1),
(148, 'MicroStation Connect', 0),
(149, 'Windows 10 G', 0),
(158, 'Windows 10 Home (430)', 1),
(159, 'AutoCad Map 3D 2007 - P', 0),
(160, 'Office 365 Pessoal', 0),
(161, 'Windows 10 Home (447)', 1),
(162, 'Windows 10 Home', 0),
(163, 'Office 2016 G', 0),
(164, 'Global Mapper G', 0),
(165, 'Photoshop 2019 G', 0),
(166, 'Autodesk Collection 2020 Assinatura', 5),
(170, 'Windows 10 Pro OEM - 499', 0),
(171, 'Windows 8.1 G', 0),
(174, 'Avenza Geographic Imager G', 0),
(178, 'Office 365', 16),
(190, 'Windows Server 2012 - OF', 1),
(191, 'SQL Server 2014 - OF', 1),
(192, 'Windows 7  - 1', 2),
(193, 'Windows 7 Pro', 2),
(222, 'Office 2019 - P', 0),
(232, 'Office 2016 - P', 1),
(233, 'ArcGIS G', 3),
(234, 'Windows 11 G', 0),
(237, 'AutoCAD MAP 3D 2017 - G', 0),
(241, 'Windows 10 PRO - NOTEBOOK', 0),
(242, 'AutoCAD 2023 - Estudante', 1),
(243, 'Autodesk civil 2024 - Estudante', 1),
(244, 'Windows 11 PRO - NOTEBOOK', 0),
(248, 'AutoCAD 2020 - G', 0),
(249, 'Autodesk Civil 3D 2021 - G', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
