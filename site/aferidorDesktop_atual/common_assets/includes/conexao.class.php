<?php

class ConBD{
    
    private $servidor = '192.168.3.129';  // Servidor
    private $user     = 'servicos_esteio'; // Usuario do banco
    private $senha    = 'esqw@02'; // Senha do banco
	private $bd		  = 'aferidordelicensas'; // Bd
    public $conecta;
    private $sql;
    private $resultado;
    
    public function mudaBd($bd){
		$this->bd = $bd;
	}
    private function AbrirConexao() {
        
        $this->conecta = mysql_connect($this->servidor,$this->user,$this->senha);
		mysql_select_db($this->bd,$this->conecta);
        if(!$this->conecta) {
            echo "<p>Não foi possível conectar-se ao servidor MySql.</p>\n" 
                 .
                 "<p><strong>Erro MySql: " . mysql_errno() . "</strong></p>\n";
                 exit();
        } 
    }
	public function Conectar() {
        
        $this->conecta = mysql_connect($this->servidor,$this->user,$this->senha);
		mysql_select_db($this->bd,$this->conecta);
        if(!$this->conecta) {
            echo "<p>Não foi possível conectar-se ao servidor.</p>\n" 
                 .
                 "<p><strong>Erro MySql: " . mysql_errno() . "</strong></p>\n";
                 exit();
        }else{
			return($this->conecta);
		}
    }
    public function processa($sql,$fechar){
        
        $this->AbrirConexao();
        $sql = str_replace("\'","'",$sql);
        $this->sql = $sql;
        //echo $sql;
        $this->resultado = mysql_query($sql,$this->conecta);
		if($fechar != 1)
			$this->fecharConexao();
        
		return $this->resultado;
    }
    
    public function fecharConexao() {
        return mysql_close($this->conecta);
    }

}

?>