const express = require('express');
const router = express.Router();

//retorna todos os produtos
router.get('/',(req,res,next) =>{
    res.status(200).send({
        mensagem:'Usando o GET dentro da rota de produtos'
    });
});
//salva um produto
router.post('/',(req,res,next) =>{
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };
    res.status(201).send({
        mensagem:'Insere Produto',
        produtoCriado: produto
    });
});
//retorna um produto
router.get('/:id_produto',(req,res,next) =>{
    const id = req.params.id_produto;

    if (id == 'especial') {
        res.status(200).send({
            mensagem:'Você descobriu o ID especial',
            id:id
        });
    } else {
        res.status(200).send({
            mensagem:'Você passou um ID',
            id:id
        });
    
    }
});
//altera um produto
router.patch('/',(req,res,next) =>{
    res.status(201).send({
        mensagem:'Usando o PATCH dentro da rota de produtos'
    });
});
//exclui um produto
router.delete('/',(req,res,next) =>{
    res.status(201).send({
        mensagem:'Usando o delete dentro da rota de produtos'
    });
});

module.exports = router;