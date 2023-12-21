<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aferidor Desktop</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            
        }

        .container {
            
            text-align: center;
            padding: 20px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: navy;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: navy;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Aferidor Desktop</h1>

    
    <button id="abrirApp" type="button">Scanner</button>
    

</div>


<script>
    document.getElementById('abrirApp').addEventListener('click', function() {
        // Tenta abrir o aplicativo usando o protocolo personalizado
        window.location.href = 'aferidordesktop://open';

        // Define um temporizador para verificar se a tentativa de abrir foi bem-sucedida
        setTimeout(function() {
            // Se a janela ainda estiver na página, significa que o protocolo não está registrado
            if (document.hasFocus()) {
                // Fornecer link de download
                //window.location.href = '/caminho-para-o-download-do-aplicativo';
                console.log("Nao tem")
            }
        }, 1000); // Ajuste o tempo conforme necessário
    });
    
</script>

</body>
</html>
