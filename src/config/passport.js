import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { obtenerBD } from './db.js';
import { ObjectId } from 'mongodb';
import 'dotenv/config';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET 
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const db = obtenerBD();
      
      const usuario = await db.collection('usuarios').findOne({ 
        _id: new ObjectId(jwt_payload.usuarioId) 
      });

      if (usuario) {
        const { password, ...usuarioSinPassword } = usuario;
        return done(null, usuarioSinPassword);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;