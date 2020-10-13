const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
//no ambiente de desenvolvimento ele excuta um callback para cada
//rota trazendo um log detalhado 
app.use(morgan('dev'));
//informa que o diretorio uploads está disponivel publicamente
app.use('/uploads', express.static('uploads'));
//aceita apenas dados simples
app.use(bodyParser.urlencoded({extended:false}));
//só var aceitar json de entrada no body
app.use(bodyParser.json());

app.use((req,res,next)=>{
    //permite acesso de todos
    res.header('Acces-Control-Allow-Origin','*');
    //o que aceita de cabeçalho
    res.header('Acces-Control-Allow-Header',
               'Origin, X-Requested-With, Content-type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/produtos',rotaProdutos);
app.use('/pedidos',rotaPedidos);

//Quando não encontra rota, entra aqui
app.use((req,res,next) => {
    const erro = new Error('Rota não encontrada');
    erro.status = 404;
    next(erro);
});

app.use((error,req,res,next) => {
  //se não pegar nenhum status retorno o status 500  
  res.status(error.status || 500);
  return res.send({
      erro: {
          mensagem : error.message
      }
  });
});

module.exports = app;