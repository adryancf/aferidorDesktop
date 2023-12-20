# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'login.ui'
##
## Created by: Qt User Interface Compiler version 5.15.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide2.QtCore import *
from PySide2.QtGui import *
from PySide2.QtWidgets import *


class Ui_Login(object):
    def setupUi(self, Login):
        if not Login.objectName():
            Login.setObjectName(u"Login")
        Login.resize(434, 472)
        font = QFont()
        font.setPointSize(11)
        Login.setFont(font)
        Login.setStyleSheet(u"background-color: rgb(192, 199, 200);")
        self.frame = QFrame(Login)
        self.frame.setObjectName(u"frame")
        self.frame.setGeometry(QRect(30, 170, 371, 271))
        self.frame.setStyleSheet(u"background-color: rgb(220, 220, 220)")
        self.frame.setFrameShape(QFrame.StyledPanel)
        self.frame.setFrameShadow(QFrame.Raised)
        self.txt_user = QLineEdit(self.frame)
        self.txt_user.setObjectName(u"txt_user")
        self.txt_user.setGeometry(QRect(60, 70, 241, 31))
        self.txt_user.setFont(font)
        self.txt_user.setAlignment(Qt.AlignCenter)
        self.txt_password = QLineEdit(self.frame)
        self.txt_password.setObjectName(u"txt_password")
        self.txt_password.setGeometry(QRect(60, 130, 241, 31))
        self.txt_password.setFont(font)
        self.txt_password.setEchoMode(QLineEdit.Password)
        self.txt_password.setAlignment(Qt.AlignCenter)
        self.btn_login = QPushButton(self.frame)
        self.btn_login.setObjectName(u"btn_login")
        self.btn_login.setGeometry(QRect(100, 190, 161, 41))
        font1 = QFont()
        font1.setFamily(u"Aharoni")
        font1.setPointSize(11)
        font1.setBold(True)
        font1.setWeight(75)
        self.btn_login.setFont(font1)
        self.btn_login.setCursor(QCursor(Qt.PointingHandCursor))
        self.btn_login.setStyleSheet(u"QPushButton{\n"
"	background-color: rgb(192, 199, 200);\n"
"	border-radius:10px;\n"
"\n"
"}\n"
"\n"
"QPushButton:hover{\n"
"	background-color: rgb(190, 190, 190);\n"
"\n"
"\n"
"}")
        self.logo = QLabel(Login)
        self.logo.setObjectName(u"logo")
        self.logo.setGeometry(QRect(170, 40, 101, 101))
        self.logo.setPixmap(QPixmap(u"../../../../../../Downloads/logo ESTEIO/EsteioRetrorrefletancia_logo.png"))
        self.logo.setScaledContents(True)
        self.logo.raise_()
        self.frame.raise_()
        QWidget.setTabOrder(self.txt_user, self.txt_password)
        QWidget.setTabOrder(self.txt_password, self.btn_login)

        self.retranslateUi(Login)

        QMetaObject.connectSlotsByName(Login)
    # setupUi

    def retranslateUi(self, Login):
        Login.setWindowTitle(QCoreApplication.translate("Login", u"Form", None))
        self.txt_user.setPlaceholderText(QCoreApplication.translate("Login", u"User", None))
        self.txt_password.setPlaceholderText(QCoreApplication.translate("Login", u"Password", None))
        self.btn_login.setText(QCoreApplication.translate("Login", u"Entrar", None))
        self.logo.setText("")
    # retranslateUi

