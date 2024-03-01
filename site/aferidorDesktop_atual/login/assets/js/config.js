$(document).ready(function() {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "2000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  //Exibe a mensagem de logout caso exista

  //ABORDAGEM PELO SESSIONSTORAGE

  if(sessionStorage.getItem('msgLogout')) {
    toastr.success(sessionStorage.getItem('msgLogout'));
  }

  if(sessionStorage.getItem('usuario')) {
    $("#inputUsuario").val(sessionStorage.getItem('usuario'));
    
    //desabilitar o campo de usuario
    $("#inputUsuario").prop("disabled", true);
  }

  //Apaga todos os dados na sessionStorage
  sessionStorage.clear();

  //ABORDAGEM PELO URL

  // var parametros = new URLSearchParams(window.location.search);
  // if(parametros.has('msg')) {
  //   var msg = decodeURIComponent(parametros.get('msg'));
  //   toastr.success(msg);
  // }

  /* CONFIGURAÇÕES DA SENHA */ 
  
  // var iconPassword = $(".icon-password");
  // var inputSenha = $('#inputSenha');

  // inputSenha.on('input focus', function() {
  //   iconPassword.toggle(inputSenha.val().trim() !== '');
  // });

  // iconPassword.on('click', function() {
  //   console.log('click');
  //   newType = inputSenha.attr('type') === 'password' ? 'text' : 'password';

  //   inputSenha.attr('type', newType);
  //   iconPassword.toggleClass('bi-eye bi-eye-slash');
  // });

  //Quando o hiperlink é clicado
  $("#linkRedefinir").click(function(event) {
    //Colocar o nome de usuario no sessionStorage
    var usuario = $("#inputUsuario").val();
    console.log("usuario = " + usuario);
    
    if(usuario) {
      sessionStorage.setItem("usuario", usuario);
    }

  });
  

});








