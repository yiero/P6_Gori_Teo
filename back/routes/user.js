const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 10, // Max de tentative de requête par IP (par 15min)
    standardHeaders: true, // Retourne les informations de rate limit dans le header
    legacyHeaders: false, // Masque le nombre de tentative restante dans le header
});
  

router.post('/signup', userCtrl.signup);
router.post('/login', limiter, userCtrl.login);


module.exports = router;