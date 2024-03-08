
//CONFIGURAÇÃO DOS INPUTS DINAMICOS DO FORMULARIO
$(document).ready(function(){

    
    //INICIALIZA O TOOLTIP
    $('[data-toggle="tooltip"]').tooltip();

    //INICIALIZA O AUTOCOMPLETE DO NOME DO FUNCIONARIO
    $("#fk_funcionario_text").autocomplete({
        appendTo: ".modal-body",
        source: function(request, response) {
            $.ajax({
                url: "assets/php/searchFuncionario.php",
                dataType: "json",
                data: {
                    q: request.term
                },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 0,
        select: function (event, ui) {
            // Set selection
            $('#fk_funcionario_text').val(ui.item.label); // display the selected text
            $('#fk_funcionario').val(ui.item.value); // save selected id to input
            return false;
       },
       focus: function(event, ui){
            return false;
       },

    });

    //INICIALIZA O SELECT DOS SETORES
    $.ajax({
        type: "GET",
        url: "assets/php/searchSetor.php",
        dataType: "json",
        success: function(response) {
            var select = $("#setor");
    
            // Preenche o select com as opções
            $.each(response, function(index, option) {
                select.append($("<option>")
                .attr("value", option.value)
                .text(option.label));
            });
        },
        error: function(error) {
            console.error("Erro no carregamento dos setores:", error);
        }
    });

});

function validarEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

//ENVIA OS DADOS PARA O PHP, QUE IRÁ ENVIAR PARA A DATABASE
$("#formularioEnvio").submit(function(event) {

    //Fecha o formulario de envio
    $('.modal').modal('hide');

    // Cria um objeto JSON com os valores
    var array_infos = {
        nome_funcionario: $("#fk_funcionario_text").val(),
        fk_funcionario: $("#fk_funcionario").val(),
        email: $("#email").val(),
        numero: $("#numero").val(),
        tipo: $("#tipo").val(),
        fk_setor: $("#setor").val(),
        obs: $("#obs").val()
    };

    var jsonEnvio = {
        hardwares: array_hardwares,
        softwares: array_softwares,
        infos: array_infos

    };

    // Faz a requisição AJAX
    $.ajax({
        type: 'POST',
        url: 'assets/php/enviarDados.php',
        dataType: 'json',
        data: JSON.stringify(jsonEnvio),
        success: function(response) {
            console.log("Requisição bem-sucedida:", response);
            
            Swal.fire({
                title: 'Os dados foram enviados!',
                text: 'Fique atento ao seu email. Em casos de dúvidas em relação aos dados, entraremos em contato!',
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                }
            });
        },
        error: function(error) {
            console.error("Erro na requisição:", error);

            //Substituir por uma pagina de erro
            toastr.clear();
            setTimeout(function() {
                toastr.error(error, 'Falha no envio ao servidor!', {
                    positionClass: "toast-bottom-full-width",
                    preventDuplicates: true,
                    timeOut: 5000,
                    tapToDismiss: true
                        
                });
            }, time_noticacao);

            Swal.fire({
                title: 'Falha no envio dos dados!',
                text: 'Atualize a página e repita o processo! Se mesmo assim não funcionar, entre em contato com o suporte',
                icon: 'error',
                confirmButtonText: 'Tentar Novamente',
                
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        }
    });
    
    event.preventDefault();
});
