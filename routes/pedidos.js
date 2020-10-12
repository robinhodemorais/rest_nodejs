const express = require('express');
const router = express.Router();

//retorna todos os pedidos
router.get('/',(req,res,next) =>{
    res.status(200).send({
        mensagem:'Retorna os pedidos'
    });
});
//salva um pedidos
router.post('/',(req,res,next) =>{
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    };
    res.status(201).send({
        mensagem:'Pedido criado',
        pedidoCriado:pedido
    });
});
//retorna um pedidos
router.get('/:id_pedidos',(req,res,next) =>{
    const id = req.params.id_pedidos;

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

//exclui um pedidos
router.delete('/',(req,res,next) =>{
    res.status(201).send({
        mensagem:'Pedido Excluido'
    });
});

module.exports = router;