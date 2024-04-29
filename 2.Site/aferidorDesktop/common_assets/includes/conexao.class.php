<?php

//VERSÃO ATUALIZADA - PHP8

class ConBD {
    
    private string $servidor = '127.0.0.1';  // Servidor
    private string $user     = 'root'; // Usuario do banco
    private string $senha    = ''; // Senha do banco
    private string $bd       = 'aferidordesktop'; // Bd
    public $conecta;
    private string $sql;
    private $resultado;
    
    public function mudaBd(string $bd): void {
        $this->bd = $bd;
    }
    
    private function AbrirConexao(): void {
        $this->conecta = mysqli_connect($this->servidor, $this->user, $this->senha, $this->bd);
        if (!$this->conecta) {
            echo "<p>Não foi possível conectar-se ao servidor MySql.</p>\n" 
                 .
                 "<p><strong>Erro MySql: " . mysqli_connect_error() . "</strong></p>\n";
            exit();
        } 
    }
    
    public function Conectar() {
        $this->conecta = mysqli_connect($this->servidor, $this->user, $this->senha, $this->bd);
        if (!$this->conecta) {
            echo "<p>Não foi possível conectar-se ao servidor.</p>\n" 
                 .
                 "<p><strong>Erro MySql: " . mysqli_connect_error() . "</strong></p>\n";
            exit();
        } else {
            return $this->conecta;
        }
    }
    
    public function processa(string $sql, bool $fechar): ?object {
        $this->AbrirConexao();
        $sql = str_replace("\'", "'", $sql);
        $this->sql = $sql;
        $this->resultado = mysqli_query($this->conecta, $sql);
        if ($fechar != 1) {
            $this->fecharConexao();
        }
        return $this->resultado;
    }
    
    public function fecharConexao(): bool {
        return mysqli_close($this->conecta);
    }
}

//VERSÃO DESATUALIZADA - PHP5                   

// class ConBD{
    
//     private $servidor = '127.0.0.1';  // Servidor
//     private $user     = 'root'; // Usuario do banco
//     private $senha    = '12345'; // Senha do banco
// 	private $bd		  = 'aferidorDesktop'; // Bd
//     public $conecta;
//     private $sql;
//     private $resultado;
    
//     public function mudaBd($bd){
// 		$this->bd = $bd;
// 	}
//     private function AbrirConexao() {
        
//         $this->conecta = mysql_connect($this->servidor,$this->user,$this->senha);
// 		mysql_select_db($this->bd,$this->conecta);
//         if(!$this->conecta) {
//             echo "<p>Não foi possível conectar-se ao servidor MySql.</p>\n" 
//                  .
//                  "<p><strong>Erro MySql: " . mysql_errno() . "</strong></p>\n";
//                  exit();
//         } 
//     }
// 	public function Conectar() {
        
//         $this->conecta = mysql_connect($this->servidor,$this->user,$this->senha);
// 		mysql_select_db($this->bd,$this->conecta);
//         if(!$this->conecta) {
//             echo "<p>Não foi possível conectar-se ao servidor.</p>\n" 
//                  .
//                  "<p><strong>Erro MySql: " . mysql_errno() . "</strong></p>\n";
//                  exit();
//         }else{
// 			return($this->conecta);
// 		}
//     }
//     public function processa($sql,$fechar){
        
//         $this->AbrirConexao();
//         $sql = str_replace("\'","'",$sql);
//         $this->sql = $sql;
//         //echo $sql;
//         $this->resultado = mysql_query($sql,$this->conecta);
// 		if($fechar != 1)
// 			$this->fecharConexao();
        
// 		return $this->resultado;
//     }
    
//     public function fecharConexao() {
//         return mysql_close($this->conecta);
//     }

// }



?>