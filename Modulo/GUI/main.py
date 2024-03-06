from PySide2.QtWidgets import QApplication, QWidget, QMessageBox
from PySide2.QtGui import QFont, QIcon
from tela_inicial import Ui_Principal
import sys
import threading
import asyncio

# Módulos para garantir que apenas uma instância do programa seja executada
from tendo import singleton


# Arquivos adicionais
import modulo
from servidorWebSocket import ServidorWebSocket

class Main(QWidget, Ui_Principal):
  def __init__(self) -> None:
    super(Main, self).__init__()
    self.setupUi(self)
    self.setWindowTitle("Aferidor Desktop")
    self.setFixedSize(800,190)
    self.setWindowIcon(QIcon('assets/logo.ico'))
    self.barra_progresso.setVisible(False)

    # Iniciar o servidor WebSocket em uma nova thread
    self.servidor = ServidorWebSocket("localhost", 8181, self)
    self.thread_servidor = threading.Thread(target=self.iniciar_servidor)
    self.thread_servidor.start()

    # Configurar QMessageBox (Caixa de diálogo para exibir mensagens ao usuário)
    msg_box = QMessageBox()
    msg_box.setWindowTitle("Aferidor Desktop")
    font = QFont()
    font.setPointSize(12)
    msg_box.setFont(font)
    msg_box.setIcon(QMessageBox.Information)
    #msg_box.exec_()
      
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
  # QMessageBox.critical(None, "Aferidor Desktop", "Já existe uma instância do Aferidor Desktop em execução.")
  
  # Garantir que apenas uma instância do programa seja executada
  me = singleton.SingleInstance()

  app = QApplication(sys.argv)
  window = Main()
  window.show()
  sys.exit(app.exec_())
