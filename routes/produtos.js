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
            (error,resultado,fields)=> {
                if (error) { return res.status(500).send({error:error})}                
               return  res.status(200).send({response:resultado})
            }
        );
    });
});
//salva um produto
router.post('/',(req,res,next) =>{
    if (error) { return res.status(500).send({error:error})}
    mysql.getConnection((error,conn)=> {
        conn.query(
            'insert into produtos (nome,preco) values (?,?)',
            [req.body.nome,req.body.preco],
            (error,resultado,fields)=> {
                conn.release();
                if (error) { return res.status(500).send({error:error})}
                res.status(201).send({
                    mensagem:'Produto inserido com sucesso',
                    id_produto: resultado.insertId
                });
            }
        );
    });

});
//retorna um produto
router.get('/:id_produto',(req,res,next) =>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'select * from produtos where id_produto = ?;',
            [req.params.id_produto],
            (error,resultado,field)=> {
                if (error) { return res.status(500).send({error:error})}                
               return  res.status(200).send({response:resultado})
            }
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
            (error,resultado,field)=> {
                conn.release();
                if (error) { return res.status(500).send({error:error})}
                res.status(202).send({
                    mensagem:'Produto alterado com sucesso'
                });
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
               return  res.status(202).send({mensagem:'Produto removido com sucesso'})
            }
        );
    });

});

module.exports = router;