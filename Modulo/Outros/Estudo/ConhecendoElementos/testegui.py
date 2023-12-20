from PySide2.QtWidgets import QApplication, QWidget, QMainWindow, QPushButton, QLabel, QCheckBox, QComboBox, QLineEdit, QSpinBox, QSlider, QVBoxLayout
from PySide2.QtCore import Qt, QSize
from PySide2.QtGui import QPixmap
from layout_color import color

class novaJanela(QWidget):
    def __init__(self):
        super().__init__()

        layout = QVBoxLayout()
        self.label = QLabel("Outra Janela")
        layout.addWidget(self.label)
        self.setLayout(layout)


class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()

        #Inserindo o nome da janela
        self.setWindowTitle("Aplicativo")
        
        self.botao = QPushButton("Nova Janela")
        self.botao.clicked.connect(self.showNewWindows)
        self.setCentralWidget(self.botao)

    def showNewWindows(self, c):
        self.janela = novaJanela()
        self.janela.show()
        
        '''
        layout = QVBoxLayout()
        layout.addWidget(color("red"))
        layout.addWidget(color("green"))
        layout.addWidget(color("blue"))
        layout.addWidget(color("black"))

        widget = QWidget()
        widget.setLayout(layout)

        self.setCentralWidget(widget)

        #Setando um tamanho para a janela
        #self.setFixedSize(QSize(600, 600))

        
        #----- Botao -----#

        #Criando um botao
        self.botao = QPushButton("Clique Aqui!")
        #Centralizando e inserindo o Botão
        self.setCentralWidget(self.botao)
        #Definindo o tamanho do botão
        self.botao.setFixedSize(QSize(100, 150))
        #Configurando o que acontece com o clique do botao
        self.botao.clicked.connect(self.click_botao)

        #----- Label -----#

        #Criando Label
        widget = QLabel("Testando Label")
        #Configurando sua fonte
        font = widget.font()
        font.setPointSize(20)
        #Incorporando na label
        widget.setFont(font)
        #Alinhando e inserindo a label
        widget.setAlignment(Qt.AlignHCenter | Qt.AlignVCenter)
        self.setCentralWidget(widget)
        
        #----- Imagem -----#

        imagem = QLabel("Imagem")
        imagem.setPixmap(QPixmap("C:\\Users\\0394\\Downloads\\SEMFOTO.jpg"))
        #Permite com que a imagem ocupe toda a label, entao será redimensionada conforme a janela!
        imagem.setScaledContents(True)
        self.setCentralWidget(imagem)

        #----- CheckBox -----#

        ck = QCheckBox("Marque se verdadeiro")
        #Seta o checkbox como verdadeiro
        ck.setCheckState(Qt.Checked)
        #Conecta a função quando ele muda de estado
        ck.stateChanged.connect(self.show_state)
        #Define 3 estados do CheckBox
        ck.setCheckState(Qt.PartiallyChecked)
        self.setCentralWidget(ck)
        
        #----- ComboBox -----#

        self.combo = QComboBox()
        self.combo.addItems(['Item 1', 'Item 2', 'Item 3'])
        self.combo.currentIndexChanged.connect(self.index_change)
        self.combo.currentTextChanged.connect(self.textChange)

        self.setCentralWidget(self.combo)
        

        self.line = QLineEdit()
        self.line.setMaxLength(10)
        self.line.setPlaceholderText("CPF")
        self.line.setInputMask("000.000.000-00")
        self.line.returnPressed.connect(self.return_pressed)

        self.setCentralWidget(self.line)
        
        self.spin = QSpinBox()
        self.spin.setMinimum(-5)
        self.spin.setMaximum(5)
        self.spin.setPrefix("R$")
        self.spin.setSuffix(",00")
        self.spin.valueChanged[str].connect(self.value_changed_str)

        self.setCentralWidget(self.spin)
        
        slider = QSlider()
        slider.setMinimum(0)
        slider.setMaximum(10)
        slider.setSingleStep(3)

        slider.valueChanged.connect(self.value_changed)
        slider.sliderMoved.connect(self.sliderPosition)
        slider.sliderPressed.connect(self.sliderPressed)
        slider.sliderReleased.connect(self.sliderReleased)

        self.setCentralWidget(slider)

        '''




    '''
    def click_botao(self):
        print("Botao Clicado!")
        #self.botao.setEnabled(False)
        #self.setWindowTitle("Botao foi Clicado!!!")

    def show_state(self, s):
        print(s==Qt.Checked)
        print(s)
    
    def index_change(self, i):
        print(i)

    def textChange(self, s):
        print(s)

    def return_pressed(self):
        if(self.line.text()):
            self.setWindowTitle(f"Ola {self.line.text()}")    
            print("TEM TEXTO")

        #self.centralWidget().setText(f"Ola {self.line.text()}")
    
    def value_changed(self, i):
        print(i)

    def value_changed_str(self, s):
        print (s)
    

    def value_changed(self, i):
        print (i)

    def sliderPosition(self, p):
        print('Position', p)

    def sliderPressed(self):
        print("Segurando!")
    def sliderReleased(self):
        print("Soltei!")
    '''
import sys

app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec_()
