# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'ui_main.ui'
##
## Created by: Qt User Interface Compiler version 5.15.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide2.QtCore import *
from PySide2.QtGui import *
from PySide2.QtWidgets import *


class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        if not MainWindow.objectName():
            MainWindow.setObjectName(u"MainWindow")
        MainWindow.resize(606, 518)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName(u"centralwidget")
        self.verticalLayout = QVBoxLayout(self.centralwidget)
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.frame = QFrame(self.centralwidget)
        self.frame.setObjectName(u"frame")
        self.frame.setFrameShape(QFrame.StyledPanel)
        self.frame.setFrameShadow(QFrame.Raised)
        self.horizontalLayout = QHBoxLayout(self.frame)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.btn_home = QPushButton(self.frame)
        self.btn_home.setObjectName(u"btn_home")

        self.horizontalLayout.addWidget(self.btn_home)

        self.btn_tables = QPushButton(self.frame)
        self.btn_tables.setObjectName(u"btn_tables")

        self.horizontalLayout.addWidget(self.btn_tables)

        self.btn_sobre = QPushButton(self.frame)
        self.btn_sobre.setObjectName(u"btn_sobre")

        self.horizontalLayout.addWidget(self.btn_sobre)

        self.btn_contato = QPushButton(self.frame)
        self.btn_contato.setObjectName(u"btn_contato")

        self.horizontalLayout.addWidget(self.btn_contato)

        self.btn_outro = QPushButton(self.frame)
        self.btn_outro.setObjectName(u"btn_outro")

        self.horizontalLayout.addWidget(self.btn_outro)


        self.verticalLayout.addWidget(self.frame)

        self.pages = QStackedWidget(self.centralwidget)
        self.pages.setObjectName(u"pages")
        self.pg_home = QWidget()
        self.pg_home.setObjectName(u"pg_home")
        self.horizontalLayout_2 = QHBoxLayout(self.pg_home)
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.titulo = QLabel(self.pg_home)
        self.titulo.setObjectName(u"titulo")
        self.titulo.setStyleSheet(u"background-color: rgb(255, 255, 255);")

        self.horizontalLayout_2.addWidget(self.titulo)

        self.pages.addWidget(self.pg_home)
        self.pg_table = QWidget()
        self.pg_table.setObjectName(u"pg_table")
        self.horizontalLayout_3 = QHBoxLayout(self.pg_table)
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.tabWidget = QTabWidget(self.pg_table)
        self.tabWidget.setObjectName(u"tabWidget")
        self.Sistema1 = QWidget()
        self.Sistema1.setObjectName(u"Sistema1")
        self.verticalLayout_7 = QVBoxLayout(self.Sistema1)
        self.verticalLayout_7.setObjectName(u"verticalLayout_7")
        self.geral = QVBoxLayout()
        self.geral.setObjectName(u"geral")
        self.abrir = QHBoxLayout()
        self.abrir.setObjectName(u"abrir")
        self.txt_path = QLineEdit(self.Sistema1)
        self.txt_path.setObjectName(u"txt_path")

        self.abrir.addWidget(self.txt_path)

        self.btn_abrir = QPushButton(self.Sistema1)
        self.btn_abrir.setObjectName(u"btn_abrir")

        self.abrir.addWidget(self.btn_abrir)


        self.geral.addLayout(self.abrir)

        self.tables_btn = QHBoxLayout()
        self.tables_btn.setObjectName(u"tables_btn")
        self.tables = QVBoxLayout()
        self.tables.setObjectName(u"tables")
        self.table1 = QVBoxLayout()
        self.table1.setObjectName(u"table1")
        self.titulo_estoque = QLabel(self.Sistema1)
        self.titulo_estoque.setObjectName(u"titulo_estoque")

        self.table1.addWidget(self.titulo_estoque)

        self.tb_estoque = QTreeWidget(self.Sistema1)
        self.tb_estoque.setObjectName(u"tb_estoque")

        self.table1.addWidget(self.tb_estoque)


        self.tables.addLayout(self.table1)

        self.table2 = QVBoxLayout()
        self.table2.setObjectName(u"table2")
        self.titulo_saida = QLabel(self.Sistema1)
        self.titulo_saida.setObjectName(u"titulo_saida")

        self.table2.addWidget(self.titulo_saida)

        self.tb_saida = QTreeWidget(self.Sistema1)
        __qtreewidgetitem = QTreeWidgetItem()
        __qtreewidgetitem.setText(0, u"C1");
        self.tb_saida.setHeaderItem(__qtreewidgetitem)
        self.tb_saida.setObjectName(u"tb_saida")

        self.table2.addWidget(self.tb_saida)


        self.tables.addLayout(self.table2)


        self.tables_btn.addLayout(self.tables)

        self.btns = QFrame(self.Sistema1)
        self.btns.setObjectName(u"btns")
        self.btns.setFrameShape(QFrame.StyledPanel)
        self.btns.setFrameShadow(QFrame.Raised)
        self.verticalLayout_2 = QVBoxLayout(self.btns)
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.btn_importar = QPushButton(self.btns)
        self.btn_importar.setObjectName(u"btn_importar")

        self.verticalLayout_2.addWidget(self.btn_importar)

        self.btn_saida = QPushButton(self.btns)
        self.btn_saida.setObjectName(u"btn_saida")

        self.verticalLayout_2.addWidget(self.btn_saida)

        self.btn_estorno = QPushButton(self.btns)
        self.btn_estorno.setObjectName(u"btn_estorno")

        self.verticalLayout_2.addWidget(self.btn_estorno)

        self.espaco_btn = QSpacerItem(20, 40, QSizePolicy.Minimum, QSizePolicy.Expanding)

        self.verticalLayout_2.addItem(self.espaco_btn)


        self.tables_btn.addWidget(self.btns)


        self.geral.addLayout(self.tables_btn)


        self.verticalLayout_7.addLayout(self.geral)

        self.tabWidget.addTab(self.Sistema1, "")
        self.Sistema2 = QWidget()
        self.Sistema2.setObjectName(u"Sistema2")
        self.tabWidget.addTab(self.Sistema2, "")

        self.horizontalLayout_3.addWidget(self.tabWidget)

        self.pages.addWidget(self.pg_table)

        self.verticalLayout.addWidget(self.pages)

        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)

        self.pages.setCurrentIndex(1)
        self.tabWidget.setCurrentIndex(0)


        QMetaObject.connectSlotsByName(MainWindow)
    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QCoreApplication.translate("MainWindow", u"MainWindow", None))
        self.btn_home.setText(QCoreApplication.translate("MainWindow", u"Home", None))
        self.btn_tables.setText(QCoreApplication.translate("MainWindow", u"Tables", None))
        self.btn_sobre.setText(QCoreApplication.translate("MainWindow", u"Sobre", None))
        self.btn_contato.setText(QCoreApplication.translate("MainWindow", u"Contato", None))
        self.btn_outro.setText(QCoreApplication.translate("MainWindow", u"Outro", None))
        self.titulo.setText(QCoreApplication.translate("MainWindow", u"<html><head/><body><p align=\"center\"><span style=\" font-size:48pt; font-weight:600;\">Testando</span></p><p align=\"center\"><span style=\" font-size:24pt; font-weight:600;\">Sistema de Gerenciamento</span></p></body></html>", None))
        self.btn_abrir.setText(QCoreApplication.translate("MainWindow", u"Abrir", None))
        self.titulo_estoque.setText(QCoreApplication.translate("MainWindow", u"Estoque", None))
        ___qtreewidgetitem = self.tb_estoque.headerItem()
        ___qtreewidgetitem.setText(5, QCoreApplication.translate("MainWindow", u"Usuario", None));
        ___qtreewidgetitem.setText(4, QCoreApplication.translate("MainWindow", u"Coluna 5", None));
        ___qtreewidgetitem.setText(3, QCoreApplication.translate("MainWindow", u"COluna 4", None));
        ___qtreewidgetitem.setText(2, QCoreApplication.translate("MainWindow", u"Coluna 3", None));
        ___qtreewidgetitem.setText(1, QCoreApplication.translate("MainWindow", u"Coluna 2", None));
        ___qtreewidgetitem.setText(0, QCoreApplication.translate("MainWindow", u"Coluna 1", None));
        self.titulo_saida.setText(QCoreApplication.translate("MainWindow", u"Saida", None))
        ___qtreewidgetitem1 = self.tb_saida.headerItem()
        ___qtreewidgetitem1.setText(2, QCoreApplication.translate("MainWindow", u"USUARIO", None));
        ___qtreewidgetitem1.setText(1, QCoreApplication.translate("MainWindow", u"C2", None));
        self.btn_importar.setText(QCoreApplication.translate("MainWindow", u"Importar", None))
        self.btn_saida.setText(QCoreApplication.translate("MainWindow", u"Gerar Saida", None))
        self.btn_estorno.setText(QCoreApplication.translate("MainWindow", u"Estorno", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.Sistema1), QCoreApplication.translate("MainWindow", u"TreeWidth", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.Sistema2), QCoreApplication.translate("MainWindow", u"Tab 2", None))
    # retranslateUi

