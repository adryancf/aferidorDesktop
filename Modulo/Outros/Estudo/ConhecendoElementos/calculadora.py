import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk  # Certifique-se de ter instalado o módulo Pillow (PIL)

def retrieve_system_info():
    # Substitua esta função pela sua lógica de recuperação de informações do sistema
    # Atualmente, ela apenas imprime uma mensagem para simular a execução da função.
    print("Recuperando informações do sistema...")

# Criação da janela principal
root = tk.Tk()
#oot.title("Informações do Sistema")

# Adicionando um ícone à janela (substitua 'path_para_seu_icone.ico' pelo caminho do seu ícone)
#root.iconbitmap('path_para_seu_icone.ico')

# Adicionando a logo
#logo_image = Image.open("path_para_sua_logo.png")  # Substitua 'path_para_sua_logo.png' pelo caminho da sua logo
#logo_image = logo_image.resize((200, 200), Image.ANTIALIAS)
#logo_photo = ImageTk.PhotoImage(logo_image)

#logo_label = ttk.Label(root, image=logo_photo)
#logo_label.grid(row=0, column=0, columnspan=2, pady=10)

# Estilo para bordas arredondadas
style = ttk.Style()
style.configure("TButton", padding=10, relief="flat", borderwidth=0, font=('Helvetica', 12))

# Função vinculada ao botão
def on_button_click():
    retrieve_system_info()

# Botão para chamar a função
button = ttk.Button(root, text="Obter Informações do Sistema", command=on_button_click, style="TButton")
button.grid(row=1, column=0, columnspan=2, pady=10)

# Configuração de pesos para o layout responsivo
root.grid_rowconfigure(0, weight=1)
root.grid_rowconfigure(1, weight=1)
root.grid_columnconfigure(0, weight=1)
root.grid_columnconfigure(1, weight=1)

# Execução do loop principal
root.mainloop()
