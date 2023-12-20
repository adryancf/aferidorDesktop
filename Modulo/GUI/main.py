from PySide2.QtWidgets import QApplication, QWidget, QMessageBox
from PySide2.QtGui import QFont
from tela_inicial import Ui_Principal
import sys
import threading
import asyncio

# Arquivos adicionais
import modulo
from servidorWebSocket import ServidorWebSocket


class Main(QWidget, Ui_Principal):
    def __init__(self) -> None:
        super(Main, self).__init__()
        self.setupUi(self)
        self.setWindowTitle("Aferidor Desktop")
        self.setFixedSize(600,230)
        self.barra_progresso.setVisible(False)
        self.btn_scanner.clicked.connect(self.scan_system)   

        # Iniciar o servidor WebSocket em uma nova thread
        self.servidor = ServidorWebSocket("localhost", 8181)
        self.thread_servidor = threading.Thread(target=self.iniciar_servidor)
        self.thread_servidor.start()

    #Função do Botão Scan
    def scan_system(self):
        self.barra_progresso.setVisible(True)
        result = modulo.scan_aferidor(self.barra_progresso, self.servidor, self.loop_websocket)

        # Exibir QMessageBox
        msg_box = QMessageBox()
        msg_box.setWindowTitle("Aferidor Desktop")

        # Configurar a fonte
        font = QFont()
        font.setPointSize(12)  # Ajuste o tamanho da fonte conforme necessário
        font.setBold(True)
        msg_box.setFont(font)

        msg_box.setText(result)
        msg_box.setIcon(QMessageBox.Information)
        msg_box.exec_()

        self.barra_progresso.setVisible(False)

    def iniciar_servidor(self):
        # Inicializar o loop de eventos para rodar o websocket
        self.loop_websocket = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop_websocket)

        try:
            self.loop_websocket.run_until_complete(self.servidor.iniciar_servidor())
        finally:
            self.loop_websocket.close()

    def closeEvent(self, event):
        # Encerrar o servidor WebSocket quando a janela fechar
        if(self.loop_websocket.is_running()):
            asyncio.run_coroutine_threadsafe(self.servidor.encerrar_servidor(), self.loop_websocket)
        else:
            print("Servidor WebSocket já encerrado!")
        
        event.accept()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = Main()
    window.show()
    sys.exit(app.exec_())
