import passport from 'passport';

export const autenticar = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err); 
    }
    if (!user) {
      return res.status(401).json({ error: 'Acceso no autorizado. Token inválido o expirado.' });
    }
    req.user = user;
    next();
  })(req, res, next);
};
