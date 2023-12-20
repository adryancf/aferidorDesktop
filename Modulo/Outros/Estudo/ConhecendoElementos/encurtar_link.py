from PySide2.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QFrame, QLineEdit, QPushButton, QDialog,QMessageBox
from PySide2.QtCore import QSize, Qt
import sys
import pyshorteners

class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()

        #Inserindo o nome da janela
        self.setWindowTitle("Short Link")
        self.resize(400,300)

        layout = QVBoxLayout()

        self.frame = QFrame()
        
        self.link = QLineEdit(self.frame)
        self.link.setPlaceholderText("Coloque seu link aqui!")
        
        self.botao = QPushButton(self.frame)
        self.botao.setText("Encurte")

        self.result = QLineEdit(self.frame)

        layout.addWidget(self.link)
        layout.addWidget(self.botao)
        layout.addWidget(self.result)

        self.frame.setLayout(layout)

        self.botao.clicked.connect(self.link_short)
        self.setCentralWidget(self.frame)

    def link_short(self):
        short = pyshorteners.Shortener()
        new_link = short.tinyurl.short(self.link.text())
        self.result.setText(new_link)
        msg= QMessageBox(self)
        msg.setWindowTitle("RESULTADO")
        msg.setText(new_link)
        msg.setStandardButtons(QMessageBox. Yes | QMessageBox.No)
        msg.setIcon(QMessageBox.Information)
        r = msg.exec_()

        if(r==QMessageBox.Yes):
            print("SIMMM")
        else:
            print("naooooo")
        



app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec_()