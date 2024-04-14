$("form").submit(function(event) {
  //console.log("teste");

  var senha = $("#inputSenha").val();
  var usuario = $("#inputUsuario").val();

  var string_envio = "senha="+senha+"&usuario="+usuario;
  console.log("String envio = " + string_envio);

  $.ajax({
    type: "POST",
    url: "assets/php/login.php",
    data: string_envio,
    success: function(data) {
      console.log("token_acesso = ", data);

      sessionStorage.setItem("token", data);

      window.location.href = "../admin/admin.html";
    },
    error: function(data) {
      var erro = data.responseText;
      console.log("Erro: " + erro);

      //Mostrar um toast de erro
      toastr.error(erro);
      
    }
  });

  //Enviar requisiçao para o servidor

  event.preventDefault();


});

