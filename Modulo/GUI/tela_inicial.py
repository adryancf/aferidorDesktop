# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'Principal.ui'
##
## Created by: Qt User Interface Compiler version 5.15.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide2.QtCore import *
from PySide2.QtGui import *
from PySide2.QtWidgets import *


class Ui_Principal(object):
    def setupUi(self, Principal):
        if not Principal.objectName():
            Principal.setObjectName(u"Principal")
        Principal.resize(610, 235)
        sizePolicy = QSizePolicy(QSizePolicy.Minimum, QSizePolicy.Minimum)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(Principal.sizePolicy().hasHeightForWidth())
        Principal.setSizePolicy(sizePolicy)
        Principal.setStyleSheet(u"background-color: rgb(255, 255, 255\n"
");")
        self.verticalLayout = QVBoxLayout(Principal)
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.frame = QFrame(Principal)
        self.frame.setObjectName(u"frame")
        self.frame.setStyleSheet(u"background-color: rgb(230, 230, 230);")
        self.frame.setFrameShape(QFrame.StyledPanel)
        self.frame.setFrameShadow(QFrame.Raised)
        self.verticalLayout_3 = QVBoxLayout(self.frame)
        self.verticalLayout_3.setObjectName(u"verticalLayout_3")
        self.verticalLayout_2 = QVBoxLayout()
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.Titulo = QLabel(self.frame)
        self.Titulo.setObjectName(u"Titulo")
        self.Titulo.setEnabled(True)
        sizePolicy1 = QSizePolicy(QSizePolicy.Preferred, QSizePolicy.Fixed)
        sizePolicy1.setHorizontalStretch(0)
        sizePolicy1.setVerticalStretch(0)
        sizePolicy1.setHeightForWidth(self.Titulo.sizePolicy().hasHeightForWidth())
        self.Titulo.setSizePolicy(sizePolicy1)
        self.Titulo.setBaseSize(QSize(0, 4))
        font = QFont()
        font.setFamily(u"Aharoni")
        font.setPointSize(80)
        font.setBold(False)
        font.setWeight(50)
        self.Titulo.setFont(font)
        self.Titulo.setAlignment(Qt.AlignCenter)
        self.Titulo.setMargin(0)

        self.verticalLayout_2.addWidget(self.Titulo)

        self.verticalSpacer = QSpacerItem(20, 15, QSizePolicy.Minimum, QSizePolicy.Fixed)

        self.verticalLayout_2.addItem(self.verticalSpacer)

        self.horizontalLayout = QHBoxLayout()
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.horizontalSpacer = QSpacerItem(40, 20, QSizePolicy.Expanding, QSizePolicy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer)

        self.btn_scanner = QPushButton(self.frame)
        self.btn_scanner.setObjectName(u"btn_scanner")
        self.btn_scanner.setEnabled(True)
        sizePolicy2 = QSizePolicy(QSizePolicy.Maximum, QSizePolicy.Fixed)
        sizePolicy2.setHorizontalStretch(150)
        sizePolicy2.setVerticalStretch(50)
        sizePolicy2.setHeightForWidth(self.btn_scanner.sizePolicy().hasHeightForWidth())
        self.btn_scanner.setSizePolicy(sizePolicy2)
        self.btn_scanner.setMinimumSize(QSize(230, 60))
        font1 = QFont()
        font1.setFamily(u"Aharoni")
        font1.setPointSize(15)
        font1.setBold(True)
        font1.setWeight(75)
        self.btn_scanner.setFont(font1)
        self.btn_scanner.setStyleSheet(u"QPushButton{\n"
"	background-color: rgb(28, 4, 149);\n"
"	color: rgb(255, 255, 255);\n"
"	border-radius:5px;\n"
"\n"
"}\n"
"\n"
"QPushButton:hover{\n"
"	background-color: rgb(6, 64, 255);\n"
"\n"
"\n"
"}")

        self.horizontalLayout.addWidget(self.btn_scanner)

        self.horizontalSpacer_2 = QSpacerItem(40, 20, QSizePolicy.Expanding, QSizePolicy.Minimum)

        self.horizontalLayout.addItem(self.horizontalSpacer_2)


        self.verticalLayout_2.addLayout(self.horizontalLayout)


        self.verticalLayout_3.addLayout(self.verticalLayout_2)

        self.verticalSpacer_2 = QSpacerItem(20, 15, QSizePolicy.Minimum, QSizePolicy.Fixed)

        self.verticalLayout_3.addItem(self.verticalSpacer_2)

        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalSpacer_4 = QSpacerItem(40, 20, QSizePolicy.Fixed, QSizePolicy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer_4)

        self.barra_progresso = QProgressBar(self.frame)
        self.barra_progresso.setObjectName(u"barra_progresso")
        font2 = QFont()
        font2.setBold(True)
        font2.setWeight(75)
        self.barra_progresso.setFont(font2)
        self.barra_progresso.setStyleSheet(u"QProgressBar{\n"
"	background-color: rgb(200, 200, 200);\n"
"	color: rgb(50, 50, 50);\n"
"	border-style: solid;\n"
"	border-radius: 10px;\n"
"	text-align: center;\n"
"	\n"
"}\n"
"QProgressBar::chunk{\n"
"	\n"
"	background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:0.831, y2:0.0625, stop:0 rgba(7, 20, 255, 255), stop:1 rgba(130, 193, 255, 255));\n"
"	border-radius:10px;\n"
"	\n"
"}")
        self.barra_progresso.setValue(100)
        self.barra_progresso.setTextVisible(True)

        self.horizontalLayout_2.addWidget(self.barra_progresso)

        self.horizontalSpacer_3 = QSpacerItem(40, 20, QSizePolicy.Fixed, QSizePolicy.Minimum)

        self.horizontalLayout_2.addItem(self.horizontalSpacer_3)


        self.verticalLayout_3.addLayout(self.horizontalLayout_2)


        self.verticalLayout.addWidget(self.frame)


        self.retranslateUi(Principal)

        QMetaObject.connectSlotsByName(Principal)
    # setupUi

    def retranslateUi(self, Principal):
        Principal.setWindowTitle(QCoreApplication.translate("Principal", u"Form", None))
        self.Titulo.setText(QCoreApplication.translate("Principal", u"<html><head/><body><p align=\"center\"><span style=\" font-size:32pt; font-weight:600;\">AFERIDOR DE SOFTWARE</span></p></body></html>", None))
        self.btn_scanner.setText(QCoreApplication.translate("Principal", u"Scan", None))
    # retranslateUi

