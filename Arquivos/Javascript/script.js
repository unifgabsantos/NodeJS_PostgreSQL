function Gerar(){
    document.getElementById('conteudo').innerHTML='<br><form action="/NovaSenha" method="POST"><br><input type="password" id="senhaAntiga" placeholder="Senha Antiga" name="senhaAntiga" required><br><input type="password" id="senhaNova" name="novaSenha" placeholder="Nova Senha" required><br><input type="password" id="senhaConfirmacao" placeholder="Confirme sua Senha" required><br><button type="submit">Mudar senha</button><br></form>';
}
