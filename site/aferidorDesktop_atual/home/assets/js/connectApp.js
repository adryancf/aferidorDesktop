let socket;
let temporizador = 0;
let intervalId;

const tempo_max_conexao = 30000; 
const intervalo_conexao = 3000;
const time_noticacao = 600;

let loading = false;

function showConnected() {
  $('#connected').show();
  $('#connecting').hide();
  $('#offline').hide();
}

function showConnecting() {
  $('#connected').hide();
  $('#connecting').show();
  $('#offline').hide();
}

function showOffline() {
  $('#connected').hide();
  $('#connecting').hide();
  $('#offline').show();
}

$(document).ready(function(){
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "5000",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "tapToDismiss": false
  }

  showOffline();



});

//ABERTURA DO MODULO NO COMPUTADOR DO CLIETNE
document.getElementById('abrirApp').addEventListener('click', function() {
    
    window.location.href = 'aferidordesktop://open';

    // Define um temporizador para verificar se a tentativa de abrir foi bem-sucedida
    setTimeout(function() {
      // Se a janela ainda estiver na página, significa que o protocolo não está registrado
      if (document.hasFocus()) {

        //Poupup de alerta (SweetAlert2) com botao de download do aplicativo
        Swal.fire({
          title: 'Aplicativo não encontrado!',
          text: 'Clique no botão abaixo e baixe o nosso app.',
          icon: 'warning',
          confirmButtonText: '<i class="bi bi-download me-1"></i> Baixar',
          confirmButtonColor: "#008000",
        }).then((result) => {
          if (result.isConfirmed) {

            //Executar o download
            var url = "../download/Instalador_AferidorDesktop.exe";
            var link = $("<a>").attr('href', url).appendTo('body');
            link[0].click();

            link.remove();

            Swal.fire({
              title: "Seu aplicativo já está sendo baixado!",
              text:"Após finalizar o download, abra o instalador e faça a instalação. Em caso de dúvidas, clique no botão abaixo.",
              showDenyButton: true,
              confirmButtonText: "Saiba mais",
              denyButtonText: `<i class="bi bi-arrow-clockwise"></i>`,
              denyButtonColor: "gray",
              confirmButtonColor: "navy",
              icon: "success",
              footer: 'Caso o instalador não abra, <a href="../download/downloadBckp/Instalador_AferidorDesktop.exe">Clique aqui</a>',
              customClass: {
                popup: 'custom-swal-width',
              },
            }).then((result)=> {
              if(result.isConfirmed){
                //Abrir modal de ajuda
                $("#modalAjuda").modal("show");
              }
              else{
                //Recarregar a página
                location.reload();
              }
            });
            
          }
        });

      }
      else
      {   
          loading = true;

          // O site tenta se conectar com o aplicativo por 30s
          intervalId = setInterval(function() {
              showConnecting();

              //Altero o timeout da notificação para nao ficar exibindo em loop
              if (temporizador >= tempo_max_conexao) {
                  console.log("Limite de tempo atingido. Não foi possível conectar.");
                  
                  loading = false;
                  clearInterval(intervalId);
                  temporizador = 0;

                  Swal.fire({
                      title: 'Não foi possível conectar!',
                      text: 'Verifique se o aplicativo está instalado e aberto. Caso sim, reinicie o aplicativo e tente novamente.',
                      icon: 'error',
                      confirmButtonText: 'Tentar novamente',
                  }).then((result) => {
                      if (result.isConfirmed) {
                          iniciarConexaoWebSocket();
                      }
                      else
                      {
                          showOffline();
                      }

                  });
              } else {
                  iniciarConexaoWebSocket();
                  temporizador += intervalo_conexao;
                  console.log(temporizador, " segundos");
              }
          }, intervalo_conexao);

          console.log("terminei");
      }
    }, 100);

    //Talvez exibir um modal padrão de ajuda para todos os usuários


    //Alterar os botões de acordo com o status da conexão
    $("#abrirApp").hide();
    $("#iniciarScanApp").show();
    $("#conectarApp").show();

});

$("#iniciarScanApp").click(function() {
  enviarMensagem("scan_system");
});

function iniciarConexaoWebSocket() {

    const servidorWebSocketURL = 'ws://localhost:8181';
    socket = new WebSocket(servidorWebSocketURL);

    socket.onopen = function(event) {
        console.log('Conexão WebSocket aberta:', event);
        socket.send("Cliente conectado!");
        loading = false;
        showConnected();

        toastr.clear();
        setTimeout(function() {

            // Exiba o pop-up personalizado
            toastr.success('Vá para o aplicativo e inicie o processo', 'Você está conectado!', {
                positionClass: "toast-top-right",
                tapToDismiss: true,
                "preventDuplicates": true

            });

        }, time_noticacao);

        //Para as tentativas de conexão
        clearInterval(intervalId);
    };

    socket.onmessage = function(event) {

        //Interpretar a mensagem recebida
        try{
            var json_recebido = JSON.parse(event.data);
            //console.log('Json Recebido = ', json_recebido);
            //console.log(qtde_tabela);

            criarTabela(json_recebido);
        }
        catch{
            console.log('CATCH | Mensagem Recebida = ', event.data);
        }
        
    };

    socket.onclose = function(event) {
        if (!loading){
            toastr.clear();
            setTimeout(function() {
                toastr.error('Verifique se o aplicativo está aberto, clique no botão de ajuda e em "Conectar". Caso não funcione, feche o programa, reinicie a página e faça o processo novamente!', 'Falha na conexão com o aplicativo!', {
                    positionClass: "toast-bottom-full-width",
                    preventDuplicates: true,
                    timeOut: 10000,
                    tapToDismiss: true
                        
                });
            }, time_noticacao);
            showOffline();


        }
        else
        {
            console.log("Tentativa de conexão falhou. Tentando novamente em 3 segundos...");
        }
        
    };

    socket.onerror = function(error) {
        console.error('Erro na conexão WebSocket:', error);

        if(!loading)
            showOffline();
    };
}

function enviarMensagem(mensagem) {

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(mensagem);
        console.log('Mensagem enviada para o APP (WebSocket):', mensagem);
    } 
    else {
        console.error('A conexão com o aplicativo não está aberta.');
    }
}

// document.getElementById('conectarApp').addEventListener('click', function() {
//     setTimeout(iniciarConexaoWebSocket, 500);
// });
