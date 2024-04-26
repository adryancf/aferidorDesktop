
$(document).ready(function() {
    if(sessionStorage.getItem('usuario')) {
        $("#inputUsuario").val(sessionStorage.getItem('usuario'));
        
        //desabilitar o campo de usuario
        $("#inputUsuario").prop("disabled", true);
    }

    //Apaga todos os dados na sessionStorage
    sessionStorage.clear();

    //Verificação da igualdade das senhas
    $("#inputConfirmarSenha, #inputSenha").on('input', function() {
        
        if($("#inputSenha").val() == "") {
            //Apagar todo conteudo do redefinir senha
            $("#inputConfirmarSenha").val("");
        }
        
        if($("#inputSenha").val() !== $("#inputConfirmarSenha").val()) {
            $("#inputConfirmarSenha").addClass("is-invalid");

            //Desativar botão de envio
            $("#btnEnvioRedefinir").attr("disabled", true);
        }
        else
        {
            $("#btnEnvioRedefinir").attr("disabled", false);
            $("#inputConfirmarSenha").removeClass("is-invalid");
        }
    });

    //Enviar requisiçao para o servidor
    $("form").submit(function(event) {

        var senha = $("#inputSenha").val();
        var usuario = $("#inputUsuario").val();

        var string_envio = "senha="+senha+"&usuario="+usuario;
        console.log("String envio = " + string_envio);

        $.ajax({
            type: "POST",
            url: "assets/php/redefinirSenha.php",   
            data: string_envio,
            success: function(data) {
                toastr.success("Senha redefinida com sucesso!");
                sessionStorage.setItem("usuario", usuario);
                window.location.href = "login.html";
            },
            error: function(data) {
                var erro = data.responseText;
                console.log("Erro: " + erro);

                //Mostrar um toast de erro
                toastr.error(erro);
                
            }
        });

        event.preventDefault();
    });




});



