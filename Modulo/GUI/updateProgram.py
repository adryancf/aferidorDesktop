import os
import win32api

def obter_versao_arquivo(nome_arquivo):
    try:
        info = win32api.GetFileVersionInfo(nome_arquivo, '\\')
        versao = info['FileVersionMS']
        print(versao)
        versao_str = '{}.{}.{}.{}'.format(
            win32api.HIWORD(versao[0]),
            win32api.LOWORD(versao[0]),
            win32api.HIWORD(versao[1]),
            win32api.LOWORD(versao[1])
        )
        return versao_str
    except Exception as e:
        print(f"Erro ao obter a versão do arquivo: {e}")
        return None

# Caminho para o arquivo .exe
caminho_arquivo = 'C:/Users/0394/Desktop/Sistema_Auditoria/aferidorDesktop/Modulo/GUI/output/aferidorDesktop.exe'

if os.path.exists(caminho_arquivo):
    versao = obter_versao_arquivo(caminho_arquivo)
    if versao:
        print(f"A versão do arquivo {caminho_arquivo} é: {versao}")
else:
    print("O arquivo especificado não existe.")
