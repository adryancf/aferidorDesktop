# aferidorDesktop
O AferidorDesktop é uma ferramenta desenvolvida para simplificar e otimizar o processo de inventário de máquinas e softwares em ambientes corporativos. Ao substituir o processo manual, que exigia visitas individuais a cada máquina, esta ferramenta permite a obtenção rápida e precisa de dados, com a premissa de que o próprio colaborador ou usuário da máquina possa realizar a coleta e enviá-la para o departamento responsável.

Para melhor entedimento, abaixo estão listadas as principais features da ferramenta:
  * **Interface WEB integrada**: Intuitiva e integrada ao software de obtenção de dados.
  * **Controle total da aplicação**: Através da interface principal, os usuários têm controle completo sobre todas as etapas do processo, desde a [abertura]() do aplicativo até a obtenção dos dados necessários.
  * **Visualização instantânea dos dados**: Os dados coletados são exibidos instantaneamente na página, oferecendo aos usuários uma visão imediata e atualizada do status do inventário.
  * **Formulário de envio completo**: Permite o envio de dados coletados junto com informações relevantes sobre o colaborador associado a máquina.
  * **Interface de administrador abrangente**: Reúne todos os dados recebidos, fornecendo uma visão detalhada de todo o processo. Além disso, oferece a capacidade de atualizar ou cadastrar informações sobre o hardware diretamente.
  * **Comparação com dados anteriores**:  Na interface de administrador, é possível realiza a comparação dos dados coletados com registros anteriores da mesma máquina, facilitando a identificação de alterações ou discrepâncias ao longo do tempo.
  
Com essas funcionalidades, o AferidorDesktop simplifica todo o processo de aferição de hardwares e softwares, aumentando tanto a periodicidade quanto a confiabilidade dos dados obtidos.

# Stacks e integrações
A ferramenta é composta por duas aplicações web: uma principal e outra para o usuário final. O front-end foi desenvolvido utilizando Bootstrap 5.3, enquanto o back-end é predominantemente em JavaScript. A integração com o banco de dados e o sistema já utilizado pela empresa foi realizada por meio de scripts PHP.

O aplicativo responsável pela obtenção dos dados foi criado em Python, utilizando WebSockets para integração com a página web. Para a interface gráfica, foi utilizado PySide2/QT. Além disso, o aplicativo utiliza o módulo subprocess para a execução de comandos do [WMIC](#hardware---wmic) via CMD e PowerShell, permitindo assim a obtenção dos dados de hardware e software de forma eficiente e precisa.

### Hardware - WMIC
O WMIC (Windows Management Instrumentation Command-line) é uma ferramenta de linha de comando no sistema operacional Windows que possibilita o acesso de várias características do sistema, incluindo hardware, software e configurações do sistema operacional. É por meio dessa ferramenta que o aferidor obtém os dados de hardware da máquina de forma automatizada.

Exemplo de obtenção de dados sobre a placa-mãe (Marca e Nome) pelo CMD:
```
C:\Users\*>wmic path Win32_BaseBoard get Manufacturer, Product /format:value
Manufacturer=ASRock
Product=H61M-VS
```

> Referências: [Sintaxe](https://learn.microsoft.com/pt-br/windows-server/administration/windows-commands/wmic) | [Classes do WMI](https://learn.microsoft.com/pt-br/windows/win32/cimwin32prov/computer-system-hardware-classes) | [Formas de obter os dados](https://learn.microsoft.com/pt-br/windows/win32/wmisdk/wmi-tasks--computer-hardware)

### Software - Acesso pelo registro
A obtenção dos softwares instalados é realizada acessando os registros específicos e filtrando-os com base na variável SystemComponent, resultando em um conjunto de dados semelhante ao que é visto no Programas e Recursos do Windows. Embora seja possível obter informações através do WMIC, isso se limita aos softwares instalados via MSI, sendo esta a maneira mais completa e precisa de obter esses dados.

```
PS C:\Users\*>foreach ($UKey in 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKCU:\\SOFTWARE\\Wow6432node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\*'){foreach ($Product in (Get-ItemProperty $UKey -ErrorAction SilentlyContinue)){if($Product.DisplayName -and $Product.SystemComponent -ne 1){$Product.DisplayName}}}
```
> Referências: [Explicação mais detalhada do comando](https://superuser.com/questions/1603763/how-can-i-run-a-single-command-to-show-all-installed-applications-in-windows-10)


# Arquivos Importantes
> Nesta seção, o objetivo é listar os arquivos mais significativos para facilitar a compreensão do código e auxiliar em futuras manutenções. 

## Código Fonte
### Main (`Modulo/GUI/main.py`)
O arquivo principal do programa desempenha várias funções essenciais. Ele importa a interface gráfica, cria a janela principal da aplicação e define funções para iniciar e encerrar o servidor WebSocket. Além disso, também controla a execução do aplicativo, coordenando o fluxo de funcionamento e interação com o usuário.

#### Interface Gráfica
Toda a estrutura e aparência da interface foram desenvolvidas utilizando o QT Designer, que gera um arquivo .ui (`Modulo/ui/Principal.ui`). Para integrar este arquivo ao projeto, é necessário convertê-lo para Python (`Modulo/GUI/tela_inicial.py`) usando o comando abaixo. Certifique-se de que o PySide2 esteja instalado e que o arquivo Principal.ui esteja na raiz do projeto:

```
pyside2-uic Principal.ui -o tela_inicial.py
```

Sendo assim, para alterar algo na interface gráfica é necessário:
 - Abrir o Principal.ui no QT Designer
 - Salvar ou exportar para um novo arquivo as modificações
 - Converter este .ui para um arquivo .py
 - Verificar o nome da classe que está no arquivo convertido e que contêm todos os dados da GUI
 - Incluir este arquivo no main.py: `from nova_tela_convertida import classe_do_arquivo_convertido`
 - Incluir todos os elementos que a sua interface utilizará (`from PySide2.QtWidgets import QApplication, QWidget, QMessageBox, QProgressDialog`)


#### Thread (WebSocket)
É essencial iniciar o servidor WebSocket em uma thread separada para garantir sua execução simultânea com a interface gráfica e outras funcionalidades do aplicativo. Isso se deve ao fato de que o servidor precisa estar constantemente aguardando e respondendo a conexões de clientes, enquanto a GUI precisa ser responsiva e interativa para o usuário.

Para alcançar esse objetivo, é utilizado a biblioteca [asyncio](https://docs.python.org/pt-br/3/library/asyncio.html) para lidar com operações assíncronas, como as operações de rede. Essa biblioteca, quando executada em uma thread separada, requer um loop de eventos responsável por gerenciar a execução de tarefas. Deste modo, a função `iniciar_servidor` é passada como parâmetro durante a criação da thread.

```
def iniciar_servidor(self):
  # Inicializar o loop de eventos
  self.loop_websocket = asyncio.new_event_loop()
  asyncio.set_event_loop(self.loop_websocket)

  try:
    self.loop_websocket.run_until_complete(self.servidor.iniciar_servidor())
  finally:
    self.loop_websocket.close()
```

```
self.servidor = ServidorWebSocket("localhost", 8181, self)
self.thread_servidor = threading.Thread(target=self.iniciar_servidor)
self.thread_servidor.start()
```
#### Singleton
Para garantir que apenas uma instância do programa vai ser executada, é adotado o padrão de projeto Singleton empregando a biblioteca [tendo](https://pythonhosted.org/tendo/), facilitando e simplificando a implementação dessa funcionalidade.

```
# Garantir que apenas uma instância do programa seja executada
 try:
   me = singleton.SingleInstance()
 except singleton.SingleInstanceException:
   print(f"Não pode ser aberto duas instâncias do aferidorDesktop.")
   exibir_mensagem_erro()
   sys.exit(1)
```

### Servidor WebSocket (`Modulo/GUI/servidorWebSocket.py`)
Este arquivo contém a definição do servidor WebSocket e suas principais funções. Ele é responsável por gerenciar todas as mensagens recebidas e, com base no conteúdo da mensagem, tomar uma ação correspondente. 

O servidor WebSocket desempenha um papel crítico no controle da abertura, início do escaneamento e encerramento do aplicativo. Isso ocorre porque todo o controle é conduzido pelo website conectado a ele, por meio de mensagens recebidas, como "scan_system", que inicia o escaneamento, e "close_app", que é enviada quando o usuário recarrega a página estando conectado ao servidor. Esse design tem como objetivo evitar a alternância entre plataformas, simplificando todo o processo de interação e garantindo uma experiência contínua para o usuário.

### Módulo para obtenção dos dados (`Modulo/GUI/modulo_ScanSystem.py`)
Aqui é definido a função que extrai os dados importantes de hardware e software da máquina que está executando a aplicação. Ele faz isso através da execução de comandos no CMD e Powershell utilizando o [WMIC](#hardware---wmic), processo este explicado e exemplificado detalhadamente no tópico [Stacks e integrações](#stacks-e-integrações).

A função recebe como parâmetro a referência da barra de progresso exibida pela interface e a atualiza conforme o progresso do processo. Após a conclusão, os dados são organizados em formato JSON e enviados separadamente para o website. Além disso, os dados são salvos em um arquivo de log, localizado em C:\Users\*\Documents\AferidorDesktop.

No caso de ocorrer algum erro durante o processo, os detalhes do erro são registrados em um arquivo de log separado (`C:\Users\*\Documents\AferidorDesktop\ERROR_AferidorDesktop.txt`). Esta abordagem visa fornecer uma maneira eficaz de acompanhar o progresso, organizar e compartilhar os dados coletados, além de registrar quaisquer problemas que possam surgir para fins de diagnóstico e resolução.

## Instalador e EXE
O aferidorDesktop é compilado em um arquivo executável (EXE) e inclui um instalador para simplificar sua distribuição. Além disso, o instalador facilita a configuração dos Protocolos Personalizados ou [Esquemas de URI](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85)), permitindo que a aplicação web solicite a [abertura do programa](https://stackoverflow.com/questions/32445017/start-an-application-from-a-url-and-get-data/32445139#32445139) de forma automática. 

### Protocolos Personalizados
Os Protocolos Personalizados possibilitam a abertura de aplicativos ou arquivos por meio de URLs, permitindo invocar o programa através de uma página web. Eles são criados por meio do registro do Windows, permitindo a associação de uma URL específica a um aplicativo instalado no sistema:

```
HKEY_CLASSES_ROOT/
   aferidorDesktop/
       (Default)              = "URL:aferidorDesktop"
       URL Protocol           = ""
       DefaultIcon
           (Default)          = "aferidorDesktop.exe,1"
       shell
           open
               command
                    (Default) = "C:\Program Files (x86)\AferidorDesktop\aferidorDesktop.exe" "%1"

```

Com base nisso, ao digitar **`aferidordesktop://open`** no navegador, o sistema é aberto. Como a inserção desse registro no Windows é necessária, é preciso ter um instalador para realizar esse processo. Esse instalador é responsável por configurar o registro do sistema operacional de forma adequada, associando o protocolo personalizado `aferidordesktop://` com o aplicativo correspondente, garantindo que ele seja acionado corretamente quando a URL específica é acessada pelo usuário.

###EXE
O programa é compilado em um arquivo executável (EXE) através do (auto-py-to-exe)[https://pypi.org/project/auto-py-to-exe/] seguindo esta configuração: 
 - **Script Location**: `Modulo/GUI/main.py`
 - **Onefile**: `One Directory` (Cria o EXE + um diretório com todos os arquivos)
 - **Console Window**: `Window Based (hide the console)`
 - **Icon**: `Modulo/GUI/favicon.ico`
 - **Additional Files**: `Modulo/GUI/modulo_ScanSystem.py`, `Modulo/GUI/servidorWebSocket.py`, `Modulo/GUI/tela_inicial.py`
 - **Advanced** -> **Windows specific options** -> **--version-file**: `Modulo/GUI/file_version.txt` (Arquivo com os dados de versão)
 - **Advanced** -> **Windows specific options** -> **--uac-admin**: `Enable` (Incializar como administrador)
 - **Settings** -> **Output Directory**: `Modulo/GUI/output`

O `Modulo/GUI/file_version.txt` é gerado pelo `Modulo/GUI/version.yml` utilizando a biblioteca 

- `Modulo/GUI/file_version.txt`: Arquivo que indica a versão do software, após ser comprimido em um EXE.
- `Modulo/INSTALL/InnoSetup_instalador.iss`: Arquivo que indica a versão do software, após ser comprimido em um EXE.


## Aplicação WEB



