const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
var mysql = require("mysql");
__dirname = path.resolve();

// Configurações
  // Body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

// Conexão com o banco de dados
    var con = mysql.createConnection({
      host: "www.remotemysql.com",
      database: "lAVyMLD9OZ",
      port: 3306,
      user: "lAVyMLD9OZ",
      password: "01dmt2p9JF"
    });
    con.connect(function(err){
      if(err){
        console.log('Erro ao tentar se conectar!');
        return;
      }
      console.log('Conexão estabelecida!');
    });

app.get('/', (req, res) => {
res.redirect('/listar');
});

app.get('/listar', (req, res) => {
con.query('SELECT * FROM `livro`', function(err, rows, fields) {
if (err){
console.log ('error', err.message, err.stack)
}
else{
res.render(__dirname+'/views/listar.html', {livros:rows});
}
});
});

app.get('/cadastrar', (req, res) => {
res.render(__dirname+'/views/cadastrar.html');
});

app.post('/cadastrar',function(req, res){
var nome=req.body.nome;
var editora=req.body.editora;
var ano=req.body.ano;
var autor=req.body.autor;
var genero=req.body.genero;

const livro = {'nome': nome, 'editora': editora, 'ano': ano , 'autor': autor , 'genero': genero };
con.query('INSERT INTO livro SET ?', livro, (err, resp) => {
if (err){
console.log ('error', err.message, err.stack)
}
else
console.log("Registro Efetuado!!");
res.redirect('/listar');
});
});

app.get('/deletar/:codigo', (req, res) => {
var id = req.params.codigo;
con.query('DELETE FROM `livro` Where codigo = ?',[id], function(err, result) {
console.log("Registro Deletado!!");
console.log(result);
});
res.redirect('/listar');
});

app.get('/editar/:codigo', (req, res) => {
var id = req.params.codigo;
con.query('SELECT * FROM `livro` Where codigo = ?',[id], function(err, rows, fields) {
if (err){
console.log ('error', err.message, err.stack)
}
else{
console.log(rows[0]);
res.render(__dirname+'/views/editar.html', {livro:rows[0]});
}
});
});

app.post('/editar',function(req,res){
var nome=req.body.nome;
var editora=req.body.editora;
var ano=req.body.ano;
var autor=req.body.autor;
var genero=req.body.genero;
var codigo=req.body.codigo;
con.query('UPDATE livro SET nome = ?, editora = ?, ano = ?, autor = ?, genero = ? Where codigo = ?', [nome, editora, ano, autor, genero, codigo],
(err, res) => {
if (err) throw err;
console.log(`Atualizado ${res.changedRows} row(s)`);
});
res.redirect('/listar');
});

app.use(express.static(path.join(__dirname, '/public')));

app.engine('html', require('ejs').renderFile);

app.listen(process.env.port || 3000);
console.log('Running at Port 3000');

// nodemon
