import os
import platform
import subprocess
import psutil
import math
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
def run_command(command):
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
    return result.stdout.strip()

# Função para extrair o valor após o '='
def extract_value(data):
    return data.split('=')[1].strip()

# Informações básicas do sistema
write_line(f"Sistema Operacional: {platform.system()} {platform.release()}")
write_line(f"Nome do Computador: {platform.node()}")
write_line(f"Data e Hora da Coleta: {datetime.now()}")

#------------ ENVIAR ----------------#

sistema = run_command('wmic path Win32_operatingsystem get Caption, CSName, RegisteredUser, SerialNumber /format:value')
write_line(f"\n\nDados Sistema Operacional")
write_line(f"{sistema}")


#------------ ENVIAR ----------------#
#Tipo de dispostivo
#https://learn.microsoft.com/pt-br/windows/win32/cimwin32prov/win32-systemenclosure
tipo = extract_value(run_command('wmic path Win32_SystemEnclosure get chassisTypes /format:value'))
num_tipo = int(tipo.strip('{}'))
tipo_hw_original = modelos_hardware.get(num_tipo)
tipo_hw = modelos_hardware_aferidor.get(num_tipo)

write_line(f"\nTipo de dispostivo conforme tabela = {tipo_hw_original} ({num_tipo})")
write_line(f"Tipo de dispostivo Aferidor = {tipo_hw}")

#------------ ENVIAR ----------------#

# Informações sobre a placa-mãe
manufacturer_info = run_command('wmic path Win32_BaseBoard get Manufacturer /format:value').strip()
product_info = run_command('wmic path Win32_BaseBoard get Product /format:value').strip()
manufacturer = extract_value(manufacturer_info)
product = extract_value(product_info)

motherboard_info = f"{manufacturer} {product}"
write_line(f"\nPlaca-Mãe: {motherboard_info}")

#------------ ENVIAR ----------------#

# Informações sobre a CPU
#Comando completo = wmic path Win32_Processor get DeviceID, Name, NumberOfCores, NumberOfLogicalProcessors, SocketDesignation /format:value
#write_line(f"Nome: {platform.processor()}")
processador = extract_value(run_command('wmic path Win32_Processor get Name /format:value'))
write_line(f"\nProcessador: {processador} ")
write_line(f"Arquitetura: {platform.architecture()[0]}")

# Informações sobre a memória RAM

#Usando Win32_PhysicalMemory
"""
write_line("\nWin32_PhysicalMemory - Memória RAM:")
ram_info = run_command('wmic path Win32_PhysicalMemory get capacity,devicelocator,speed /format:value')

ram_lines = ram_info.split('\n')
total = 0
for line in ram_lines:
    if line.startswith("Capacity="):
        capacity = line.split('=')[1].strip()  # Capacidade em bytes como uma string
        capacity = int(capacity) // (1024 ** 2)  # Converter bytes para megabytes
        total += capacity
    else:
        write_line(f"{line}")

write_line(f"Capacidade total = {total} MB")

#Usando PSUTIL
ram_total = psutil.virtual_memory().total / (1024 ** 3)
write_line(f"\nMemória RAM total(PSUTIL) arredondada: {math.ceil(ram_total)}GB / Valor real = {ram_total}GB")

"""
#------------ ENVIAR ----------------#

#Usando o Win32_ComputerSystem (Melhor metodo)
write_line(f"\nWin32_ComputerSystem - Memória RAM:")
ram_gb = int(extract_value(run_command('wmic path Win32_ComputerSystem get TotalPhysicalMemory /format:value')))/(1024 ** 3)
write_line(f"Memória RAM instalada = {math.ceil(ram_gb)} GB")

#------------ ENVIAR ----------------#

# Informações sobre dispositivos de armazenamento
write_line("\nDispositivos de Armazenamento:\n")
storage_info = run_command('wmic path Win32_DiskDrive where MediaType="Fixed hard disk media" get caption,model,size,status /format:value')

# Listando
if storage_info:
    # Dividir a saída em linhas
    lines = storage_info.strip().split('\n')

    # Processar cada linha
    for line in lines:
        parts = line.split('=')
        if len(parts) == 2:
            key, value = parts
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
                
                # Escrever os dados no arquivo de texto
                #write_line(f"Nome = {caption}\nTamanho Real = {size_gb_real} \nTamanho = {size_gb:.0f} GB \nStatus = {status}")
                write_line(f"Resumo = {caption} - {int(size_gb)} GB")

    #------------ ENVIAR ----------------#

    # Informações sobre adaptadores de vídeo
    write_line("\nAdaptadores de Vídeo:")
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
            elif key == 'Description':
                description = value.strip()

    # Verifica se todas as informações necessárias foram obtidas
    if name and adapter_ram_mb and description:
        formatted_info = f"{name} - ({adapter_ram_mb:.2f} MB)"
        write_line(formatted_info)
    else:
        write_line("Informações incompletas ou não encontradas.")
        write_line(f"{video_info}")


    #DRIVERS (CD/DVD)
    

    # Esperar por uma entrada do usuário antes de encerrar
    input("Pressione Enter para encerrar...")

