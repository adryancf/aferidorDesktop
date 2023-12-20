import os
import platform
import subprocess
import math
import requests             
from datetime import datetime

def extract_value(data):
        return data.split('=')[1].strip()

def run_command(command):
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        return result.stdout.strip()
        
# Executa o comando WMIC para listar as unidades de CD/DVD
cd_dvd_drives = extract_value(run_command('wmic cdrom get Caption /format:value'))



# Verifica se há unidades de CD/DVD listadas (Se tiver ele coloca o nome no arquivo)
if cd_dvd_drives:

    print(f"\n(CD/DVD) - {(cd_dvd_drives)}")
else:
    print("\nA maquina não tem uma unidade de CD/DVD instalado!")