//FAZER UMA REQUISIÇÃO GET NO BANCO DE DADOS PARA OBTER TODOS OS DADOS
let registros;
let setores = [];

alteracoes = [];

const intervalo_polling = 5000;

tipo={
    d:"Desktop",
    n:"Notebook"
}

function compararDados(id, dado, dado_bd) {
    $(id).removeClass("is-valid is-invalid");
    return (dado == dado_bd || dado_bd == null) ? "is-valid" : "is-invalid";
}

function quantificaErros() {
    //Quantos elementos estão diferentes
    var registro_diferente = $("#card_hw_new .is-invalid").length;
    $("#badgeDiferente").html(registro_diferente);
}

$(document).ready(function () {
    atualizaDados();

    //Inicializar AutoComplete e Select
    $("#new_usuario").autocomplete({
        appendTo: "#modalBodyComparacao",
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
            $('#new_usuario').val(ui.item.label); // display the selected text
            $('#new_fk_funcionario').val(ui.item.value); // save selected id to input
            return false;
       },
       focus: function(event, ui){
            return false;
       },

    });

    
    $.ajax({
        type: "GET",
        url: "assets/php/searchSetor.php",
        dataType: "json",
        success: function(response) {
            var select = $("#new_setor");
    
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

    /*
    $(document).on('click', '.accordion', function() {
    
        //Atualizar o resumo geral das aferições
        console.log($(this).find('.card-body'));
    });
    */


    $(document).on('click', '.table tbody tr', function() {
        // Atualizar o modal
        let index = $(this).data('href');
        let registro = registros[index];
        let lista_softwares = registro.softwares.split(", ");

        $("#btnComparar").data("href", index);

        //EXIBE DINAMICAMENTE OS DADOS DA AFERIÇÃO

        $("#modalSoftwares .modal-body").empty();
        $("#modalSoftwares .modal-body").append(
            `
            <ul class="list-group">
                ${lista_softwares.map(software => `<li class="list-group-item">${software}</li>`).join('')}
            </ul>`

        );


        $("#modalRegistro input, select, textarea").val('');

        $("#nomeFormRegistro").val(registro.nome_funcionario);
        $("#emailFormRegistro").val(registro.email);
        $("#obsFormRegistro").val(registro.obs);
        $("#numeroFormRegistro").val(registro.numero);
        $("#nome_maquinaFormRegistro").val(registro.nome_maquina);
        $("#tipoAferidorFormRegistro").val(tipo[registro.tipo_aferidor]);
        $("#tipoFormularioFormRegistro").val(tipo[registro.tipo_formulario]);
        $("#cpuFormRegistro").val(registro.cpu);
        $("#placaMaeFormRegistro").val(registro.placa_mae);
        $("#ramFormRegistro").val(registro.ram);
        $("#gpuFormRegistro").val(registro.gpu);
        $("#hdFormRegistro").val(registro.hds);
        $("#driversFormRegistro").val(registro.drivers);

        // Adiciona o espaçamento
        $("#modalRegistro label").addClass("mb-2");

        //Abre o modal
        $("#modalRegistro").modal('show');
    });


    $('#btnComparar').on('click', function() {

        // Inserir dinacamente os dados do registro e do banco de dados
        var dados = registros[$("#btnComparar").data('href')];
        if(dados.dadosMaquinaAferidor.length > 0) {
            var dados_bd = dados.dadosMaquinaAferidor[0];
            //var softwares = dados_bd.softwares;
            
            // Definição de Setores

            $("#modalComparacao input, select").val('').removeClass("is-valid is-invalid");

            $("#modalComparacao").modal('show');


            // Dados Novos
            $("#new_usuario").attr("name", "nome_funcionario").val(dados.nome_funcionario).addClass(compararDados("#new_usuario", dados.fk_funcionario, dados_bd.fk_funcionario));
            $("#new_fk_funcionario").attr("name", "nome_funcionario").val(dados.fk_funcionario);
            $("#new_tipo").attr("name", "tipo_formulario").val(tipo[dados.tipo_formulario]).addClass(compararDados("#new_tipo", dados.tipo_formulario, dados_bd.tipo));
            $("#new_nome").attr("name", "nome_maquina").val(dados.nome_maquina);
            $("#new_numero").attr("name", "numero").val(dados.numero).addClass(compararDados("#new_numero", dados.numero, dados_bd.numero));
            
            $("#new_setor").append(
                `<option selected value="${dados.fk_setor}">${setores[dados.fk_setor]}</option>`
            ).addClass(compararDados("#new_setor", dados.fk_setor, dados_bd.fk_setor));
            
            $("#new_cpu").attr("name", "cpu").val(dados.cpu).addClass(compararDados("#new_cpu", dados.cpu, dados_bd.processador));
            $("#new_ram").attr("name", "ram").val(dados.ram).addClass(compararDados("#new_ram", dados.ram, dados_bd.memoria_ram));
            $("#new_placaMae").attr("name", "placa_mae").val(dados.placa_mae).addClass(compararDados("#new_placaMae", dados.placa_mae, dados_bd.motherboard));
            $("#new_gpu").attr("name", "gpu").val(dados.gpu).addClass(compararDados("#new_gpu", dados.gpu, dados_bd.placa_video));
            $("#new_hds").attr("name", "hds").val(dados.hds).addClass(compararDados("#new_hds", dados.hds, dados_bd.hd));
            $("#new_drivers").attr("name", "drivers").val(dados.drivers).addClass(compararDados("#new_drivers", dados.drivers, dados_bd.drivers));


            // Dados BD
            $("#old_usuario").val(dados_bd.nome_funcionario);
            $("#old_tipo").val(tipo[dados_bd.tipo]);
            $("#old_numero").val(dados_bd.numero);
            $("#old_setor_name").val(setores[dados_bd.fk_setor]);
            $("#old_setor").val(dados_bd.fk_setor);
            $("#old_cpu").val(dados_bd.processador);
            $("#old_ram").val(dados_bd.memoria_ram);
            $("#old_placaMae").val(dados_bd.motherboard);
            $("#old_gpu").val(dados_bd.placa_video);
            $("#old_hds").val(dados_bd.hd);
            $("#old_drivers").val(dados_bd.drivers);

            quantificaErros();


        }
        else
        {
            $("#modalComparacao").modal('hide');

            //faze rum swafire
            Swal.fire({
                title: 'Máquina não cadastrada!',
                icon: 'warning',
                confirmButtonText: 'Cadastre agora!',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',

            }).then((result) => {
                if (result.isConfirmed) {
                    
                }
                else
                {
                }

            });
        }

    });


    $(document).on('click', '#btnEditarDados', function() {
        
        //tira o disabled dos campos
        $("#card_hw_new input, #card_hw_new select").prop("disabled", false);

        //Alterar o botao editar para um botão de salvar
        $(this).html("Salvar");
        $(this).removeClass("btn-outline-info").addClass("btn-outline-success").attr("id", "btnSalvarDados");
    });

    $(document).on('click', '#btnSalvarDados', function() {
        $("#card_hw_new input, #card_hw_new select").prop("disabled", true);

        var index = $("#btnComparar").data("href");
        var registro = registros[index];

        //Verifica quais campos forem alterados
        if(Object.keys(alteracoes).length){
            for(var campo in alteracoes) {
                //Altera o registro
                registro[campo] = alteracoes[campo];

                //Altera a tabela de exibição resumida (Nome ou numero da maquina)
                $("tbody tr[data-href='"+ index + "'] td#"+ campo).html(alteracoes[campo]);
            }
            console.log("Foram alterados os seguintes registros = ", alteracoes);
        }
        else
            console.log("Nenhuma alteração foi feita");
        
        //Limpa o array de alterações
        alteracoes = [];

        //Envia as alterações para o banco de dados

        //Retorna a ser um botão de editar
        $(this).html("Editar");
        $(this).removeClass("btn-outline-success").addClass("btn-outline-info").attr("id", "btnEditarDados");
    });
    
    //Mudando o valor de um campo do formulário de comparação
    $("#card_hw_new input, #card_hw_new select").change(function() {
        
        //Registra a alteração (NOME DO CAMPO -> NOVO VALOR)
        alteracoes[$(this).attr("name")] = $(this).val();

        
        var id = $(this).attr("id");
        dado_antigo = "#old" + id.replace("new", ""); 

        //Faz a comparação com o elemento antigo
        $(this).addClass(compararDados("#"+id, $(this).val(), $(dado_antigo).val()));   

        //Atualiza a quantidade de erros
        quantificaErros();     

    });

    //QUANDO EU APERTO O BOTAO DE ENVIAR EU MANDO AS NOS DOIS BANCO DE DADOS
    
    

    
});

function dadosResumido(valor, index) {
    return (`<tr data-href="${index}">
        <td id="nome_funcionario"> ${valor.nome_funcionario} </td>
        <td id="email"> ${valor.email} </td>
        <td id="numero"> ${valor.numero} </td>
        <td id="data"> ${valor.data_hora_cadastro} </td>
        <td id="info"></td>
        </tr>`);

}


function atualizaDados() {

    //Obter setores
    $.ajax({
        type: "GET",
        url: "assets/php/searchSetor.php",
        dataType: "json",
        success: function(response) {
            //setores = response;
            response.forEach(function(setor) {
                setores[setor.value] = setor.label;
            });

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
                
                //Verificar se o setor já existe no accordion
                id_setor = valor.fk_setor;


                accordion_setor = $("#collapse" + id_setor);
                if(accordion_setor.length > 0) {
                    //console.log("ja existe esse setor no accordion");
                    $("#tbody" + id_setor).append(dadosResumido(valor, index));
                    var atualizarMaquinasAferidas = "#card" + id_setor + " #maquinasAferidas";
                    var numeroMaquinas = $("#tbody" + id_setor + " tr").length;
                    $(atualizarMaquinasAferidas).html(numeroMaquinas);
                    
                    var badgeAtualizar = $("#badgeAtualizar" + id_setor);
                    var badgeCadastrar = $("#badgeCadastrar" + id_setor);

                    if(valor.dadosMaquinaAferidor.length >= 1)
                        badgeAtualizar.html(parseInt(badgeAtualizar.html()) + 1);
                    else
                        badgeCadastrar.html(parseInt(badgeCadastrar.html()) + 1);
                    


                }
                else{                
                    
                    //Criar um item no accordion
                    $("#setoresAccordion").append(
                        `<div class="accordion-item">
                            
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id_setor}" aria-expanded="true" aria-controls="collapse${id_setor}">
                                    ${setores[id_setor]}
                                </button>
                            </h2>
                            
                            <div id="collapse${id_setor}" class="accordion-collapse collapse" data-bs-parent="#setoresAccordion">
                                <div class="accordion-body">
                                    <!-- Criar um dashboard resumindo algumas informações -->
                                    <div class="card mb-3">
                                        <div class="card-body" id="card${id_setor}">
                                            <div class="container text-center">
                                                <div class="row align-items-center">
                                                    <div class="col-3">
                                                        <h4>Máquinas Aferidas</h4>
                                                        <p id="maquinasAferidas" class="display-1">1</p>
                                                    </div>
                    
                                                    <div class="col">
                                                        <div class="row text-center my-2">
                                                            <div class="col">
                                                                <button class="w-25 btn btn-outline-info fw-bold shadow-sm">
                                                                    Atualizar Máquina
                                                                    <span class="badge text-bg-dark fw-bold" id="badgeAtualizar${id_setor}">0</span>

                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div class="row text-center my-2">
                                                            <div class="col">
                                                                <button class="w-25 btn btn-outline-success fw-bold shadow-sm">
                                                                    Cadastrar Máquina
                                                                    <span class="badge text-bg-dark fw-bold" id="badgeCadastrar${id_setor}">0</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <table id="${index}" class ="table table-bordered table-hover text-center">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Número da Máquina</th>
                                                <th scope="col">Data da aferição</th>
                                                <th scope="col">Infos</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tbody${id_setor}">
                                            ${dadosResumido(valor, index)}
                                        </tbody>
                                    </table>
                                        
                                </div>
                            </div>
                        </div>`
                    );

                    valor.dadosMaquinaAferidor.length >= 1 ? $("#badgeAtualizar" + id_setor).html(1) : $("#badgeCadastrar" + id_setor).html(1);
                }   
                
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro na atualização dos dados:', status, error);
        }
    });


}
