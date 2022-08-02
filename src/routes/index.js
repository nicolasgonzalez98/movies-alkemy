const { Router } = require('express');
// Importar todos los routers;
const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
router.use('/auth', authRouter);


module.exports = router;