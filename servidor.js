const pg = require("pg");
const express = require("express");
const servidor = express();
const bodyParser = require('body-parser');
const crypto = require('crypto')
servidor.set("view engine", "ejs");
servidor.use("/", express.static("arquivos/"));
servidor.use(express.urlencoded({ extended: true }));
servidor.use(bodyParser.urlencoded({ extended: false }));
servidor.use(bodyParser.json());
const client = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"",
    password:"",
    port:5432
});
client.connect();
async function CadastrarDB(Nome,Email,Senha){
    var base= 'SELECT * FROM "Cadastro" WHERE "Email" = ($1)';
    var resultado =  await client.query(base,[Email]);
    if (resultado.rows[0]!=null) return "Email já cadastrado";
    else{
        base = 'INSERT INTO public."Cadastro" ("Nome","Email","Senha") VALUES ($1,$2,$3)';
        await client.query(base,[Nome,Email,Senha]);
        return 200;
    };
};
async function LogarDB(Email,Senha){
    const base = 'SELECT * FROM "Cadastro" WHERE "Email" = ($1)';
    resultado =  await client.query(base,[Email]);
    if (resultado.rows[0]!=null){
        if(resultado.rows[0].Senha==Senha) {
            return {"Status":200,"Nome":resultado.rows[0].Nome};
        }
        else return "Senha Incorreta";
    }
    else return "E-mail não encontrado!";   
};
function Logar(req, resp){
    var email = req.body.Email;
    var senha = req.body.Senha;
    var status = LogarDB(email,Crypt(senha));
    status.then(resultado => {
        if (resultado.Status==200){
            resp.render("Perfil",{nome:resultado.Nome})
        }
        else{
            resp.render("Login",{erro: resultado})
        }
    })
}
function Cadastrar(req, resp){
    var nome = req.body.Nome;
    var email = req.body.Email;
    var senha = req.body.Senha;
    var status = CadastrarDB(nome,email,Crypt(senha));
    status.then(resultado => {
        if (resultado==200) resp.redirect("Login");
        else resp.render("Cadastro",{erro: resultado})
    })
}
function Crypt(Senha){
    let hash = crypto.createHash('md5').update(Senha).digest("hex");
    return hash;
}
function NovaSenha(req, resp){
    const senha =  Crypt(req.body.senhaAntiga);
    const novaSenha =  Crypt(req.body.novaSenha);
    const dados = {
        "SenhaAntiga":senha,
        "NovaSenha":novaSenha
    };
    NovaSenhaDB(dados);
}

async function NovaSenhaDB(dados){

}

servidor.get("/", function(req,resp){resp.render("index");});;
servidor.get("/Cadastro",function(req,resp){resp.render("Cadastro",{erro:""});});
servidor.get("/Login",function(req,resp){resp.render("Login",{erro: ""});});
servidor.get("/Perfil",function(req,resp){resp.render("Perfil",{nome:""});});
servidor.post("/Cadastrar",Cadastrar);
servidor.post("/NovaSenha",NovaSenha)
servidor.post("/Logar",Logar);
servidor.listen(80);1