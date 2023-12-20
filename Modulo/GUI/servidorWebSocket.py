import asyncio
import websockets


class ServidorWebSocket:

    def __init__(self, ip, porta):
        self.ip = ip
        self.porta = porta
        self.servidor = None

    async def servidor_websocket(self, websocket, path):   
        try:

            # Obtendo informações sobre a conexão do cliente
            endereco_cliente = websocket.remote_address
            print(f"Conexão estabelecida com cliente {endereco_cliente}")

            while True:
                #A execução fica parada nesta linha até receber uma mensagem do cliente
                msg = await websocket.recv()
                print(f"Recebido do cliente {endereco_cliente}: {msg}")
                
    
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
                await websocket.close()
            
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


