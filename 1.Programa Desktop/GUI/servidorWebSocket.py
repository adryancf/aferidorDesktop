import asyncio
import websockets
import modulo_ScanSystem

class ServidorWebSocket:

  def __init__(self, ip, porta, main_instance):
    self.ip = ip
    self.porta = porta
    self.servidor = None
    self.main = main_instance

  async def servidor_websocket(self, websocket, path):   
    try:

      # Obtendo informações sobre a conexão do cliente
      endereco_cliente = websocket.remote_address
      print(f"Conexão estabelecida com cliente {endereco_cliente}")

      while True:
        #A execução fica parada nesta linha até receber uma mensagem do cliente
        msg = await websocket.recv()
        print(f"Recebido do cliente {endereco_cliente}: {msg}")

        if msg == "scan_system":

          #Atualiza a interface
          self.main.textCentral.setText("Analisando a máquina...")
          self.main.barra_progresso.setValue(0)
          self.main.barra_progresso.setVisible(True)

          #Analise
          result = modulo_ScanSystem.scan_system(self.main.barra_progresso, self, self.main.loop_websocket)
          print(result)

          #Envia a mensagem de resultado para o usuario
          self.main.barra_progresso.setVisible(False)
          self.main.textCentral.setText(result)
        
        elif msg == "close_app":
          self.main.encerrar_app_cliente()


    except websockets.exceptions.ConnectionClosedError as e:
      print(f"Conexão WebSocket fechada pelo cliente: {e}")
    except Exception as e:
      print(f"Erro inesperado na conexão WebSocket: {e}")
    finally:
      print("Conexão WebSocket encerrada")

  async def iniciar_servidor(self):
    try:
      self.servidor = await websockets.serve(self.servidor_websocket, self.ip, self.porta)
      print("Servidor WebSocket iniciado localmente... (URL = ws://localhost:8181)")
      #Serve para manter o servidor rodando até que o servidor seja encerrado
      await self.servidor.wait_closed()
    
    except Exception as e:
      print(f"Ocorreu um erro inesperado! {e}")


  async def encerrar_servidor(self):
    if self.servidor:
      print("Encerrando servidor WebSocket...")
        
      #Encerra todas as conexões ativas
      for websocket in set(self.servidor.websockets):
        print(f"Encerrando conexão com cliente {websocket.remote_address}")
        try:
          await websocket.close()
          print(f"Conexão encerrada com sucesso para {websocket.remote_address}")
        except Exception as e:
          print(f"Erro ao encerrar conexão com {websocket.remote_address}: {e}")
        
      #Encerra o servidor
      self.servidor.close()
      await self.servidor.wait_closed()
      print("Servidor WebSocket encerrado")
        
    else:
      print("Servidor WebSocket não iniciado")

  async def enviar_msg(self, msg):
    if self.servidor:
      #Envia uma mensagem para todos os clientes conectados
      for websocket in set(self.servidor.websockets):
        await websocket.send(msg)
    else:
      print("Servidor WebSocket não iniciado")


#Inicia o servidor se o arquivo for executado sozinho. Se for importado para outro programa esse bloco não é executado!
if __name__ == "__main__":
   
  #Criar um unico loop de eventos para o programa
  loop = asyncio.get_event_loop()
  servidor = ServidorWebSocket("localhost", 8181)

  try:
    loop.run_until_complete(servidor.iniciar_servidor())
  except KeyboardInterrupt:
    loop.run_until_complete(servidor.encerrar_servidor()) 
    print("Servidor encerrado pelo usuário")
  
  finally:
    loop.close()


