# aferidorDesktop
O AferidorDesktop é uma ferramenta desenvolvida para simplificar e otimizar o processo de inventário de máquinas e softwares em ambientes corporativos. Ao substituir o processo manual, que exigia visitas individuais a cada máquina, esta ferramenta permite a obtenção rápida e precisa de dados, com a premissa de que o próprio colaborador ou usuário da máquina possa realizar a coleta e enviá-la para o departamento responsável.

Para melhor entedimento, abaixo estão listadas as principais features da ferramenta:
  * Interface WEB integrada: Intuitiva e integrada ao software de obtenção de dados.
  * Controle total da aplicação: Através da interface principal, os usuários têm controle completo sobre todas as etapas do processo, desde a abertura do aplicativo até a obtenção dos dados necessários.
  * Visualização instantânea dos dados: Os dados coletados são exibidos instantaneamente na página, oferecendo aos usuários uma visão imediata e atualizada do status do inventário.
  * Formulário de envio completo: Permite o envio de dados coletados junto com informações relevantes sobre o colaborador associado a máquina.
  * Interface de administrador abrangente: Reúne todos os dados recebidos, fornecendo uma visão detalhada de todo o processo. Além disso, oferece a capacidade de atualizar ou cadastrar informações sobre o hardware diretamente.
  * Comparação com dados anteriores:  Na interface de administrador, é possível realiza a comparação dos dados coletados com registros anteriores da mesma máquina, facilitando a identificação de alterações ou discrepâncias ao longo do tempo.
  
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
