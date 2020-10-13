const express = require('express');
const router = express.Router();
//inclui o client porque está exportando no mysql.js somente o pool
const mysql = require('../mysql').pool;
//para fazer uploads
const multer = require('multer');
const login = require('../middleware/login');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        //sem o replace dá erro no windows
        cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.minetype === 'image/jpg') {
        cb(null,true);
    } else {
        cb(null,false);
    }
}

//passa o destino para salvar todas as imagens dentro da pasta uploads
const upload = multer({
        storage:storage,
        limits: {
            fileSize:1024 * 1024 * 5
        },
        fileFilter: fileFilter
});

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
                            imagem_produto: prod.imagem_produto,
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
router.post('/',login.obrigatorio,upload.single('produto_imagem'),(req,res,next) =>{
    console.log(req.usuario);
    mysql.getConnection((error,conn)=> {
        if (error) { return res.status(500).send({error:error})}
        conn.query(
            'insert into produtos (nome,preco, imagem_produto) values (?,?,?)',
            [
                req.body.nome,
                req.body.preco,
                req.file.path
            ],
            (error,result,field)=> {
                conn.release();
                if (error) { return res.status(500).send({error:error})}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: result.nome,
                        preco: result.preco,
                        imagem_produto: result.imagem_produto,
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
                        imagem_produto: result[0].imagem_produto,
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
router.patch('/',login.obrigatorio,(req,res,next) =>{
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
                    mensagem: 'Produto alterado com sucesso',
                    produtoCriado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.body.imagem_produto,
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
router.delete('/',login.obrigatorio,(req,res,next) =>{
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