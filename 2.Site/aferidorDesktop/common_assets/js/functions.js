function formatarData(data, icone_data = '<i class="bi bi-calendar me-2"></i>', icone_hora = '<i class="bi bi-clock me-1"></i>') {
  let data_teste = new Date(data);
  const dia = String(data_teste.getDate()).padStart(2, '0');
  const mes = String(data_teste.getMonth() +  1).padStart(2, '0'); // Os meses em JavaScript começam em  0
  const ano = data_teste.getFullYear();
  const horas = String(data_teste.getHours()).padStart(2, '0');
  const minutos = String(data_teste.getMinutes()).padStart(2, '0');
  const segundos = String(data_teste.getSeconds()).padStart(2, '0');
  if(icone_data && icone_hora){
    return `<div class="d-flex justify-content-center">
      <span class="me-3">${icone_data}${dia}/${mes}/${ano}</span>
      <span>${icone_hora}${horas}:${minutos}</span>
    </div>`;
  }
  else{
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  }
}

// Função para criar um cookie sem limite de tempo de expiração
function criarCookie(nome, valor) {
  document.cookie = nome + "=" + valor + ";path=/";
  //"path=/" significa que o cookie é válido para todo o site e não apenas para o diretório atual
}

// Função para criar um cookie
function criarCookieComDataExpiracao(nome, valor, dias) {
  var dataExpiracao = new Date();
  dataExpiracao.setTime(dataExpiracao.getTime() + (dias * 24 * 60 * 60 * 1000));
  var expires = "expires=" + dataExpiracao.toUTCString();
  document.cookie = nome + "=" + valor + ";" + expires + ";path=/";
}

// Função para obter o valor de um cookie
function obterValorCookie(nome) {
  
  // Divide a string de cookies em pares de chave-valor
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    
    // Remove espaços em branco em excesso
    var cookie = cookies[i].trim(); 

    if (cookie.startsWith(nome + '=')) {
      // Retorna o valor do cookie (+1 para ignorar o sinal de igual '=')
      return cookie.substring(nome.length + 1);
    }
  }

  // Retorna vazio se o cookie não for encontrado
  return '';
}
