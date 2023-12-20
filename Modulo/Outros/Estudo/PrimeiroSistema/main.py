from PySide2.QtWidgets import(QApplication, QMainWindow, QWidget)
from ui_login import Ui_Login
from ui_main import Ui_MainWindow
import sys

class Login(QWidget, Ui_Login):
    def __init__(self) ->None:
        super(Login, self).__init__()
        self.setupUi(self)
        self.setWindowTitle("Login do Sistema")
        self.btn_login.clicked.connect(self.open_system)
    
    def open_system(self):
        if self.txt_password.text() == '123':
            self.w = MainWindow()
            self.w.show()
            self.close()
        else:
            print('Senha Inválida')


class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.setupUi(self)
        self.setWindowTitle("Sistema de Gerenciamento")




if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = Login()
    window.show()
    app.exec_() 
