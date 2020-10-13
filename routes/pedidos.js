const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidos-controller.js');

router.get('/',pedidosController.getPedidos);
router.post('/',pedidosController.postPedidos);
router.get('/:id_pedidos',pedidosController.getUmPedido);
router.delete('/',pedidosController.deletePedido);

module.exports = router;