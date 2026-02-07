import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'query-string';
import db from '../models/index.js'
import { JWT_SECRET } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize'; 
const User = db.User
const RefreshToken = db.RefreshToken
const createRefreshToken = async (user) => {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 604800);
        const token = uuidv4();
        const refreshToken = await RefreshToken.create({
            token: token,
            userId: user.id,
            expiresAt: expiresAt.getTime()
        });
        return refreshToken.token;
}
    
const persistUser = async (payload)=>{
        const [user] = await User.findOrCreate({
            where: { googleId: payload.googleId },
            defaults: {
                googleId: payload.googleId,
                name: payload.name,
                email: payload.email,
                avatar: payload.avatar
            }
        })
        return user
    
    }


export default {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Dados incompletos" })
            }
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: "E-mail ja cadastrado" })
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao registrar usuário', error });
            
        }
    },

    async login(req, res) {
        try {
            
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
            }
            const user = await User.findOne({ where: { email } });
            if (!user || !user.password) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
            await RefreshToken.destroy({
                where: {
                    userId: user.id,
                    expiresAt: {
                        [Op.lt]: new Date().getTime()
                    }
                }
            });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            const token = jwt.sign(
                { user: JSON.stringify(payload) },
                JWT_SECRET,
                { expiresIn: '15m', }
            )
            console.log('login')
            const refreshToken = await createRefreshToken(user)
            
            return res.status(200).json({ token,
                user: payload,
                refreshToken: refreshToken })
        } catch (error) {
            return res.status(500).json({ message: "Erro no login", error })
        }
    },
    
    async refreshToken(req, res) {
        const { requestToken } = req.body;
        if (!requestToken) {
            return res.status(403).json({ message: "Refresh Token is required" })
        }
        try {
            const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } })
            if (!refreshToken) {
                return res.status(403).json({ message: "Refresh token is not valid" })
            }
            if (RefreshToken.verifyExpiration(refreshToken)) {
                RefreshToken.destroy({ where: { id: refreshToken.id } })
                return res.status(403).json({
                    message: "Sua sessão expirou. Por favor faça login novamente"
                })
            }
            const user = await User.findByPk(refreshToken.userId);

            await RefreshToken.destroy({ where: { id: refreshToken.id } });
            const newRefreshToken = await createRefreshToken(user);


            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            const newAccessToken = jwt.sign(
                { user: JSON.stringify(payload) },
                JWT_SECRET,
                { expiresIn: '15m', }
            );
            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            })


        } catch (err) {
            return res.status(500).send({ message: err })
        }
    },

    async logout(req, res) {
        try {
            console.log('logout')
            const { requestToken } = req.body;
            console.log(requestToken)
            if (!requestToken) {
                return res.status(400).json({ message: "Refresh Token is required to logout" })
            }
            await RefreshToken.destroy({ where: { token: requestToken } });
            return res.status(200).json({ message: "Logout successful" })
        } catch (err) {
            console.error("ERRO NO LOGOUT:", err);
            return res.status(500).send({ message: err })
        }

    },

    



    async googleLogin(req, res) {
        try {
            const { token } = req.body
            if (!token) {
                return res.status(400).json({ error: 'Token is required' });
            }
            //console.log('Token ', token)
            const response = await axios.get('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const googleData = response.data
            console.log(googleData)
            const userPayload = {
                googleId: googleData.id,
                name: googleData.name,
                email: googleData.email,
                avatar: googleData.picture
            }
            const user = await persistUser(userPayload)
            const tokenPayload = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }

            const jwtToken = jwt.sign(
                { user: JSON.stringify(tokenPayload) },
                JWT_SECRET,
                { expiresIn: '15m' }
            );
            const refreshToken = await createRefreshToken(user)
            res.status(200).json({
                token: jwtToken,
                user: user,
                refreshToken: refreshToken
            })
            return googleData
        } catch (err) {
            console.log("err", err.response?.data || err.message)
            res.status(500).json({message: "Error while trying to authenticate", erro: err.message, token: token})
            
        }
        

    }



};
