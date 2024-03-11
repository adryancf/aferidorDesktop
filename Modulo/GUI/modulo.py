import os
import platform
import subprocess
from math import ceil
import asyncio 
import json

from datetime import datetime
from servidorWebSocket import ServidorWebSocket

data_hr_atual = str(datetime.now().replace(microsecond=0))

def scan_system(barra_progresso, websocket_server, loop = None):
    try:
        # Construa o caminho para a pasta de documentos e cria a pasta do programa
        doc = os.path.join(os.path.expanduser("~"), "Documents")
        path = os.path.join(doc, "AferidorDesktop")

        # Crie a pasta se ela não existir
        if not os.path.exists(path):
          os.makedirs(path)

        result_log_path = os.path.join(path, "RESULT_AferidorDesktop.txt")
        error_log_path = os.path.join(path, "ERROR_AferidorDesktop.txt")

        # Limpar o arquivo de saída (caso já exista)
        if os.path.exists(result_log_path):
          os.remove(result_log_path)

        '''
        Links Uteis
        https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/computer-system-hardware-classes
        https://learn.microsoft.com/pt-br/windows/win32/cimwin32prov/computer-system-hardware-classes
        https://learn.microsoft.com/pt-br/windows/win32/wmisdk/wmi-tasks--computer-hardware
        '''

        # Dicionário que relaciona os números aos valores correspondentes
        modelos_hardware = {
            1: 'Other',
            2: 'Unknown',
            3: 'Desktop',
            4: 'Low Profile Desktop',
            5: 'Pizza Box',
            6: 'Mini Tower',
            7: 'Tower',
            8: 'Portable',
            9: 'Laptop',
            10: 'Notebook',
            11: 'Hand Held',
            12: 'Docking Station',
            13: 'All in One',
            14: 'Sub Notebook',
            15: 'Space-Saving',
            16: 'Lunch Box',
            17: 'Main System Chassis',
            18: 'Expansion Chassis',
            19: 'SubChassis',
            20: 'Bus Expansion Chassis',
            21: 'Peripheral Chassis',
            22: 'Storage Chassis',
            23: 'Rack Mount Chassis',
            24: 'Sealed-Case PC',
            30: 'Tablet',
            31: 'Convertible',
            32: 'Detachable'
        }

        modelos_hardware_aferidor = {
            1: 'desktop',
            2: 'desktop',
            3: 'desktop',
            4: 'desktop',
            5: 'desktop',
            6: 'desktop',
            7: 'desktop',
            8: 'notebook',
            9: 'notebook',
            10: 'notebook',
            11: 'notebook',
            12: 'desktop',
            13: 'desktop',
            14: 'notebook',
            15: 'desktop',
            16: 'notebook',
            17: 'desktop',
            18: 'desktop',
            19: 'desktop',
            20: 'desktop',
            21: 'desktop',
            22: 'desktop',
            23: 'desktop',
            24: 'desktop',
            30: 'notebook',
            31: 'notebook',
            32: 'notebook'
        }

        # Função para escrever uma linha no arquivo de saída
        def write_line(line, file):
            with open(file, "a") as file:
                file.write(line + "\n")

        # Função para extrair o valor após o '='
        def extract_value(data):
            return data.split('=')[1].strip()

        # Função para executar um comando e capturar a saída
        def run_command(command):
            result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
            return result.stdout.strip()

        # Função para executar um comando no powershell e capturar a saída
        def run_powershell_command(command):
            result = subprocess.run(['powershell', '-Command', command], stdout=subprocess.PIPE, text=True)
            return result.stdout

        # Lista os softwares obtidos
        def lista_softwares(softwares, completo = False):
            lista = []

            #Extrair as linhas da resposta
            linhas = softwares.split('\n')
            if not completo:
                lista.append("Software")
            else:
                lista.append("Sofware - COMPLETO")

            #Colocar cada linha na lista final
            for linha in linhas:
                if(linha != ""):    
                    lista.append(linha)
            return lista

        #Envia os dados pelo servidor websocket para todos os clientes conectados
        def enviar_dados(dados):

            #Com run_coroutine_threadsafe, garanto que essa ação vai ser executada no loop correto de eventos
            if loop:
                asyncio.run_coroutine_threadsafe(websocket_server.enviar_msg(dados), loop)
            else:
                print("Loop não foi passado como parâmetro")
            
        # ******************************************** ETAPA 1 ******************************************** #

        consulta_completa = run_command('wmic path Win32_operatingsystema get Caption, CSName, RegisteredUser, SerialNumber /format:value')
        so_full = f"{run_command('wmic os get Caption /format:value')} ({platform.architecture()[0]})"
        nome_maquina_full = run_command('wmic os get CSName /format:value')

        # Verifica se tem valor e extrai o valor, senão atribui uma mensagem padrão
        so = extract_value(so_full) if so_full else "Sistema Operacional não foi identificado"
        nome_maquina = extract_value(nome_maquina_full) if nome_maquina_full else "O nome da máquina não foi identificado"

        #Tipo de dispostivo
        #https://learn.microsoft.com/pt-br/windows/win32/cimwin32prov/win32-systemenclosure

        tipo = run_command('wmic path Win32_SystemEnclosure get chassisTypes /format:value')

        if tipo:

            num_tipo = int((extract_value(tipo)).strip('{}'))
            tipo_hw_wmic_full = modelos_hardware.get(num_tipo)
            tipo_hw_aferidor_full = modelos_hardware_aferidor.get(num_tipo)

            if tipo_hw_aferidor_full and tipo_hw_wmic_full:
                tipo_hw_wmic = f"{tipo_hw_wmic_full} ({num_tipo})"
                tipo_hw_aferidor = f"{tipo_hw_aferidor_full}"

            else:
                tipo_hw_wmic = tipo_hw_aferidor = "Tipo de dispositivo não foi localizado na tabela"
        else:
            tipo_hw_wmic = tipo_hw_aferidor = "Tipo de dispositivo não foi localizado pelo wmi"
        

        barra_progresso.setValue(10)
        
        # ******************************************** ETAPA 2 ******************************************** #

        # Informações sobre a placa-mãe
        manufacturer_info = run_command('wmic path Win32_BaseBoard get Manufacturer /format:value').strip()
        product_info = run_command('wmic path Win32_BaseBoard get Product /format:value').strip()
        motherboard_info =""

        if manufacturer_info and product_info:
            motherboard_info = f"{extract_value(manufacturer_info)} {extract_value(product_info)}"
        elif manufacturer_info:
            motherboard_info = f"{extract_value(manufacturer_info)}"
        elif product_info:
            motherboard_info = f"{extract_value(product_info)}"

        if not motherboard_info:
            motherboard_info = "Placa mãe não foi localizada!"

        barra_progresso.setValue(20)

        # ******************************************** ETAPA 3 ******************************************** #

        # Informações sobre a CPU
        cpu = f"{run_command('wmic path Win32_Processor get Name /format:value')}"
        cpu_arquitetura = platform.architecture()[0]

        if cpu:
            cpu_completa = f"{extract_value(cpu)} ({cpu_arquitetura})"
        else:
            cpu_completa = "CPU não foi localizada!"

        barra_progresso.setValue(30)


        # ******************************************** ETAPA 4 ******************************************** #
        # Informações sobre a memória RAM

        #Usando o Win32_ComputerSystem (Melhor metodo)
        ram = run_command('wmic path Win32_ComputerSystem get TotalPhysicalMemory /format:value')
        if ram:
            ram_gb = int(extract_value(ram))/(1024 ** 3)
            ram_gb_aprox = f"{ceil(ram_gb)} GB"
        else:
            ram_gb_aprox = "Memória RAM não encontrada!"

        barra_progresso.setValue(40)


        # ******************************************** ETAPA 5 ******************************************** #
        # Informações sobre dispositivos de armazenamento
        storage_info = run_command('wmic path Win32_DiskDrive where MediaType="Fixed hard disk media" get caption,size,status /format:value')
        lista_hds = []
        if storage_info:
            # Dividir a saída em linhas
            lines = storage_info.strip().split('\n')
            for line in lines:
                parts = line.split('=')
                if len(parts) == 2:
                    key, value = parts
                    if key == "Caption":
                        caption = value.strip()
                    elif key == "Size":
                        # Converter o tamanho para GB
                        size_bytes = int(value.strip())
                        size_gb = size_bytes / 1000000000  
                        #size_gb_real = size_bytes / (1024**3) # 1 GB = 1024^3 bytes
                    elif key == "Status":
                        status = value.strip()
                        hd_info = f"{caption} - {int(size_gb)} GB ({status})"
                        lista_hds.append(hd_info)

        #O metodo join concatena os elementos da lista em uma unica string, separadas pelo '/'

        hds = ' / '.join(lista_hds)

        if not lista_hds:
            hds = "A ferramenta não localizou nenhum dispostivo de armazenamento"

        barra_progresso.setValue(50)
            
        # ******************************************** ETAPA 6 ******************************************** #
        # Informações sobre adaptadores de vídeo
        video_info = run_command('wmic path win32_VideoController get name, Description, Caption, Status, VideoProcessor, AdapterRAM /format:value')
        video_lines = video_info.strip().split('\n')
        name = ""
        adapter_ram_mb = ""
        description = ""

        # Loop pelas linhas das informações
        for line in video_lines:
            parts = line.split('=', 1)
            if len(parts) == 2:
                key, value = parts
                if key == 'Name':
                    name = value.strip()
                elif key == 'AdapterRAM':
                    adapter_ram_bytes = int(value.strip())
                    adapter_ram_mb = adapter_ram_bytes / (1024 * 1024)  # Converter para MB
                
                
        # Verifica se todas as informações necessárias foram obtidas
        if name and adapter_ram_mb:
            gpu = f"{name} - ({adapter_ram_mb:.2f} MB)"
        else:
            gpu = "Informações incompletas ou não encontradas."

        barra_progresso.setValue(60)


        # ******************************************** ETAPA 7 ******************************************** #

        # Executa o comando WMIC para listar as unidades de CD/DVD
        wmic_command = 'wmic cdrom get Caption /format:value'
        cd_dvd_drives = run_command(wmic_command)

        # Verifica se há unidades de CD/DVD listadas (Se tiver ele coloca o nome no arquivo)
        if cd_dvd_drives:
            cd = extract_value(cd_dvd_drives)
        else:
            cd = "A maquina não tem uma unidade de CD/DVD instalado!"

        # Crie um dicionário com os dados que você deseja enviar
        hardware_dados = {
            'Hardware': 'Nome',
            'data_hora_cadastro': data_hr_atual,
            'sistema_operacional': so,
            'nome_maquina': nome_maquina,
            #'tipo_maquina_wmi': tipo_hw_wmic,
            'tipo_aferidor': tipo_hw_aferidor,
            'motherboard': motherboard_info,
            'processador': cpu_completa,
            'memoria_ram': ram_gb_aprox,
            'hd': hds,
            'placa_video': gpu,
            'drivers': cd
            #'gpu_completa': video_info
        }

        #Coloca os dados de hardware em um arquivo json
        hardware_dados_json = json.dumps(hardware_dados)
        barra_progresso.setValue(70)

        # ******************************************** ETAPA 8 ******************************************** #

        #Comando que percorre os 4 registros e filtra apenas os registros que possuem a variavel SystemComponente != 1, ou seja, vai exibir apenas os programas instalados pelo usuario
        #foreach ($UKey in 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*','HKLM:\SOFTWARE\Wow6432node\Microsoft\Windows\CurrentVersion\Uninstall\*','HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*','HKCU:\SOFTWARE\Wow6432node\Microsoft\Windows\CurrentVersion\Uninstall\*'){foreach ($Product in (Get-ItemProperty $UKey -ErrorAction SilentlyContinue)){if($Product.DisplayName -and $Product.SystemComponent -ne 1){$Product.DisplayName}}}
        resumido = run_powershell_command("foreach ($UKey in 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\*'){foreach ($Product in (Get-ItemProperty $UKey -ErrorAction SilentlyContinue)){if($Product.DisplayName -and $Product.SystemComponent -ne 1){$Product.DisplayName}}}")
        lista_resumido = lista_softwares(resumido)
        lista_resumido_json = json.dumps(lista_resumido)
        barra_progresso.setValue(80)

        # ******************************************** ETAPA 9 ******************************************** #

        completo = run_powershell_command("foreach ($UKey in 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\*'){foreach ($Product in (Get-ItemProperty $UKey -ErrorAction SilentlyContinue)){if($Product.DisplayName -ne 1){$Product.DisplayName}}}")
        lista_completa = lista_softwares(completo, True)
        lista_completa_json = json.dumps(lista_completa)
        barra_progresso.setValue(90)


        # ******************************************** ETAPA 10 ******************************************** #
        
        #Envio das informações
        write_line(f"------------------- HARDWARE_PC -------------------", result_log_path)

        enviar_dados(hardware_dados_json)

        for chave, valor in hardware_dados.items():
            write_line(f"\n{chave} - {valor}", result_log_path)
            
        write_line(f"\n\n------------------- SOFTWARE -------------------", result_log_path)
        
        for app in lista_resumido:
            write_line(app, result_log_path)

        for app in lista_completa:
            write_line(app, result_log_path)

        enviar_dados(lista_resumido_json)
        enviar_dados(lista_completa_json)
        enviar_dados("FIM")
        barra_progresso.setValue(100)

    except Exception as e:
        write_line(f"[{data_hr_atual}] - ERRO: {e}", error_log_path)
        enviar_dados(f"ERRO: {str(e)}")
        return(f"Ocorreu um erro inesperado! Reinicie o programa e tente novamente.")
        
    
    return(f"Análise concluída! Verifique o resultado no seu navegador.")

