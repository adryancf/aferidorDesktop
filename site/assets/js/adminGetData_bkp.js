//FAZER UMA REQUISIÇÃO GET NO BANCO DE DADOS PARA OBTER TODOS OS DADOS
let registros;
let setores;
let registros_teste;
const intervalo_polling = 5000;
tipo={
    d:"Desktop",
    n:"Notebook"
}

$(document).ready(function () {
    atualizaDados();

    $(document).on('click', '.table tbody tr', function() {
        // Atualizar o modal
        let registro = registros[$(this).data('href')];

        $(".modal-body").empty();
        
        //Comparar os dados do registro obtido com o banco de dados
        $(".modal-body").append(
            `
            <h5 class="mb-3">Informações do Funcionário</h5>

            <div class="row">
                <div class="col">
                    <label for="nome">Nome</label>
                    <input type="text" class="form-control" id="nomeForm_${registro.id}" value="${registro.nome_funcionario}" disabled>
                </div>
                <div class="col">
                    <label for="email">Email</label>
                    <input type="text" class="form-control" id="emailForm_${registro.id}" value="${registro.email}" disabled>
                </div>
            </div>
            
            <hr>
            <h5 class="mb-3">Dados Aferição</h5>

            <div class="row">
                <div class="col">
                    <label for="numero">Número</label>
                    <input type="text" class="form-control" id="numeroForm_${registro.id}" value="${registro.numero}" disabled>
                </div>
                <div class="col">
                    <label for="nome_maquina">Nome da Máquina</label>
                    <input type="text" class="form-control" id="nomeMaquina_${registro.id}" value="${registro.nome_maquina}" disabled>
                </div>
                <div class="col">
                    <label for="tipo_aferidor">Tipo [App}</label>
                    <input type="text" class="form-control" id="tipoAferidor_${registro.id}" value="${tipo[registro.tipo_aferidor]}" disabled>
                </div>
                <div class="col">
                    <label for="tipo_formulario">Tipo [Formulario]</label>
                    <input type="text" class="form-control" id="tipoAferidor_${registro.id}" value="${tipo[registro.tipo_formulario]}" disabled>
                </div>
            </div>

            <div class="row my-3">
                <div class="col">
                    <label for="cpu">Processador</label>
                    <input type="text" class="form-control" id="cpu_${registro.id}" value="${registro.cpu}" disabled>
                </div>
                <div class="col">
                    <label for="placa_mae">Placa Mãe</label>
                    <input type="text" class="form-control" id="placaMae_${registro.id}" value="${registro.placa_mae}" disabled>
                </div>
            </div>
            
            <div class="row my-3">
                <div class="col-md-10">
                    <label for="gpu">Placa de Vídeo</label>
                    <input type="text" class="form-control" id="gpu_${registro.id}" value="${registro.gpu}" disabled>
                </div>
                <div class="col">
                    <label for="ram">RAM</label>
                    <input type="text" class="form-control" id="ram_${registro.id}" value="${registro.ram}" disabled>
                </div>
            </div>

            <div class="row my-3">
                <div class="col">
                    <label for="hd">Disco Rígido</label>   
                    <input type="text" class="form-control overflow-auto" id="hd_${registro.id}" value="${registro.hds}" disabled>
                </div>
            </div>

            <div class="row my-3">
                <div class="col">
                    <label for="drivers">CD/DVD</label>
                    <input type="text" class="form-control" id="drivers_${registro.id}" value="${registro.drivers}" disabled>
                </div>
            </div>

            `       
        );
        
        $("#modalRegistro").modal('show');
    });
});

function dadosResumido(valor, index) {
    return (`<tr data-href="${index}">
        <td id="nome_${valor.id}"> ${valor.nome_funcionario} </td>
        <td id="email_${valor.id}"> ${valor.email} </td>
        <td id="numero_${valor.id}"> ${valor.numero} </td>
        <td id="data_${valor.id}"> ${valor.data_hora_cadastro} </td>
        <td id="observacao_${valor.id}"> ${valor.obs} </td>
        </tr>`);

}


function atualizaDados() {

    //Obter setores
    $.ajax({
        type: "GET",
        url: "assets/php/searchSetor.php",
        dataType: "json",
        success: function(response) {
            setores = response;
        },
        error: function(error) {
            console.error("Erro no carregamento dos setores:", error);
        }
    });

    //Obter registros
    $.ajax({
        url: 'assets/php/adminGetData.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            registros = data;
            console.log(registros);

            //Separar por setores
            registros.forEach(function(valor, index) {
                    
                setores.find(function(setor) {
                    if (setor.value == valor.fk_setor) {

                        //Verificar se o setor já existe no accordion
                        accordion_setor = $("#heading" + setor.value);
                        if(accordion_setor.length > 0) {
                            console.log("ja existe esse setor no accordion");
                            $("#tbody" + setor.value).append(dadosResumido(valor, index));
                        }
                        else{

                            //Criar um card no accordion
                            $("#setoresAccordion").append(
                                `<div class="card">
                                    <div class="card-header" id="heading${setor.value}">
                                        <h5 class="mb-0">
                                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${setor.value}" aria-expanded="true" aria-controls="collapse${setor.value}">
                                                ${setor.label}
                                            </button>
                                        </h5>
                                    </div>
                                    <div id="collapse${setor.value}" class="collapse" aria-labelledby="heading${setor.value}" data-parent="#setoresAccordion">
                                        <div class="card-body">
                                            <table class ="table table-bordered table-hover text-center">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Nome</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Número da Máquina</th>
                                                        <th scope="col">Data da aferição</th>
                                                        <th scope="col">Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbody${setor.value}">
                                                    ${dadosResumido(valor, index)}
                                                </tbody>
                                            </table>
                                                
                                        </div>
                                    </div>
                                </div>`
                            );
                        }          
                    }
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro na atualização dos dados:', status, error);
        }
    });


}