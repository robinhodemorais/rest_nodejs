const express = require('express');
const router = express.Router();
//inclui o client porque está exportando no mysql.js somente o pool
const mysql = require('../mysql').pool;

//retorna todos os pedidos
router.get('/',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'select a.id_pedido,a.quantidade,b.id_produto,b.nome,b.preco from pedidos a, produtos b where b.id_produto = a.id_produto ',
            (error,result,fields)=> {
                if (error) { return res.status(500).send({error:error})}  
                const response = {
                    pedidos:result.map(pedido=>{
                        return {
                            id_pedido:pedido.id_pedido,
                            quantidade:pedido.quantidade,
                            produto: {
                                id_produto:pedido.id_produto,
                                nome:pedido.nome,
                                preco:pedido.preco,
                            },
                            request: {
                                tipo: 'GET',
                                descricao:'Retorna os detalhes de um pedido especifico',
                                url:'http://localhost:3000/pedidos/'+pedido.id_pedido
                            }
                        }
                    })
                }              
               return  res.status(200).send(response);
            }
        );
    });

});
//salva um pedidos
router.post('/',(req,res,next) =>{
    mysql.getConnection((error,conn)=>{
        if (error) { return res.status(500).send({error:error})}
        conn.query('select * from produtos where id_produto=?',
            [req.body.id_produto],
            (error,result,field) => {
                if (error) { return res.status(500).send({error:error})}
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado'
                    });
                }

                conn.query(
                    'insert into pedidos (id_produto,quantidade) values (?,?)',
                    [req.body.id_produto,req.body.quantidade],
                    (error,result,field)=> {
                        conn.release();
                        if (error) { return res.status(500).send({error:error})}
                        const response = {
                            mensagem: 'Pedido inserido com sucesso',
                            pedidoCriado: {
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao:'Retorna todos os pedidos',
                                    url:'http://localhost:3000/pedidos'
                                }
                            }
                        }                
                       return  res.status(201).send(response);
                    }
                )

            }
        );
    });
});
//retorna um pedidos
router.get('/:id_pedidos',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'select * from pedidos where id_pedido = ?;',
            [req.params.id_pedido],
            (error,result,fields)=> {
                if (error) { return res.status(500).send({error:error})} 
                
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    })
                }
                const response = {                    
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        qunatidade: result[0].qunatidade,
                        request: {
                            tipo: 'GET',
                            descricao:'Retorna todos os pedidos',
                            url:'http://localhost:3000/pedidos/'
                        }
                    }
                }                
               return  res.status(201).send(response);            }
        );
    });
});

//exclui um pedidos
router.delete('/',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'delete from pedidos where id_pedido = ?;',
            [req.body.id_pedido],
            (error,resultado,field)=> {
                if (error) { return res.status(500).send({error:error})}  
                const response = {
                    mensagem:'Pedido removido com sucesso',
                    tipo:'POST',
                    descricao:'Insere um pedido',
                    url:'http://localhost:3000/pedidos',
                    body: {
                        id_produto:"Number",
                        quantidade:"Number"
                    }

                }              
               return  res.status(202).send(response);
            }
        );
    });
});

module.exports = router;