//Função para verificar se o usuário está logado

function verificarLogin() {
  var token = sessionStorage.getItem('token');

  if(token == null) {
    window.location.href = "../login/login.html";
  }
}

function obterDadosToken() {
  var token = sessionStorage.getItem('token');
  var partes = token.split('.');

  // Decodifica o payload (parte do meio)
  var payloadBase64 = partes[1];
  var payloadDecodificado = atob(payloadBase64);
  var payloadJSON = JSON.parse(payloadDecodificado);

  return payloadJSON;
}

function obterNomeUsuario() {
  var payload = obterDadosToken();
  return payload.nome_usuario;
}

function obterIdUsuario() {
  var payload = obterDadosToken();
  return payload.usuario_id;
}

function obterLogin() {
  var payload = obterDadosToken();
  return payload.login;
}

verificarLogin();


function logout() {
  sessionStorage.removeItem('token');

  //ABORDAGEM PELO SESSIONSTORAGE
  sessionStorage.setItem('msgLogout', 'Obrigado por acessar o sistema!');
  window.location.href = "../login/login.html";

  //ABORDAGEM PELO URL
  // var msg = encodeURIComponent('Obrigado por acessar o sistema!');
  // window.location.href = "../login/login.html?msg=" + msg;
}
