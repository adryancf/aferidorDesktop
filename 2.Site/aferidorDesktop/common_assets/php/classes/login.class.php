<?php
/*
#           Classe Login
*/
session_start();
require_once("conexao.class.php");
class Login{	
	public function Login(){
	}
	public function logar($login,$senha){
		$consulta = "select * from usuarios where login = '$login' and senha = '".md5($senha . "2012" . $login)."'";
		
		$conexao = new ConBD;
		$stmt = $conexao->processa($consulta,1);
		if(!$stmt){
			#Numero do erro juntamente com uma mensagem explicativa.
			$msg = mysqli_error($conexao->conecta) . " : Não foi possível logar devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.";
			return $msg;
		}else{
			if($row = mysqli_fetch_object($stmt)){
				$_SESSION['id_usuario'] = $row->id_usuario;
				$_SESSION['login'] = $row->login;
				$_SESSION['nome'] = $row->nome_usuario;
				$_SESSION['time_out'] = time();				 
				return "OK";
			}else{
				return "Usuario ou senha incorretos.";
			}
		}
	}

  //Retorna um TOKEN JWT para o cliente (header, payload, signature).
  //Este token é utilizado para verificar se a sessão está iniciada e se o cliente pode acessar a página. Além de conter informações do usuário.
  //Parecido com o $_session, mas quero usar algo do JavaScript. 
  public function logar_aferidorDesktop($login,$senha){
    $consulta = "select * from usuarios where login = '$login' and senha = '".md5($senha . "2012" . $login)."'";
		$conexao = new ConBD;
		$stmt = $conexao->processa($consulta,1);

		if(!$stmt){
			#Numero do erro juntamente com uma mensagem explicativa.
			//RETORNAR UM ERRO
      return ("ERRO | Não foi possível logar devido a um erro: " . mysqli_error($conexao->conecta));

		}
    else{
			if($row = mysqli_fetch_object($stmt)){
				//CRIA O TOKEN
        $key = "71500";
        $header = base64_encode(json_encode(array('alg' => 'HS256', 'typ' => 'JWT')));
        $payload = base64_encode(json_encode(array('usuario_id' => $row->id_usuario, 'nome_usuario' => $row->nome_usuario, 'login' => $row->login)));
        $signature = base64_encode(hash_hmac('sha256',"$header.$payload", $key, true));

        $token = "$header.$payload.$signature";

				return $token;
			}else{
				return "ERRO | Usuario ou senha incorretos.";
			}
		}

  }


  public function redefinirSenha($login, $senhaNova) {
		$consulta = "SELECT * FROM usuarios WHERE login = '$login'";
	
		$conexao = new ConBD;
		$stmt = $conexao->processa($consulta, 0);
	
		if (!$stmt) {
			return ("ERRO: " . mysqli_error($conexao->conecta));
		} else {
			if ($row = mysqli_fetch_object($stmt)) {

				// Redefinir senha
				$novaSenhaCriptografada = md5($senhaNova . "2012" . $login);
				$atualizarSenha = "UPDATE usuarios SET senha = '$novaSenhaCriptografada' WHERE login = '$login'";
				$stmtAtualizacao = $conexao->processa($atualizarSenha, 1);
	
				if (!$stmtAtualizacao) {
					return "Não foi possivel redefinir a senha. ERRO: " . mysqli_error($conexao->conecta);
				} else {
					return "Senha redefinida com sucesso!";
				}
			} else {
				return "ERRO: Usuario não encontrado!";
			}
		}
	}

	public function verificaPermicao($id){
		$tempo_conectado = time() - $_SESSION['time_out'];
		//Time out limite em segundos
		if($tempo_conectado > 3600){ // 60 min
			session_start();
			session_unset();
			session_destroy();
			return "false";
		}elseif(!empty($_SESSION['login'])){
			$_SESSION['time_out'] = time();
			return "true";
		}else{
			return "false";
		}		
	}
	public function redirecionar($acesso){
		$redirecionar = "";
		
		if($acesso == "false"){
			$redirecionar = 'window.location.href = "login.php?msg=Acesso negado ou sua sessão expirou!<br />Insira a <strong>matrícula</strong> e a <strong>senha</strong> para entrar.";';
		}
		return $redirecionar;
	}
	public function logout(){
		session_start();
		session_unset();
		session_destroy();
		$msg = 'Obrigado por acessar o sistema!'; 
		$redirecionar = 'window.location.href = "login.php?msg='.$msg.'";';
		return $redirecionar;
	}
}
?>