from PySide2.QtWidgets import QApplication, QWidget, QMessageBox, QProgressDialog
from PySide2.QtGui import QFont, QIcon
from PySide2.QtCore import QTimer

from tela_inicial import Ui_Principal
import sys
import threading
import asyncio

# Módulos para garantir que apenas uma instância do programa seja executada
from tendo import singleton

# Arquivos adicionais
import modulo_ScanSystem
from servidorWebSocket import ServidorWebSocket

class Main(QWidget, Ui_Principal):
  def __init__(self) -> None:
    super(Main, self).__init__()
    self.setupUi(self)
    self.setWindowTitle("Aferidor Desktop")
    self.setFixedSize(800,190)
    self.setWindowIcon(QIcon('favicon.ico'))
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

  def encerrar_app_cliente(self):
    print("Encerrando programa por meio de uma mensagem do cliente...")
    self.close()

  def closeEvent(self, event):
    # Encerrar o servidor WebSocket quando a janela fechar
    if(self.loop_websocket.is_running()):
      asyncio.run_coroutine_threadsafe(self.servidor.encerrar_servidor(), self.loop_websocket)
    else:
      print("Servidor WebSocket já encerrado!")
    
    print("Encerrando programa...")
    event.accept()

def exibir_mensagem_erro():
  # QMessageBox.critical(None, "Aferidor Desktop", "Já existe uma instância do Aferidor Desktop em execução.")
  msg_box = QMessageBox()
  msg_box.setWindowTitle("Aferidor Desktop")
  msg_box.setText("O programa já está aberto no seu computador.")
  msg_box.setIcon(QMessageBox.Critical)
  msg_box.setWindowIcon(QIcon('assets/logo.ico'))
  QTimer.singleShot(2000, msg_box.accept)
  msg_box.exec_()


if __name__ == "__main__":
  
  app = QApplication(sys.argv)
  # Garantir que apenas uma instância do programa seja executada
  try:
    me = singleton.SingleInstance()
  except singleton.SingleInstanceException:
    print(f"Não pode ser aberto duas instâncias do aferidorDesktop.")
    exibir_mensagem_erro()
    sys.exit(1)

  
  window = Main()
  window.show()
  sys.exit(app.exec_())
