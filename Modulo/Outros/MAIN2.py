from PySide2.QtWidgets import(QApplication, QWidget, QMessageBox)
from PySide2.QtGui import QFont
from tela_inicial import Ui_Principal
from PySide2.QtCore import QThread, Signal as pqtsignal
import sys
import asyncio

# Arquivos adcionais
import modulo #Modulo que obtem as informações
from servidorWebSocket import ServidorWebSocket

#Criando uma classe para rodar o servidor em uma thread separada
#Faço isso utilizando o QThread do PySide2 para melhor integração com a interface gráfica
class ThreadWebSocket(QThread):

    encerrar_sinal = pqtsignal()

    def __init__(self, servidor):
        QThread.__init__(self)
        self.servidor = servidor
        self.loop = None
        self.encerrar_sinal.connect(self.encerrar)

    def run(self):

        # Inicializar o loop de eventos asyncio
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(self.servidor.iniciar_servidor())
        self.loop.run_forever()

    def encerrar(self):
        # Encerrar o loop de eventos asyncio garantindo que esta no loop certo
        asyncio.run_coroutine_threadsafe(self.servidor.encerrar_servidor(), self.loop)

class Main(QWidget, Ui_Principal):
    def __init__(self) ->None:
        super(Main, self).__init__()
        self.setupUi(self)
        self.setWindowTitle("Aferidor Desktop")
        self.setFixedSize(600,230)
        self.barra_progresso.setVisible(False)
        self.btn_scanner.clicked.connect(self.scan_system)

        # Iniciar o servidor WebSocket
        self.servidor = ServidorWebSocket("localhost", 8181)
        self.servidor_thread = ThreadWebSocket(self.servidor)
        self.servidor_thread.start()

    def closeEvent(self, event):
        self.servidor_thread.encerrar_sinal.emit()
    
    #Função do Botão Scan
    def scan_system(self):
        self.barra_progresso.setVisible(True)
        result = modulo.scan_aferidor(self.barra_progresso)

        # Exibir QMessageBox
        msg_box = QMessageBox()
        msg_box.setWindowTitle("Aferidor Desktop")

        # Configurar a fonte
        font = QFont()
        font.setPointSize(12) 
        msg_box.setFont(font)

        msg_box.setText(result)
        msg_box.setIcon(QMessageBox.Information)
        msg_box.exec_()

        self.barra_progresso.setVisible(False)

if __name__ == "__main__":

    # Inicializar a interface gráfica em um loop de eventos asyncio
    app = QApplication(sys.argv)
    window = Main()
    window.show()
    sys.exit(app.exec_())
