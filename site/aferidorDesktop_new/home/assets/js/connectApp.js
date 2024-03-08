var socket;
var temporizador = 0;
var intervalId;

var loading = false;
var cliqueInicio = true;

const intervalo_conexao = 2000;

const time_noticacao = 600;


function showConnected() {
  $('.connected').show();
  $('.connecting').hide();
  $('.offline').hide();

  loading = false;

  //Card de ações do usuário
  $("#abrirApp").hide();
  $("#scanApp").show();
  //$("#conectarApp").show();

  //Configuração de abertura do aplicativo
  $("#aviso_conexao").hide();
  $("#sucesso_conexao").show();
  $("#btnDonwload").hide();
  $("#btnConectarModal").hide();


}

function showConnecting() {
  $('.connected').hide();
  $('.connecting').show();
  $('.offline').hide();

  //Começa o loading e desativa o botao de abrir, pois o usuario ja clicou
  loading = true;
  $("#abrirApp").attr("disabled", true);
}

function showOffline() {
  $('.connected').hide();
  $('.connecting').hide();
  $('.offline').show();

  loading = false;
  
  //Quando essa função for chamada após o primeiro clique, o card volta ao estado inicial, porem, com o texto do botão alterado
  if(!cliqueInicio){
    $("#scanApp").hide();

    //Btn para abrir o aplicativo
    $("#abrirApp").text("Abrir aplicativo");
    $("#abrirApp").attr("disabled", false);
    $("#abrirApp").show();

    //Btn para conectar manualmente (nao sei se vai ser mt util)
  }

  
  //Configuração de abertura do aplicativo
  $("#aviso_conexao").show();
  $("#sucesso_conexao").hide();
  $("#btnDonwload").show();
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
  $("#btnConectarModal").hide();

});

//Aparencia do modal de inicio no modo em que o sistema abre o aplicativo automaticamente (modo padrão)
function modalInicio_modoAberturaAutomatica(){
  $("#aviso_conexao").show();
  $("#aviso_download").hide();

  $("#instrucaoModalInicio").text('Clique em "Abrir" e aguarde enquanto o programa inicia e estabelecemos a conexão com ele.').removeClass("conexaoManual");
  $(".status-container").removeClass("conexaoManualStatus")
  $("#tituloModalInicio").text("Abrindo o programa no seu computador...");
  $("#btnDonwload").show();
}

//Aparencia do modal de inicio no modo em que o usuario escohe abrir o aplicativo
function modalInicio_modoAberturaManual(){
  $("#instrucaoModalInicio").text("Você escolheu o modo manual, então, abra o programa e aguarde enquanto estabelecemos a conexão com ele...").addClass("conexaoManual");
  $(".status-container").addClass("conexaoManualStatus");
  $("#tituloModalInicio").text("Abra o programa no seu computador");
  $("#aviso_conexao").hide();
  $("#btnDonwload").hide();
}

//Aparencia do modal de inicio quando o usuario sai/fecha o poup-up de falha na conexao 
function modalInicio_modoSemConexao(){
  $("#instrucaoModalInicio").text("Não foi selecionada nenhuma tentativa de reconexão. Por favor, feche esta tela ou recarregue a página e tente novamente").addClass("conexaoManual");
  $(".status-container").addClass("conexaoManualStatus");
  $("#tituloModalInicio").text("Não conseguimos nos conectar ao programa...");
  $("#aviso_conexao").hide();
  $("#aviso_download").show();
  $("#btnDonwload").show();
}

function tentandoConectarAppPorTempoDeterminado(tempo_max_conexao){
  showConnecting();

  // O site tenta se conectar com o aplicativo por 30s
  intervalId = setInterval(function() {
      
      //Altero o timeout da notificação para nao ficar exibindo em loop
      if (temporizador >= tempo_max_conexao) {
        console.log("Limite de tempo atingido. Não foi possível conectar.");
        
        // Atualiza o estado de carregamento e limpa o intervalo
        clearInterval(intervalId);
        temporizador = 0;

        // Exibe uma mensagem de erro ao usuário
        Swal.fire({
          title: 'Poxa... Não conseguimos conectar!',
          text: 'Verifique se o aplicativo foi aberto automaticamente e se você autorizou a abertura pelo navegador.',
          icon: 'error',
          confirmButtonText: 'Tentar abrir novamente',
          showDenyButton: true,
          denyButtonText: 'Tentar conectar manualmente',
          denyButtonColor: "gray",
          footer: 'Se preferir, você também pode abrir o programa manualmente e tentar conectar.',
          customClass: {
            confirmButton: 'btn btn-primary',
            denyButton: 'btn btn-outline-secondary',
            popup: 'swal-falhaConexao'
          }

        }).then((result) => {
            if (result.isConfirmed) {
              $("#abrirApp").click();
              return;
            }else if(result.isDenied){
              tentandoConectarAppPorTempoDeterminado(10000);

              if(!$("#modalInicio").hasClass("show")){
                $("#modalInicio").modal("show");
              }

              modalInicio_modoAberturaManual();
              return;
            }
            else{
              showOffline();
              if(!$("#modalInicio").hasClass("show")){
                $("#modalInicio").modal("show");
              }
              modalInicio_modoSemConexao();
              //Adcionar o botao para conectar
              //$("#btnConectarModal").show();
            }

        });
      } else {
          // Inicia a conexão WebSocket e atualiza o temporizador
          iniciarConexaoWebSocket();
          temporizador += intervalo_conexao;
          console.log(temporizador, " segundos");
      }
  }, intervalo_conexao);

}

function abrirApp(){
  
}

//ABERTURA DO MODULO NO COMPUTADOR DO CLIETNE
$("#abrirApp").click(function() {
  
  //EFEITO PARA DAR A ENTENDER QUE ESTA SE INICIANDO OUTRO PROCESSO (SE TIVER ABERTO, ELE FECHA E ABRE NOVAMENTE)
  // if ($("#modalInicio").hasClass('show')) {
  //   // Quando o modal for completamente fechado, abra-o novamente
  //   $("#modalInicio").on('hidden.bs.modal', function (e) {
  //     $("#modalInicio").off('hidden.bs.modal'); // Remove o manipulador para evitar chamadas duplicadas
  //     $("#modalInicio").modal("show");
  //   });

  //   // Fecha o modal
  //   $("#modalInicio").modal("hide");
  // } else {
  //   // Se o modal não estiver visível, abra-o
  //   $("#modalInicio").modal("show");
  // }

  modalInicio_modoAberturaAutomatica();
  $("#modalInicio").modal("show");

  window.location.href = 'aferidordesktop://open';
  tentandoConectarAppPorTempoDeterminado(20000);

  if(cliqueInicio){
    cliqueInicio = false;
    //Alterar o texto do botão
    $("#abrirApp").text("Abrir aplicativo");

  }
  
  // Define um temporizador para verificar se a tentativa de abrir foi bem-sucedida
  // setTimeout(function() {
  //   // Se a janela ainda estiver na página, PODE SER QUE protocolo não está registrado
  //   if (document.hasFocus()) {

  //     //Poupup de alerta (SweetAlert2) com botao de download do aplicativo
  //     Swal.fire({
  //       title: 'Aplicativo não encontrado!',
  //       text: 'Clique no botão abaixo e baixe o nosso app.',
  //       icon: 'warning',
  //       confirmButtonText: '<i class="bi bi-download me-1"></i> Baixar',
  //       confirmButtonColor: "#008000",
  //     }).then((result) => {
  //       if (result.isConfirmed) {

  //         //Executar o download
  //         var url = "../download/Instalador_AferidorDesktop.exe";
  //         var link = $("<a>").attr('href', url).appendTo('body');
  //         link[0].click();

  //         link.remove();

  //         Swal.fire({
  //           title: "Seu aplicativo já está sendo baixado!",
  //           text:"Após finalizar o download, abra o instalador e faça a instalação. Em caso de dúvidas, clique no botão abaixo.",
  //           showDenyButton: true,
  //           confirmButtonText: "Saiba mais",
  //           denyButtonText: `<i class="bi bi-arrow-clockwise"></i>`,
  //           denyButtonColor: "gray",
  //           confirmButtonColor: "navy",
  //           icon: "success",
  //           footer: 'Caso o instalador não abra, <a href="../download/downloadBckp/Instalador_AferidorDesktop.exe">Clique aqui</a>',
  //           customClass: {
  //             popup: 'custom-swal-width',
  //           },
  //         }).then((result)=> {
  //           if(result.isConfirmed){
  //             //Abrir modal de ajuda
  //             $("#modalAjuda").modal("show");
  //           }
  //           else{
  //             //Recarregar a página
  //             location.reload();
  //           }
  //         });
          
  //       }
  //     });

      

  //   }
  //   else
  //   {   
  //     tentandoConectarAppPorTempoDeterminado();
  //   }
  // }, 100);

  //Talvez exibir um modal padrão de ajuda para todos os usuários


  //Alterar os botões de acordo com o status da conexão
  
  

});

$("#continuarModalAbertura").click(function() {
  //Se clicado sem ter conectado, nao deixar fechar o modal

});

$("#btnDonwload").click(function() {

  // Executar o download
  var url = "../download/Instalador_AferidorDesktop.exe";
  var link = $("<a>").attr('href', url).appendTo('body');
  link[0].click();

  link.remove();

  Swal.fire({
    title: "Seu aplicativo já está sendo baixado!",
    html: `
    <div class="mx-4">
      <span>Após concluir o download, abra o instalador e prossiga com a instalação. Ao finalizar, atualize o site e inicie novamente.</span>
      
      <div class="justify-content-center d-flex my-4 gap-2 fs-6">
        <div class="alert alert-warning shadow d-flex align-items-center">
          <span class="">Se um aviso informando que a <b>transferência é insegura</b> ou algo semelhante aparecer, clique em <b>"Manter"</b> para concluir o download.</span>
        </div>

        <div class="alert alert-warning shadow d-flex align-items-center">
          <span class="">Durante a instalação, se aparecer "O Windows protegeu o computador", clique em <b>"Mais informações"</b> e, em seguida, clique em <b>"Executar mesmo assim"</b>.</span>
        </div>
      </div>

      <span class="fw-bold mb-0 mt-5">Em caso de dúvidas, clique no botão abaixo.</span>
    </div>`,
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
});


$("#iniciarScanApp").click(function() {
  //enviarMensagem("scan_system");
  iniciarConexaoWebSocket();
});

function iniciarConexaoWebSocket() {

    console.log("Iniciando conexão WebSocket...");

    const servidorWebSocketURL = 'ws://localhost:8181';
    socket = new WebSocket(servidorWebSocketURL);

    socket.onopen = function(event) {
      console.log('Conexão WebSocket aberta:', event);
      socket.send("Cliente conectado!");
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
      else{
        console.log("Tentativa de conexão falhou. Tentando novamente em " + (intervalo_conexao/1000) + " segundos...");
      }
        
    };

    socket.onerror = function(error) {
      //console.error('Erro na conexão WebSocket:', error);

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

document.getElementById('conectarApp').addEventListener('click', function() {
    //setTimeout(iniciarConexaoWebSocket, 500);
    enviarMensagem("close_app");
});
