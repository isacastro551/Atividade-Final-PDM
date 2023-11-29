const express = require('express')
const app = express()
const port = 3306
const mysql = require('mysql2');
var cors = require('cors')
var bodyParse = require('body-parser');


app.use(bodyParse.json());
app.use(bodyParse.urlencoded());
app.use(bodyParse.urlencoded({extend:true}));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : "password",
    database: 'cardapio'
  });

app.use(cors())
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Alô mundo novo!')
})

app.get('/categoria', (req, res) => {
    connection.query(
        'SELECT * FROM categoria',
        function(err, results, fields) {
          res.send(results)
        }
      );
    
  })
app.get('/categoria_produto', (req, res) => {
    connection.query(
        'SELECT * FROM categoria c inner join categoria_produto cp'+
        ' on c.id_categoria=cp.id_categoria ' +
          ' inner join produto p on p.id_produtos=cp.id_produtos;',
        function(err, results, fields) {
          res.send(results)
        }
        
      );
    
  })

app.get('/categoria/:id', (req, res) => {
    var id_categoria = req.params.id
    connection.query(
        'SELECT * FROM categoria where id_categoria = ' + id_categoria,
        function(err, results, fields) {
          res.send(results)
        }
      );
    
  })
app.post('/categoria', (req, res) => {
    console.log(req.body)
    var titulo = req.body
    connection.query(
        `insert into categoria(titulo) values("Chinesa")`,
        function(err, results, fields) {
            console.log(err)
          res.send(err)
        }
      );
    
  })
app.patch('/categoria/:id', (req, res) => {
    var id = req.params.id
    var titulo = "Chinesa nova"
    connection.query(
        `update categoria set titulo = "${titulo}" where id_categoria = ${id}`,
        function(err, results, fields) {
            console.log(err)
          res.send(err)
        }
      );
    
  })

app.get('/produto', (req, res) => {
    res.send('Acesso a rota produto!')
  })
  
app.post('/produto', (req, res) => {
    res.send('Acesso rota post!')
  })



// Rota para inserir dados do formulário no banco de dados
app.post('/adicionar_produto', (req, res) => {
  const {
    titulo,
    image_url,
    valor,
    tempo_preparo,
    free_gluten,
    vegano,
    vegetariano,
    free_lactose
  } = req.body;
  console.log("produto",req.body)

  const query = `INSERT INTO produto (titulo, image_url, valor, tempo_preparo, free_gluten, vegano, vegetariano, free_lactose)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;

  connection.query(query, [titulo, image_url, valor, tempo_preparo, free_gluten ? 1 : 0, vegano ? 1 : 0, vegetariano ? 1 : 0, free_lactose ? 1 : 0], (err, result) => {
    if (err) throw err;
    console.log('Produto inserido com sucesso!');
    res.send('Produto inserido com sucesso!');
  });
});



app.post('/adicionar_card', (req, res) => {
  const { titulo, cor } = req.body;
  console.log ("body", req.body);

  const query = `INSERT INTO categoria (titulo, cor) VALUES (?, ?)`;

  connection.query(query, [titulo, cor], (err, result) => {
      if (err) {
          console.error('Erro ao inserir na tabela categoria: ', err);
          res.status(500).send('Erro ao inserir na tabela categoria');
      } else {
          console.log('Dados inseridos na tabela categoria com sucesso!');
          res.status(200).send('Dados inseridos na tabela categoria com sucesso!');
      }
  });
});












app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})