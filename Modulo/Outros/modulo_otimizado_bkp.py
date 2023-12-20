import os
import platform
import subprocess
import psutil
import math
import requests             
from datetime import datetime

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
    1: 'Desktop',
    2: 'Desktop',
    3: 'Desktop',
    4: 'Desktop',
    5: 'Desktop',
    6: 'Desktop',
    7: 'Desktop',
    8: 'Notebook',
    9: 'Notebook',
    10: 'Notebook',
    11: 'Notebook',
    12: 'Desktop',
    13: 'Desktop',
    14: 'Notebook',
    15: 'Desktop',
    16: 'Notebook',
    17: 'Desktop',
    18: 'Desktop',
    19: 'Desktop',
    20: 'Desktop',
    21: 'Desktop',
    22: 'Desktop',
    23: 'Desktop',
    24: 'Desktop',
    30: 'Notebook',
    31: 'Notebook',
    32: 'Notebook'
}

# Nome do arquivo de saída
output_file = "informacoes_sistema.txt"

# Função para escrever uma linha no arquivo de saída
def write_line(line):
    with open(output_file, "a") as file:
        file.write(line + "\n")

# Limpar o arquivo de saída (caso já exista)
if os.path.exists(output_file):
    os.remove(output_file)

# Função para executar um comando e capturar a saída
"""def run_command(command):
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
    print(result.stdout.strip())
    return result.stdout.strip()"""


# Função para extrair o valor após o '='
def extract_value(data):
    return data.split('=')[1].strip()


class ComandoWMICError(Exception):
    pass

def run_command(command):
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)

    # Verifica se o comando falhou (código de retorno diferente de zero)
    if result.returncode != 0:
        raise ComandoWMICError(f"Erro ao executar o comando: {result.stderr}")

    # Divide a saída em linhas
    linhas = result.stdout.strip().split('\n')

    # Se houver apenas uma linha, retorne um dicionário vazio
    if len(linhas) == 1:
        return (extract_value(linhas[0]))

    # Cria um dicionário para armazenar os resultados
    resultado_objeto = {}

    for linha in linhas:
        # Divide cada linha em partes usando o sinal de igual (=) como separador
        partes = linha.split('=')
        if len(partes) == 2:
            chave, valor = partes
            chave = chave.strip()
            valor = valor.strip()
            if valor:
                resultado_objeto[chave] = valor

    if not resultado_objeto:
        raise ComandoWMICError("Nenhum valor encontrado após o sinal de igual (=) nas linhas do comando")

    print (resultado_objeto)
    return resultado_objeto

# Informações básicas do sistema
write_line(f"Data e Hora da Coleta: {datetime.now()}")

#------------ ENVIAR ----------------#

#consulta_completa = run_command('wmic path Win32_operatingsystema get Caption, CSName, RegisteredUser, SerialNumber /format:value')
so = run_command('wmic os get Caption /format:value')
nome_maquina = run_command('wmic os get CSName /format:value')

write_line(f"\n\nDados Sistema Operacional")

#Verifica se tem valor
if so:
    write_line(f"Sistema Operacional = {so}")
    if nome_maquina:
        write_line(f"Nome do Sistema = {nome_maquina}")
    else:
        write_line("Nome do Sistema = O nome da maquina nao foi encontrado")
else:
    write_line("Sistema Operacional não localizado")


#------------ ENVIAR ----------------#
#Tipo de dispostivo
#https://learn.microsoft.com/pt-br/windows/win32/cimwin32prov/win32-systemenclosure

tipo = run_command('wmic path Win32_SystemEnclosure get chassisTypes /format:value')
num_tipo = int(tipo.strip('{}'))
tipo_hw_original = modelos_hardware.get(num_tipo)
tipo_hw = modelos_hardware_aferidor.get(num_tipo)

if tipo_hw and tipo_hw_original:
    write_line(f"\nDispostivo Tabela = {tipo_hw_original} ({num_tipo})")
    write_line(f"Dispostivo Aferidor = {tipo_hw}")

else:
    write_line("\nTipo de dispositivo não foi localizado;/")

#------------ ENVIAR ----------------#

# Informações sobre a placa-mãe
manufacturer = run_command('wmic path Win32_BaseBoard get Manufacturer /format:value').strip()
product = run_command('wmic path Win32_BaseBoard get Product /format:value').strip()

motherboard = f"{manufacturer} {product}"

write_line("\nPlaca-Mãe: ")
if motherboard:
    write_line(f"{motherboard}")
else:
    write_line("Placa mãe não foi localizada!")

#------------ ENVIAR ----------------#

# Informações sobre a CPU
cpu = f"{run_command('wmic path Win32_Processor get Name /format:value')}"
cpu_arquitetura = platform.architecture()[0]
if cpu:
    write_line(f"\nProcessador: {cpu} ({cpu_arquitetura})")
else:
    write_line("CPU não foi localizada!")

#------------ ENVIAR ----------------#
# Informações sobre a memória RAM

#Usando o Win32_ComputerSystem (Melhor metodo)
ram_gb = int(run_command('wmic path Win32_ComputerSystem get TotalPhysicalMemory /format:value'))/(1024 ** 3)
ram_gb_aprox = math.ceil(ram_gb)

write_line(f"\nWin32_ComputerSystem - Memória RAM:")
write_line(f"Memória RAM instalada = {ram_gb_aprox} GB")

#------------ ENVIAR ----------------#

# Informações sobre dispositivos de armazenamento
write_line("\nDispositivos de Armazenamento:\n")
storage_info = run_command('wmic path Win32_DiskDrive where MediaType="Fixed hard disk media" get caption,model,size,status /format:value')

#lista
hds_info = []

for key, value in storage_info:
    if key == "Caption":
        caption = value.strip()

    elif key == "Model":
        model = value.strip()

    elif key == "Size":
        # Converter o tamanho para GB
        size_bytes = int(value.strip())
        size_gb = size_bytes / 1000000000  
        size_gb_real = size_bytes / (1024**3) # 1 GB = 1024^3 bytes

    elif key == "Status":
        status = value.strip()
        hd_info = f"{caption} - {int(size_gb)} GB ({status})"
        # Escrever os dados no arquivo de texto
        write_line(hd_info)
        hds_info.append(hd_info)

hds = ' / '.join(hds_info)

if hds_info:
    write_line(f"\n{hds}")
else:
    write_line(f"\nA ferramenta não localizou nenhum dispostivo de armazenamento")
    
#------------ ENVIAR ----------------#

# Informações sobre adaptadores de vídeo
write_line("\nAdaptadores de Vídeo:")
video_info = run_command('wmic path win32_VideoController get name, Description, Caption, Status, VideoProcessor, AdapterRAM /format:value')

name = ""
adapter_ram_mb = ""
description = ""

# Loop pelas linhas das informações

for key, value in video_info:
        if key == 'Name':
            name = value.strip()

        elif key == 'AdapterRAM':
            adapter_ram_bytes = int(value.strip())
            adapter_ram_mb = adapter_ram_bytes / (1024 * 1024)  # Converter para MB
        
        
# Verifica se todas as informações necessárias foram obtidas
if name and adapter_ram_mb:
    formatted_info = f"{name} - ({adapter_ram_mb:.2f} MB)"
    write_line(formatted_info)
else:
    write_line("Informações incompletas ou não encontradas.")
    write_line(f"{video_info}")


# DRIVERS (CD/DVD)

# Executa o comando WMIC para listar as unidades de CD/DVD
wmic_command = 'wmic cdrom get Caption /format:value'
cd_dvd_drives = run_command(wmic_command)

# Verifica se há unidades de CD/DVD listadas (Se tiver ele coloca o nome no arquivo)
if cd_dvd_drives:
    write_line(f"\n(CD/DVD) - {cd_dvd_drives}")
else:
    write_line("\nA maquina não tem uma unidade de CD/DVD instalado!")

# Esperar por uma entrada do usuário antes de encerrar
input("Pressione Enter para encerrar...")


# Crie um dicionário com os dados que você deseja enviar
envio = {
    'data_hora_coleta': str(datetime.now()),
    'sistema_operacional': so,
    'nome_maquina'
    'nome_maquina': extract_value(nome_maquina),
    # Adicione outros dados aqui
    'hds': hds
}
