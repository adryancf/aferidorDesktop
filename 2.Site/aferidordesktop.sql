-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28/04/2024 às 20:50
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `aferidordesktop`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aferidordesktop_dadosrecebidos`
--

CREATE TABLE `aferidordesktop_dadosrecebidos` (
  `id` int(11) NOT NULL,
  `data_hora_cadastro` varchar(255) DEFAULT NULL,
  `sistema_operacional` varchar(255) DEFAULT NULL,
  `nome_maquina` varchar(255) DEFAULT NULL,
  `tipo_aferidor` enum('n','d') NOT NULL DEFAULT 'd',
  `motherboard` varchar(255) DEFAULT NULL,
  `processador` varchar(255) DEFAULT NULL,
  `memoria_ram` varchar(255) DEFAULT NULL,
  `hd` varchar(255) DEFAULT NULL,
  `placa_video` varchar(255) DEFAULT NULL,
  `drivers` varchar(255) DEFAULT NULL,
  `nome_funcionario` varchar(255) DEFAULT NULL,
  `fk_funcionario` int(11) UNSIGNED NOT NULL DEFAULT 1390,
  `email` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `tipo` enum('n','d') DEFAULT NULL,
  `fk_setor` int(11) UNSIGNED DEFAULT NULL,
  `obs` text DEFAULT NULL,
  `softwares` text DEFAULT NULL,
  `softwaresResumido` text DEFAULT NULL,
  `enviado` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Indica se o registro ja foi utilizado para atuailizar o aferidor',
  `fk_usuario` int(11) UNSIGNED DEFAULT NULL COMMENT 'Mostra o usuário que fez o envio dos dados',
  `tipoEnvio` enum('register','update') DEFAULT NULL,
  `data_hora_modificacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `aferidordesktop_dadosrecebidos`
--

INSERT INTO `aferidordesktop_dadosrecebidos` (`id`, `data_hora_cadastro`, `sistema_operacional`, `nome_maquina`, `tipo_aferidor`, `motherboard`, `processador`, `memoria_ram`, `hd`, `placa_video`, `drivers`, `nome_funcionario`, `fk_funcionario`, `email`, `numero`, `tipo`, `fk_setor`, `obs`, `softwares`, `softwaresResumido`, `enviado`, `fk_usuario`, `tipoEnvio`, `data_hora_modificacao`) VALUES
(1, '2024-03-25 12:00:41', 'Microsoft Windows 7 Professional (64bit)', '394-TI_P08', 'd', 'ASRock H61M-VS', 'Intel(R) Core(TM) i3-2100 CPU @ 3.10GHz (64bit)', '16 GB', '480 GB - KINGSTON SA400S37480G ATA Device (OK) / 320 GB - SAMSUNG HD321KJ ATA Device (OK) / 320 GB - SAMSUNG HD321KJ ATA Device (OK)', 'NVIDIA GeForce 210', 'ATAPI iHAS122   F ATA Device', 'Adryan Castro', 1, 'adryan.castro@esteio.com.br', '394', 'd', 13, 'TESTE_FINAL', 'CutePDF Writer, Git, GPL Ghostscript, Mozilla Firefox ESR (x64 pt-BR), Mozilla Thunderbird (x64 pt-BR), Mozilla Maintenance Service, TeamViewer, WinMerge 2.16.32.0 x64, WinRAR 6.21 (64-bit), XAMPP, Node.js, IIS 10.0 Express, Microsoft .NET Framework 4.8, Microsoft .NET Framework 4.8 (PortuguË†s (Brasil)), Microsoft SQL Server 2016 LocalDB , NVIDIA Driver do 3D Vision 342.01, NVIDIA Driver de grÂ ficos 342.01, NVIDIA GeForce Experience 2.11.4.125, NVIDIA Driver de controle do 3D Vision 340.50, NVIDIA Software do sistema PhysX 9.13.1220, MySQL Workbench 6.3 CE, Microsoft Web Deploy 4.0, AnyDesk, Google Chrome, Inno Setup versÃ†o 6.2.2, Microsoft Edge, Microsoft Edge Update, Microsoft Edge WebView2 Runtime, Microsoft Office Professional Plus 2007, Qt Designer, Renomear Tudo 2.0, Windows Live Essentials, Microsoft Visual C++ 2013 Redistributable (x64) - 12.0.30501, Advanced Installer 21.2.1, Microsoft Visual C++ 2015-2019 Redistributable (x64) - 14.29.30139, Python Launcher, Microsoft ASP.NET MVC 4 Runtime, Microsoft .NET Framework 4.6.2 SDK, Microsoft Visual C++ 2015-2019 Redistributable (x86) - 14.29.30139, Update for Microsoft Office 2007 suites (KB2596787) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB2881067) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2986253) 32-Bit Edition , Security Update for Microsoft Office InfoPath 2007 (KB3114426) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2596871) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB2597969) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB2880507) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2956110) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2880508) 32-Bit Edition , Security Update for Microsoft Office Excel 2007 (KB4018353) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2596904) 32-Bit Edition , Security Update for Microsoft Office Compatibility Pack Service Pack 3 (KB4011717) 32-Bit Edition , Security Update for Microsoft Office Compatibility Pack Service Pack 3 (KB4018354) 32-Bit Edition , Security Update for Microsoft Office Outlook 2007 (KB4011200) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2850022) 32-Bit Edition , Security Update for Microsoft Office Word 2007 (KB4018355) 32-Bit Edition , Microsoft Office 2007 Service Pack 3 (SP3), Update for Microsoft Office 2007 suites (KB2965286) 32-Bit Edition, Security Update for Microsoft Office Access 2007 (KB2596614) 32-Bit Edition , Security Update for Microsoft Office Visio Viewer 2007 (KB2596915) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2984943) 32-Bit Edition , Security Update for Microsoft Office PowerPoint 2007 (KB3213642) 32-Bit Edition , Update for Microsoft Office Outlook 2007 Junk Email Filter (KB3115461) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB3085549) 32-Bit Edition , Security Update for Microsoft Office InfoPath 2007 (KB2687440) 32-Bit Edition , Update for Microsoft Office Publisher 2007 (KB4011203) 32-Bit Edition, Update for Microsoft Office 2007 suites (KB2596620) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB2596754) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2596825) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2825645) 32-Bit Edition , Update for 2007 Microsoft Office System (KB967642), Security Update for Microsoft Office 2007 suites (KB2596650) 32-Bit Edition , Security Update for Microsoft Office 2007 suites (KB2596792) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB2984938) 32-Bit Edition , Update for Microsoft Office 2007 suites (KB3213649) 32-Bit Edition, Update for Microsoft Office 2007 suites (KB2767916) 32-Bit Edition, Atualizaâ€¡Ã†o do produto Microsoft Office Excel 2007 Help (KB963678), Atualizaâ€¡Ã†o do produto Microsoft Office Powerpoint 2007 Help (KB963669), Atualizaâ€¡Ã†o do produto Microsoft Office Outlook 2007 Help (KB963677), Security Update for Microsoft Office Outlook 2007 (KB4011200) 32-Bit Edition , Atualizaâ€¡Ã†o do produto Microsoft Office Word 2007 Help (KB963665), Security Update for Microsoft Office 2007 suites (KB2825645) 32-Bit Edition , Update for Microsoft Office 2007 suites (KB2596787) 32-Bit Edition, Security Update for Microsoft Office 2007 suites (KB4011656) 32-Bit Edition , Update for Microsoft Office 2007 suites (KB3213646) 32-Bit Edition, Microsoft Save as PDF or XPS Add-in for 2007 Microsoft Office programs, Update for Microsoft .NET Framework 4.8 (KB4503575), Microsoft Office Outlook Connector, Microsoft .NET Framework 4.6.2 Targeting Pack, Adobe Acrobat Reader - PortuguË†s, Microsoft .NET Framework 4.6.2 Targeting Pack (ENU), Windows SDK AddOn, AferidorDesktop versÃ†o 1.0, Microsoft Visual C++ 2013 Redistributable (x86) - 12.0.30501, TP-LINK TL-WN722N Driver, GIMP 2.10.34, Postman x86_64 10.22.0, Microsoft Visual Studio Code (User), Python 3.8.6 (64-bit)', '[{\"id\":null,\"nome\":\"Microsoft SQL Server 2016 LocalDB\"},{\"id\":null,\"nome\":\"Microsoft Office Professional Plus 2007\"},{\"id\":null,\"nome\":\"Microsoft Office 2007 Service Pack 3 (SP3)\"},{\"id\":null,\"nome\":\"Adobe Acrobat Reader - PortuguË†s\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Code (User)\"},{\"id\":\"5\",\"nome\":\"Windows 7 - PRO\"}]', 1, 1, 'update', '2024-04-26 15:28:37'),
(2, '2024-04-01 10:25:22', 'Microsoft Windows 11 Home (64bit)', 'DESKTOP-68HS50D', 'd', 'ASUSTeK COMPUTER INC. PRIME H510M-E', 'Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz (64bit)', '16 GB', '120 GB - KDS120G-L21 (OK) / 1000 GB - ST1000DM010-2EP102 (OK)', 'NVIDIA GeForce GT 730 - (2048.00 MB)', 'A maquina nÃ£o tem uma unidade de CD/DVD instalado!', 'Maria Eduarda França', 2, 'maria.eduarda@esteio.com.br', '215', 'd', 40, '', 'Git, Notepad++ (64-bit x64), Microsoft 365 Apps para Pequenos e Mâ€šdios negÂ¢cios - pt-br, Microsoft OneDrive, TeamViewer, WinRAR 6.24 (64-bit), XAMPP, Microsoft SQL Server 2019 LocalDB , Microsoft System CLR Types para SQL Server 2019, Microsoft Visual Studio Installer, Update for Windows 10 for x64-based Systems (KB5001716), NVIDIA Driver do 3D Vision 388.13, NVIDIA Driver de grÂ ficos 388.13, NVIDIA Driver de Â udio HD 1.3.35.1, Microsoft Update Health Tools, Microsoft .NET SDK 8.0.202 (x64) from Visual Studio, Visual Studio Community 2022, AnyDesk, Google Chrome, Microsoft Edge, Microsoft Edge Update, Microsoft Edge WebView2 Runtime, vs_CoreEditorFonts, Lightshot-5.5.0.7, Python Launcher, Microsoft Visual C++ 2015-2022 Redistributable (x86) - 14.38.33135, Java 8 Update 401, Microsoft Visual C++ 2015-2022 Redistributable (x64) - 14.38.33135, AferidorDesktop versÃ†o 1.0, GIMP 2.10.36-1, pgAdmin 4 version 6.5, Microsoft Visual Studio Code (User), Python 3.12.2 (64-bit)', '[{\"id\":null,\"nome\":\"Microsoft SQL Server 2019 LocalDB\"},{\"id\":null,\"nome\":\"Microsoft System CLR Types para SQL Server 2019\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Installer\"},{\"id\":null,\"nome\":\"Update for Windows 10 for x64-based Systems (KB5001716)\"},{\"id\":null,\"nome\":\"Microsoft .NET SDK 8.0.202 (x64) from Visual Studio\"},{\"id\":null,\"nome\":\"Visual Studio Community 2022\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Code (User)\"}]', 0, NULL, NULL, '2024-04-14 06:07:13'),
(3, '2024-04-01 10:33:09', 'Microsoft Windows 10 Pro (64bit)', 'SERV', 'd', 'ASUSTeK COMPUTER INC. PRIME H310M-E R2.0/BR', 'Intel(R) Core(TM) i5-9400F CPU @ 2.90GHz (64bit)', '8 GB', '240 GB - CT240BX500SSD1 (OK) / 500 GB - WDC WD5000LPLX-75ZNTT0 (OK)', 'NVIDIA GeForce G210 - (1024.00 MB)', 'A maquina nÃ£o tem uma unidade de CD/DVD instalado!', 'Fernanda Gonçalves', 14, 'fernanda@esteio.com.br', '450', 'd', 40, 'A mÃ¡quina nÃ£o tem nÃºmero. Nome que aparece: M3', 'Avast Free Antivirus, Docker Desktop, EPSON L3150 Series Printer Uninstall, Git, pgAdmin 4 version 6.5, Microsoft Office Professional Plus 2016 - pt-br, WinRAR 5.91 (64-bit), XAMPP, Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219, Microsoft Update Health Tools, Verificaâ€¡Ã†o de integridade do PC Windows, Microsoft .NET SDK 7.0.403 (x64) from Visual Studio, Microsoft SQL Server 2019 LocalDB , Node.js, Microsoft Visual C++ 2008 Redistributable - x64 9.0.30729.4148, Microsoft Visual C++ 2008 Redistributable - x64 9.0.30729.6161, Microsoft System CLR Types para SQL Server 2019, Microsoft Visual Studio Installer, EpsonNet Print, Adobe Acrobat (64-bit), Epson Customer Research Participation, NVIDIA Driver do 3D Vision 341.74, NVIDIA Driver de grÂ ficos 341.74, Atualizaâ€¡Ã¤es da NVIDIA 10.4.0, NVIDIA Driver de Â udio HD 1.3.30.1, Update for Windows 10 for x64-based Systems (KB5001716), QGIS 3.28.14 \'Firenze\', Microsoft Build of OpenJDK with Hotspot 11.0.16.1+1 (x64), Visual Studio Community 2022, Epson Scan 2, Google Chrome, K-Lite Codec Pack 9.7.0 (Full), Microsoft Edge, Microsoft Edge Update, Microsoft Edge WebView2 Runtime, Manual Epson L3150, Chrome Remote Desktop Host, TP-LINK TL-WN821N Driver, Importaâ€¡Ã†o do SketchUp 2016-2017, Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.4148, Geeks3D FurMark 1.36.0.0, Java 8 Update 301, Epson Software Updater, Microsoft Visual C++ 2012 Redistributable (x86) - 11.0.61030, Python Launcher, Microsoft Visual C++ 2015-2022 Redistributable (x86) - 14.36.32532, Check Point VPN, vs_CoreEditorFonts, Epson Easy Photo Print 2, Microsoft Visual C++ 2005 Redistributable, FARO LS 1.1.505.0 (64bit), Microsoft Visual C++ 2015-2022 Redistributable (x64) - 14.36.32532, Easy Photo Scan, Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.17, Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161, Epson Event Manager, Epson Printer Connection Checker, Microsoft Visual C++ 2012 Redistributable (x64) - 11.0.61030, AferidorDesktop versÃ†o 1.0, Microsoft Visual C++ 2010  x86 Redistributable - 10.0.40219, Insomnia, Postman x86_64 10.23.5, Postman Agent x86_64 0.4.21, Microsoft Visual Studio Code (User), Python 3.12.2 (64-bit)', '[{\"id\":null,\"nome\":\"Microsoft Office Professional Plus 2016 - pt-br\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219\"},{\"id\":null,\"nome\":\"Verificaâ€¡Ã†o de integridade do PC Windows\"},{\"id\":null,\"nome\":\"Microsoft .NET SDK 7.0.403 (x64) from Visual Studio\"},{\"id\":null,\"nome\":\"Microsoft SQL Server 2019 LocalDB\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2008 Redistributable - x64 9.0.30729.4148\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2008 Redistributable - x64 9.0.30729.6161\"},{\"id\":null,\"nome\":\"Microsoft System CLR Types para SQL Server 2019\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Installer\"},{\"id\":null,\"nome\":\"Adobe Acrobat (64-bit)\"},{\"id\":null,\"nome\":\"Update for Windows 10 for x64-based Systems (KB5001716)\"},{\"id\":null,\"nome\":\"Visual Studio Community 2022\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.4148\"},{\"id\":null,\"nome\":\"Epson Easy Photo Print 2\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2005 Redistributable\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.17\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.6161\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2010  x86 Redistributable - 10.0.40219\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Code (User)\"}]', 0, NULL, NULL, '2024-04-14 03:55:24'),
(4, '2024-04-01 11:39:19', 'Microsoft Windows 7 Professional (64bit)', '295-COO_P18', 'd', 'Gigabyte Technology Co., Ltd. P67A-D3-B3', 'Intel(R) Core(TM) i7-2600 CPU @ 3.40GHz (64bit)', '8GB', '2000 GB - ST2000DM008-2FR102 ATA Device (OK)', 'NVIDIA GeForce GT 1030 - (-2048.00 MB)', 'HL-DT-ST DVDRAM GH22NS70 ATA Device', 'Gustavo Santos', 21, 'gustavo@esteio.com.br', '197', 'd', 12, '', 'AutoCAD Map 3D 2011, CCleaner, doPDF 7.1 printer, Mozilla Thunderbird (x64 pt-BR), Mozilla Maintenance Service, QGIS 3.14.16 \'Pi\', TeraCopy 2.27, WinRAR 5.61 (64-bit), Microsoft Visual C++ 2005 Redistributable (x64), Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219, Warsaw 2.11.1.11 64 bits, Google Earth Pro, Microsoft Visual C++ 2008 Redistributable - x64 9.0.30729.4148, Microsoft Visual C++ 2008 Redistributable - x64 9.0.30729.17, Microsoft Visual Basic for Applications 7.1 (x64), Microsoft Access database engine 2010 (English), Microsoft Visual Basic for Applications 7.1 (x64) English, Microsoft .NET Framework 4.8, Microsoft .NET Framework 4.8 (PortuguË†s (Brasil)), NVIDIA GeForce Experience 3.18.0.102, NVIDIA Software do sistema PhysX 9.19.0218, GEOCODIMAGEVIEWER, HP DeskJet 3630 series Software bÂ sico do dispositivo, Advanced SystemCare, AutoCAD Map 3D 2011 Version 2, Global Mapper 20, Google Chrome, Etron USB3.0 Host Controller, McAfee Security Scan Plus, Microsoft Edge, Microsoft Edge Update, Microsoft Office Project Standard 2007, Microsoft Office Professional Plus 2007, Microsoft Visual C++ 2013 Redistributable (x64) - 12.0.30501, ESTEIO ZipFiles versÃ†o 1.0, Microsoft Visual C++ 2008 Redistributable - x86 9.0.30729.4148, TP-LINK Wireless Configuration Utility, Microsoft Visual C++ 2012 Redistributable (x86) - 11.0.61030, TP-LINK TL-WN721N_TL-WN722N Driver, ON_OFF Charge B11.0110.1, Splashtop Connect IE, Microsoft Visual C++ 2017 Redistributable (x86) - 14.13.26020, Microsoft Visual C++ 2005 Redistributable, Microsoft Visual C++ 2017 Redistributable (x64) - 14.13.26020, Microsoft Visual C++ 2013 Redistributable (x64) - 12.0.21005, Realtek Ethernet Controller Driver, Update for Microsoft .NET Framework 4.8 (KB4503575), FARO LS 1.1.406.58, Autodesk Material Library 2011, Adobe Acrobat Reader - PortuguË†s, Microsoft Visual C++ 2012 Redistributable (x64) - 11.0.61030, Autodesk Material Library 2011 Base Image library, Splashtop Connect for Firefox, AferidorDesktop versÃ†o 1.0, Microsoft Visual C++ 2010  x86 Redistributable - 10.0.40219, Realtek High Definition Audio Driver', '[{\"id\":null,\"nome\":\"AutoCAD Map 3D 2011 Version 2\"}]', 0, NULL, NULL, '2024-04-26 03:04:59'),
(5, '2024-04-25 22:11:45', 'Microsoft Windows 11 Home (64bit)', 'ADRYANPC', 'n', 'LENOVO LNVNB161216', '11th Gen Intel(R) Core(TM) i5-11300H @ 3.10GHz (64bit)', '24 GB', '512 GB - INTEL SSD', 'NVIDIA GeForce GTX 1650 - (4095.00 MB)', 'A maquina não tem uma unidade de CD/DVD instalado!', 'Maria Eduarda França', 2, 'teste@teste.com', '365', 'n', 5, 'tesrte', 'Audacity 3.2.4, Autodesk Identity Manager, Pacote de Driver do Windows - Silicon Laboratories Inc. (silabser) Ports  (05/23/2018 6.7.6.2130), CPUID CPU-Z 2.03, CrystalDiskMark 8.0.4c, Git, Maxon Cinema 4D R21, Mozilla Firefox (x64 pt-BR), Mozilla Maintenance Service, Microsoft 365 Apps para Grandes Empresas - pt-br, Microsoft OneDrive, R for Windows 4.3.2, Riot Vanguard, Serial Port Monitor 9.0.556, The SimsT 4, Business Tour - Online Multiplayer Board Game, Counter-Strike: Global Offensive, Bloons TD 6, WinRAR 6.11 (64-bit), XAMPP, MySQL Connector C++ 8.0, MySQL Shell 8.0.33, Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219, Autodesk Genuine Service, PuTTY release 0.78 (64-bit), MySQL Workbench 8.0 CE, Microsoft System CLR Types para SQL Server 2019, MySQL Connector Python v8.0.33, Microsoft Visual Studio Installer, MySQL Server 8.0, MySQL Connector/ODBC 8.0 (64-bit), Salvar para Web e dispositivos m¢veis da Autodesk, NVIDIA Driver de gr ficos 536.23, NVIDIA GeForce Experience 3.27.0.112, NVIDIA Software do sistema PhysX 9.21.0713, NVIDIA FrameView SDK 1.3.8513.32290073, Microsoft Update Health Tools, Autodesk AutoCAD 2024 - English, AutoCAD Open in Desktop, VEGAS Pro 17.0, Node.js, MySQL Router 8.0, Visual Studio Community 2022, Adobe After Effects 2020, Adobe Media Encoder 2020, Ferramentas de Build do Visual Studio 2019, Google Chrome, Inno Setup versÆo 6.2.2, Legion Arena, Microsoft Edge, Microsoft Edge Update, Microsoft Edge WebView2 Runtime, Npcap, OBS Studio, Adobe Photoshop 2021, Roblox Player, Rockstar Games Launcher, Rockstar Games Social Club, Steam, Lenovo System Update, Ubisoft Connect, Lenovo Vantage Service, Wireshark 4.0.5 64-bit, Aplicativos da Autodesk em destaque, Microsoft Visual C++ 2013 Redistributable (x64) - 12.0.40664, Microsoft Visual C++ 2013 Redistributable (x64) - 12.0.30501, MySQL Installer - Community, Microsoft ASP.NET Core 6.0.8 - Shared Framework (x64), Windows SDK AddOn, MySQL Examples and Samples 8.0, Epic Online Services, Microsoft GameInput, REDRAGON M711, Microsoft Visual C++ 2012 Redistributable (x86) - 11.0.61030, MySQL Documents 8.0, YouTube Playlist Downloader 1.9.9, The SimsT 4, Python Launcher, Microsoft Visual C++ 2015-2022 Redistributable (x86) - 14.34.31938, vs_CoreEditorFonts, Teams Machine-Wide Installer, ClickOnce Bootstrapper Package for Microsoft .NET Framework 4.8 on Visual Studio 2017, MySQL Connector J, Epic Games Launcher, Autodesk App Manager, Microsoft .NET Framework 4.8 SDK, Microsoft Visual C++ 2012 Redistributable (x86) - 11.0.60610, Microsoft Visual C++ 2013 Redistributable (x86) - 12.0.40664, Microsoft .NET Framework 4.8 Targeting Pack (ENU), EA app, Microsoft .NET Framework 4.8 Targeting Pack, Microsoft Windows Desktop Runtime - 6.0.8 (x64), Microsoft Visual C++ 2012 Redistributable (x64) - 11.0.61030, MySQL Connector NET 8.0.33, Windows Software Development Kit - Windows 10.0.22000.832, Microsoft Visual C++ 2015-2022 Redistributable (x64) - 14.34.31938, SciDAVis, AferidorDesktop versÆo 1.0, Microsoft Visual C++ 2010  x86 Redistributable - 10.0.40219, PowerToys (Preview) x64, Microsoft Visual C++ 2013 Redistributable (x86) - 12.0.30501, Intel(R) C++ Redistributables on Intel(R) 64, YouTube Music, Bootstrap Studio 6.2.1, CodeBlocks, Discord, PSIM 2021b_Demo version 2021b, GitHub Desktop, MongoDB Compass, Postman x86_64 10.15.0, VALORANT, Slack, Microsoft Teams classic, Zoom, Lenovo Service Bridge, Telegram Desktop, Microsoft Visual Studio Code (User), Python 3.7.0 (32-bit)', '[{\"id\":null,\"nome\":\"R for Windows 4.3.2\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2010  x64 Redistributable - 10.0.40219\"},{\"id\":null,\"nome\":\"Microsoft System CLR Types para SQL Server 2019\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Installer\"},{\"id\":null,\"nome\":\"Autodesk AutoCAD 2024 - English\"},{\"id\":null,\"nome\":\"AutoCAD Open in Desktop\"},{\"id\":null,\"nome\":\"Visual Studio Community 2022\"},{\"id\":null,\"nome\":\"Ferramentas de Build do Visual Studio 2019\"},{\"id\":null,\"nome\":\"Adobe Photoshop 2021\"},{\"id\":null,\"nome\":\"ClickOnce Bootstrapper Package for Microsoft .NET Framework 4.8 on Visual Studio 2017\"},{\"id\":null,\"nome\":\"Windows Software Development Kit - Windows 10.0.22000.832\"},{\"id\":null,\"nome\":\"Microsoft Visual C++ 2010  x86 Redistributable - 10.0.40219\"},{\"id\":null,\"nome\":\"Microsoft Visual Studio Code (User)\"},{\"id\":\"11\",\"nome\":\"AutoCAD Map5\"},{\"id\":\"50\",\"nome\":\"Photoshop Assinatura\"},{\"id\":\"53\",\"nome\":\"Windows 11 PRO\"},{\"id\":\"51\",\"nome\":\"Office 365\"}]', 1, 1, 'update', '2024-04-26 03:09:11');

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresas`
--

CREATE TABLE `empresas` (
  `id_empresa` int(11) UNSIGNED NOT NULL,
  `nome_empresa` varchar(255) NOT NULL,
  `status_empresa` enum('Ativo','Inativo') NOT NULL DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `empresas`
--

INSERT INTO `empresas` (`id_empresa`, `nome_empresa`, `status_empresa`) VALUES
(1, 'ESTEIO', 'Ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionarios`
--

CREATE TABLE `funcionarios` (
  `id_funcionario` int(11) UNSIGNED NOT NULL,
  `nome_funcionario` varchar(255) NOT NULL,
  `fk_setor` int(11) UNSIGNED NOT NULL,
  `data_ultima_afericao` date DEFAULT NULL,
  `matricula` int(11) DEFAULT NULL,
  `status_funcionario` enum('Ativo','Inativo') NOT NULL DEFAULT 'Ativo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `funcionarios`
--

INSERT INTO `funcionarios` (`id_funcionario`, `nome_funcionario`, `fk_setor`, `data_ultima_afericao`, `matricula`, `status_funcionario`) VALUES
(1, 'Adryan Castro', 13, NULL, 6458, 'Ativo'),
(2, 'Maria Eduarda França', 5, NULL, 6459, 'Ativo'),
(3, 'João Silva', 2, '2024-04-12', 6460, 'Ativo'),
(4, 'Maria Santos', 3, '2024-04-11', 6461, 'Ativo'),
(5, 'Pedro Oliveira', 4, '2024-04-10', 6462, 'Ativo'),
(6, 'Ana Pereira', 5, '2024-04-09', 6463, 'Ativo'),
(7, 'José Carvalho', 6, '2024-04-08', 6464, 'Ativo'),
(8, 'Marta Costa', 7, '2024-04-07', 6465, 'Ativo'),
(9, 'Carlos Rodrigues', 8, '2024-04-06', 6466, 'Ativo'),
(10, 'Lúcia Fernandes', 10, '2024-04-05', 6467, 'Ativo'),
(11, 'Ricardo Almeida', 11, '2024-04-04', 6468, 'Ativo'),
(12, 'Sandra Martins', 12, '2024-04-03', 6469, 'Ativo'),
(13, 'Paulo Sousa', 13, '2024-04-02', 6470, 'Ativo'),
(14, 'Fernanda Gonçalves', 14, '2024-04-01', 6471, 'Ativo'),
(15, 'André Neves', 15, '2024-03-31', 6472, 'Ativo'),
(16, 'Isabela Costa', 16, '2024-03-30', 6473, 'Ativo'),
(17, 'Fábio Ramos', 17, '2024-03-29', 6474, 'Ativo'),
(18, 'Mariana Alves', 18, '2024-03-28', 6475, 'Ativo'),
(19, 'Luiz Pereira', 19, '2024-03-27', 6476, 'Ativo'),
(20, 'Roberta Oliveira', 20, '2024-03-26', 6477, 'Ativo'),
(21, 'Gustavo Santos', 21, '2024-03-25', 6478, 'Ativo'),
(22, 'Carolina Silva', 22, '2024-03-24', 6479, 'Ativo'),
(23, 'Diego Fernandes', 25, '2024-03-23', 6480, 'Ativo'),
(24, 'Aline Costa', 26, '2024-03-22', 6481, 'Ativo'),
(25, 'Marcos Rodrigues', 27, '2024-03-21', 6482, 'Ativo'),
(26, 'Larissa Oliveira', 28, '2024-03-20', 6483, 'Ativo'),
(27, 'Daniel Almeida', 29, '2024-03-19', 6484, 'Ativo'),
(28, 'Tatiane Santos', 31, '2024-03-18', 6485, 'Ativo'),
(29, 'Lucas Pereira', 32, '2024-03-17', 6486, 'Ativo'),
(30, 'Patrícia Costa', 33, '2024-03-16', 6487, 'Ativo'),
(31, 'Renato Martins', 34, '2024-03-15', 6488, 'Ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `hardwares`
--

CREATE TABLE `hardwares` (
  `id_hardware` int(11) UNSIGNED NOT NULL,
  `fk_funcionario` int(11) UNSIGNED NOT NULL,
  `fk_empresa` int(11) UNSIGNED DEFAULT NULL,
  `processador` varchar(255) DEFAULT NULL,
  `memoria_ram` varchar(255) DEFAULT NULL,
  `hd` varchar(255) DEFAULT NULL,
  `placa_video` varchar(255) DEFAULT NULL,
  `drivers` varchar(255) DEFAULT NULL,
  `motherboard` varchar(255) DEFAULT NULL,
  `tipo` enum('n','d') NOT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `data_cadastro` date NOT NULL,
  `data_atualizacao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `hardwares`
--

INSERT INTO `hardwares` (`id_hardware`, `fk_funcionario`, `fk_empresa`, `processador`, `memoria_ram`, `hd`, `placa_video`, `drivers`, `motherboard`, `tipo`, `numero`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 1, 1, 'Intel(R) Core(TM) i3-2100 CPU @ 3.10GHz (64bit)', '16 GB', '480 GB - KINGSTON SA400S37480G ATA Device (OK) / 320 GB - SAMSUNG HD321KJ ATA Device (OK) / 320 GB - SAMSUNG HD321KJ ATA Device (OK)', 'NVIDIA GeForce 210', 'ATAPI iHAS122   F ATA Device', 'ASRock H61M-VS', 'd', '394', '2011-12-01', '2024-04-26'),
(2, 2, 1, 'Intel Core i5', '8GB', '500GB', 'NVIDIA GeForce GTX 1060', 'CD/DVD', 'ASUS Prime B450M-A', 'd', '215', '2024-04-12', '2024-04-12'),
(3, 5, 1, 'AMD Ryzen 7', '16GB', '1TB SSD', 'AMD Radeon RX 580', 'CD/DVD', 'MSI B450 Tomahawk', 'd', '173', '2024-04-11', '2024-04-11'),
(4, 10, 1, 'Intel Core i7', '32GB', '2TB', 'NVIDIA Quadro RTX 4000', 'CD/DVD', 'Gigabyte B550 Aorus Elite', 'd', '324', '2024-04-10', '2024-04-10'),
(5, 15, 1, 'AMD Ryzen 5', '8GB', '500GB SSD', 'NVIDIA GeForce GTX 1650', 'CD/DVD', 'ASRock B450M Pro4', 'd', '258', '2024-04-09', '2024-04-09'),
(6, 20, 1, 'Intel Core i9', '64GB', '4TB SSD', 'NVIDIA GeForce RTX 3080', 'CD/DVD', 'MSI Z490-A Pro', 'd', '381', '2024-04-08', '2024-04-08'),
(7, 3, 1, 'Intel Core i5', '16GB', '1TB', 'AMD Radeon RX 5700 XT', 'CD/DVD', 'ASUS TUF Gaming B550-PLUS', 'd', '163', '2024-04-07', '2024-04-07'),
(8, 8, 1, 'AMD Ryzen 9', '64GB', '2TB SSD', 'NVIDIA GeForce RTX 3090', 'CD/DVD', 'ASUS ROG Strix X570-E', 'd', '296', '2024-04-06', '2024-04-06'),
(9, 13, 1, 'Intel Core i7', '32GB', '1TB SSD', 'AMD Radeon RX 6800 XT', 'CD/DVD', 'Gigabyte B550M DS3H', 'd', '349', '2024-04-05', '2024-04-05'),
(10, 17, 1, 'AMD Ryzen 5', '8GB', '500GB', 'NVIDIA GeForce GTX 1660', 'CD/DVD', 'ASRock B450 Pro4', 'd', '197', '2024-04-04', '2024-04-04'),
(12, 2, 1, '11th Gen Intel(R) Core(TM) i5-11300H @ 3.10GHz (64bit)', '24 GB', '512 GB - INTEL SSD', 'NVIDIA GeForce GTX 1650 - (4095.00 MB)', 'A maquina não tem uma unidade de CD/DVD instalado!', 'LENOVO LNVNB161216', 'n', '365', '2024-04-25', '2024-04-26');

-- --------------------------------------------------------

--
-- Estrutura para tabela `setores`
--

CREATE TABLE `setores` (
  `id_setor` int(11) UNSIGNED NOT NULL,
  `cc` int(11) UNSIGNED NOT NULL,
  `nome_setor` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `setores`
--

INSERT INTO `setores` (`id_setor`, `cc`, `nome_setor`) VALUES
(2, 205, 'Secretaria'),
(3, 210, 'Compras'),
(4, 220, 'Almoxarifado'),
(5, 230, 'Pessoal'),
(6, 240, 'Financeiro'),
(7, 250, 'Faturamento'),
(8, 260, 'Grafica'),
(10, 600, 'Comercial'),
(11, 705, 'Manutencao'),
(12, 710, 'Coordenacao'),
(13, 715, 'Tecnologia da Informacao'),
(14, 720, 'Levantamentos Aereos'),
(15, 750, 'Levantamentos Terrestres'),
(16, 760, 'LiDAR'),
(17, 765, 'Edicao Grafica'),
(18, 770, 'Servicos Especiais'),
(19, 775, 'PDI e Geoprocessamento'),
(20, 780, 'Fotogrametria'),
(21, 790, 'Laboratorio'),
(22, 0, 'Diretoria'),
(25, 245, 'Controladoria'),
(26, 246, 'QSMS'),
(27, 280, 'Administracao'),
(28, 311, 'Engenharia'),
(29, 620, 'Comercial Engenharia'),
(31, 722, 'Voo'),
(32, 785, 'Aerotriangulacao'),
(33, 75001, 'Campo externo'),
(34, 30001, 'Engenharia Campo'),
(36, 31101, 'Engenharia - Sobrado'),
(37, 1, 'Contabilidade'),
(38, 201, 'Administracao'),
(40, 716, 'Pesquisa e Desenvolvimento');

-- --------------------------------------------------------

--
-- Estrutura para tabela `softwares`
--

CREATE TABLE `softwares` (
  `id_software` int(11) UNSIGNED NOT NULL,
  `nome` varchar(255) NOT NULL,
  `n_licencas` int(11) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `softwares`
--

INSERT INTO `softwares` (`id_software`, `nome`, `n_licencas`) VALUES
(1, 'Windows 98', 5),
(2, 'Windows XP PRO', 5),
(3, 'Windows Server 2003', 1),
(4, 'Windows Server 2008', 1),
(5, 'Windows 7 - PRO', 10),
(6, 'Office 2007 PRO', 10),
(7, 'Project 98', 10),
(8, 'Project  2003', 1),
(9, 'Project  2007', 1),
(10, 'AutoCAD R14', 1),
(11, 'AutoCAD Map5', 1),
(12, 'AutoCAD Map 3D 2007', 5),
(13, 'Autocad Civil 3D 2007', 5),
(14, 'AutoCAD Map 3D 2009', 5),
(15, 'Raster 2007', 5),
(16, 'Raster 2009', 5),
(17, 'Photoshop CS3', 5),
(18, 'Corel Draw  9.0', 5),
(19, 'Acrobat 6.0', 5),
(20, 'Visual Studio 2005', 5),
(21, 'Visual Studio 2003', 5),
(22, 'Visual Studio 2008', 5),
(23, 'Visual Studio 2010', 5),
(24, 'Office 2007 PRO', 10),
(25, 'Dreamweaver CS5', 1),
(26, 'AutoCAD Map 3D 2011', 5),
(27, 'Raster 2011', 5),
(28, 'Autocad Civil 3D 2011', 5),
(29, 'Photoshop CS5', 1),
(30, 'Corel Draw 12', 1),
(31, 'SQL Server 2008', 1),
(32, 'Acrobat X Pro', 1),
(33, 'PhotoShop CS2', 1),
(34, 'MicroStation V8i', 5),
(35, 'Windows Vista', 5),
(36, 'Windows 8', 5),
(37, 'Office 2013', 5),
(38, 'Windows 8.1 PRO', 5),
(39, 'Photoshop CS6', 1),
(40, 'Corel DRAW X6', 1),
(41, 'Corel DRAW X4', 1),
(42, 'Corel DRAW X5', 1),
(43, 'Office 2010', 10),
(44, 'Photoshop CC 2015', 5),
(45, 'Windows 10 PRO', 10),
(46, 'Windows 10 Home', 10),
(47, 'Office 2013', 10),
(48, 'Global Mapper', 5),
(49, 'PhotoShop CC 2017', 1),
(50, 'Photoshop Assinatura', 5),
(51, 'Office 365', 5),
(52, 'ArcGIS', 3),
(53, 'Windows 11 PRO', 5),
(54, 'Autodesk Civil 3D 2021', 5);

-- --------------------------------------------------------

--
-- Estrutura para tabela `softwaresfunc`
--

CREATE TABLE `softwaresfunc` (
  `id_softwarefunc` int(11) UNSIGNED NOT NULL,
  `fk_hardware` int(11) UNSIGNED NOT NULL,
  `fk_software` int(11) UNSIGNED NOT NULL,
  `data_instalacao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `softwaresfunc`
--

INSERT INTO `softwaresfunc` (`id_softwarefunc`, `fk_hardware`, `fk_software`, `data_instalacao`) VALUES
(2, 2, 7, '2024-04-11'),
(3, 3, 14, '2024-04-10'),
(4, 1, 26, '2024-04-09'),
(5, 5, 3, '2024-04-08'),
(6, 6, 19, '2024-04-07'),
(7, 7, 11, '2024-04-06'),
(8, 1, 24, '2024-04-05'),
(9, 2, 5, '2024-04-04'),
(10, 3, 16, '2024-04-03'),
(11, 4, 9, '2024-04-02'),
(12, 5, 22, '2024-04-01'),
(13, 6, 2, '2024-03-31'),
(14, 7, 17, '2024-03-30'),
(15, 8, 8, '2024-03-29'),
(16, 9, 25, '2024-03-28'),
(17, 10, 20, '2024-03-27'),
(18, 2, 6, '2024-03-26'),
(19, 3, 13, '2024-03-25'),
(20, 1, 15, '2024-03-24'),
(21, 12, 11, '2024-04-26'),
(22, 12, 50, '2024-04-26'),
(23, 12, 53, '2024-04-26'),
(24, 12, 51, '2024-04-26'),
(25, 1, 5, '2024-04-26');

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `softwares_instalados`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `softwares_instalados` (
`id_softwarefunc` int(11) unsigned
,`fk_hardware` int(11) unsigned
,`fk_software` int(11) unsigned
,`data_instalacao` date
,`id_software` int(11) unsigned
,`nome` varchar(255)
,`n_licencas` int(11) unsigned
,`id_hardware` int(11) unsigned
,`fk_funcionario` int(11) unsigned
,`processador` varchar(255)
,`memoria_ram` varchar(255)
,`hd` varchar(255)
,`placa_video` varchar(255)
,`drivers` varchar(255)
,`motherboard` varchar(255)
,`tipo` enum('n','d')
,`numero` varchar(10)
,`data_cadastro` date
,`id_funcionario` int(11) unsigned
,`nome_funcionario` varchar(255)
,`fk_setor` int(11) unsigned
,`data_ultima_afericao` date
,`matricula` int(11)
,`nome_setor` varchar(255)
,`cc` int(11) unsigned
,`data_atualizacao` date
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) UNSIGNED NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome_usuario`, `senha`, `login`) VALUES
(1, 'Usuario 1', 'a79e487677e6f8989457d179f4a2d7f6', 'user'),
(2, 'Usuario 2', '070c378c4e07b5cee2b8a361a8e9cda8', 'user2');

-- --------------------------------------------------------

--
-- Estrutura para view `softwares_instalados`
--
DROP TABLE IF EXISTS `softwares_instalados`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`127.0.0.1` SQL SECURITY DEFINER VIEW `softwares_instalados`  AS SELECT `sf`.`id_softwarefunc` AS `id_softwarefunc`, `sf`.`fk_hardware` AS `fk_hardware`, `sf`.`fk_software` AS `fk_software`, `sf`.`data_instalacao` AS `data_instalacao`, `s`.`id_software` AS `id_software`, `s`.`nome` AS `nome`, `s`.`n_licencas` AS `n_licencas`, `h`.`id_hardware` AS `id_hardware`, `h`.`fk_funcionario` AS `fk_funcionario`, `h`.`processador` AS `processador`, `h`.`memoria_ram` AS `memoria_ram`, `h`.`hd` AS `hd`, `h`.`placa_video` AS `placa_video`, `h`.`drivers` AS `drivers`, `h`.`motherboard` AS `motherboard`, `h`.`tipo` AS `tipo`, `h`.`numero` AS `numero`, `h`.`data_cadastro` AS `data_cadastro`, `f`.`id_funcionario` AS `id_funcionario`, `f`.`nome_funcionario` AS `nome_funcionario`, `f`.`fk_setor` AS `fk_setor`, `f`.`data_ultima_afericao` AS `data_ultima_afericao`, `f`.`matricula` AS `matricula`, `set`.`nome_setor` AS `nome_setor`, `set`.`cc` AS `cc`, `h`.`data_atualizacao` AS `data_atualizacao` FROM ((((`softwares` `s` join `softwaresfunc` `sf` on(`s`.`id_software` = `sf`.`fk_software`)) join `hardwares` `h` on(`h`.`id_hardware` = `sf`.`fk_hardware`)) join `funcionarios` `f` on(`f`.`id_funcionario` = `h`.`fk_funcionario`)) join `setores` `set` on(`f`.`fk_setor` = `set`.`id_setor`)) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aferidordesktop_dadosrecebidos`
--
ALTER TABLE `aferidordesktop_dadosrecebidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_fk_funcionario_idx` (`fk_funcionario`),
  ADD KEY `app_fk_setor_idx` (`fk_setor`),
  ADD KEY `app_fk_usuario_idx` (`fk_usuario`);

--
-- Índices de tabela `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id_empresa`);

--
-- Índices de tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD PRIMARY KEY (`id_funcionario`),
  ADD UNIQUE KEY `id_funcionario` (`id_funcionario`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `fk_setor` (`fk_setor`);

--
-- Índices de tabela `hardwares`
--
ALTER TABLE `hardwares`
  ADD PRIMARY KEY (`id_hardware`),
  ADD UNIQUE KEY `id_hardware` (`id_hardware`),
  ADD KEY `fk_funcionario` (`fk_funcionario`),
  ADD KEY `hw_empresa` (`fk_empresa`);

--
-- Índices de tabela `setores`
--
ALTER TABLE `setores`
  ADD PRIMARY KEY (`id_setor`),
  ADD UNIQUE KEY `id_setor` (`id_setor`),
  ADD UNIQUE KEY `CC` (`cc`);

--
-- Índices de tabela `softwares`
--
ALTER TABLE `softwares`
  ADD PRIMARY KEY (`id_software`),
  ADD UNIQUE KEY `id_software` (`id_software`);

--
-- Índices de tabela `softwaresfunc`
--
ALTER TABLE `softwaresfunc`
  ADD PRIMARY KEY (`id_softwarefunc`),
  ADD KEY `fk_funcionario` (`fk_hardware`),
  ADD KEY `fk_software` (`fk_software`),
  ADD KEY `id_softwarefunc` (`id_softwarefunc`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aferidordesktop_dadosrecebidos`
--
ALTER TABLE `aferidordesktop_dadosrecebidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id_empresa` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  MODIFY `id_funcionario` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de tabela `hardwares`
--
ALTER TABLE `hardwares`
  MODIFY `id_hardware` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `setores`
--
ALTER TABLE `setores`
  MODIFY `id_setor` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de tabela `softwares`
--
ALTER TABLE `softwares`
  MODIFY `id_software` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de tabela `softwaresfunc`
--
ALTER TABLE `softwaresfunc`
  MODIFY `id_softwarefunc` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `aferidordesktop_dadosrecebidos`
--
ALTER TABLE `aferidordesktop_dadosrecebidos`
  ADD CONSTRAINT `app_fk_funcionario` FOREIGN KEY (`fk_funcionario`) REFERENCES `funcionarios` (`id_funcionario`),
  ADD CONSTRAINT `app_fk_setor` FOREIGN KEY (`fk_setor`) REFERENCES `setores` (`id_setor`),
  ADD CONSTRAINT `app_fk_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Restrições para tabelas `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD CONSTRAINT `funcionarios_fk` FOREIGN KEY (`fk_setor`) REFERENCES `setores` (`id_setor`);

--
-- Restrições para tabelas `hardwares`
--
ALTER TABLE `hardwares`
  ADD CONSTRAINT `hardwares_fk` FOREIGN KEY (`fk_funcionario`) REFERENCES `funcionarios` (`id_funcionario`),
  ADD CONSTRAINT `hw_empresa` FOREIGN KEY (`fk_empresa`) REFERENCES `empresas` (`id_empresa`);

--
-- Restrições para tabelas `softwaresfunc`
--
ALTER TABLE `softwaresfunc`
  ADD CONSTRAINT `softwarefunc_fk1` FOREIGN KEY (`fk_software`) REFERENCES `softwares` (`id_software`),
  ADD CONSTRAINT `softwaresfunc_fk` FOREIGN KEY (`fk_hardware`) REFERENCES `hardwares` (`id_hardware`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
