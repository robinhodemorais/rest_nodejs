const express = require('express');
const router = express.Router();
//inclui o client porque está exportando no mysql.js somente o pool
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/login', (req, res, next)=> {
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})} 
        const query = 'select * from usuarios where email= ?';
        conn.query(query, [req.body.email],(error,results,fields) => {
            conn.release();
            if (error) { return res.status(500).send({error:error})} 
            if (results.length < 1) {
               return res.status(401).send({mensagem: 'Falha na autenticação'});
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err,result) =>{
                if (err) {
                   return res.status(401).send({mensagem: 'Falha na autenticação'}) ;
                }
                if (result) {
                    let token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    },
                    process.env.JWT_KEY, 
                    {
                        expiresIn:"1h"
                    });
                  return res.status(200).send({
                      mensagem: 'Autenticado com sucesso',
                      token: token
                    }) ;
                }
                //se erro a senha não entra no result
                return res.status(401).send({mensagem: 'Falha na autenticação'}) ;
                
            });
        });
    });
});

module.exports = router;