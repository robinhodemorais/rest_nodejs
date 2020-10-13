const express = require('express');
const router = express.Router();
//inclui o client porque está exportando no mysql.js somente o pool
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro',(req,res,next)=>{
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query('select * from usuarios where email= ?',[req.body.email],(error,results) => {
            if (error) { return res.status(500).send({error:error})}    
            if (results.length > 0) {
                res.status(409).send({mensagem:'Usuário já cadastrado'})
            } else {
                //10 é um salt para jogar caracteres á mais na criptografia
                bcrypt.hash(req.body.senha,10,(errBcrypt, hash)=>{
                    if (errBcrypt) {
                        return res.status(500).send({
                            error:errBcrypt
                        })
                    }
                    conn.query('insert into usuarios (email,senha) values (?,?)',
                            [req.body.email, hash],
                            (error,results) => {
                                conn.release();
                                    if (error) { return res.status(500).send({error:error})} 
                                    return res.status(201).send({
                                        mensagem:'Usuário criado com sucesso',
                                        usuarioCriado:{
                                            id_usuario: results.insertId,
                                            email:req.body.email
                                        }
                                    })
                            })
                });
            }
        });

    });    
});

module.exports = router;