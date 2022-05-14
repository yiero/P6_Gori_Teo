const rateLimit = require('express-rate-limit');
 
 exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 10, // Max de tentative de requête par IP (par 15min)
    standardHeaders: true, // Retourne les informations de rate limit dans le header
    legacyHeaders: false, // Masque le nombre de tentative restante dans le header
 });
