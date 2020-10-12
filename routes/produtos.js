const express = require('express');
const router = express.Router();
//inclui o client porque está exportando no mysql.js somente o pool
const mysql = require('../mysql').pool;

//retorna todos os produtos
router.get('/',(req,res,next) =>{
   mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'select * from produtos',
            (error,result,fields)=> {
                if (error) { return res.status(500).send({error:error})}  
                const response = {
                    quantidade: result.length,
                    produtos:result.map(prod=>{
                        return {
                            id_produto:prod.id_produto,
                            nome:prod.nome,
                            preco:prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao:'Retorna os detalhes de um produto especifico',
                                url:'http://localhost:3000/produtos/'+prod.id_produto
                            }
                        }
                    })
                }              
               return  res.status(200).send(response);
            }
        );
    });
});
//salva um produto
router.post('/',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'insert into produtos (nome,preco) values (?,?)',
            [req.body.nome,req.body.preco],
            (error,result,field)=> {
                conn.release();
                if (error) { return res.status(500).send({error:error})}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: result.nome,
                        preco: result.preco,
                        request: {
                            tipo: 'GET',
                            descricao:'Retorna todos os produtos',
                            url:'http://localhost:3000/produtos'
                        }
                    }
                }                
               return  res.status(201).send(response);
            }
        )
    });  
});
//retorna um produto
router.get('/:id_produto',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'select * from produtos where id_produto = ?;',
            [req.params.id_produto],
            (error,result,fields)=> {
                if (error) { return res.status(500).send({error:error})} 
                
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }
                const response = {                    
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao:'Retorna todos os produtos',
                            url:'http://localhost:3000/produtos/'
                        }
                    }
                }                
               return  res.status(201).send(response);            }
        );
    });
});
//altera um produto
router.patch('/',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            //com o ` conseguimos pular linha 
            `update produtos 
                set nome = ?,
                    preco = ?
              where id_produto = ?`,
            [req.body.nome,
             req.body.preco,
             req.body.id_produto],
            (error,result,field)=> {
                conn.release();
                if (error) { return res.status(500).send({error:error})}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao:'Retorna os detalhes de um produto especifico',
                            url:'http://localhost:3000/produtos/'+ req.body.id_produto
                        }
                    }
                }                
               return  res.status(202).send(response);
            }
        );
    });

});
//exclui um produto
router.delete('/',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'delete from produtos where id_produto = ?;',
            [req.body.id_produto],
            (error,resultado,field)=> {
                if (error) { return res.status(500).send({error:error})}  
                const response = {
                    mensagem:'Produto removido com sucesso',
                    tipo:'POST',
                    descricao:'Insere um produto',
                    url:'http://localhost:3000/produtos',
                    body: {
                            nome:"String",
                            preco:"Number"
                    }

                }              
               return  res.status(202).send(response);
            }
        );
    });

});

module.exports = router;