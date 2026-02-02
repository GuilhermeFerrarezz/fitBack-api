import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'query-string';
import User from '../models/user.js';
import { JWT_SECRET } from '../middlewares/auth.js';
import RefreshToken from '../models/RefreshToken.js';
import { v4 as uuidv4 } from 'uuid';

const createRefreshToken = async (user) => {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 86400);
        const token = uuidv4();
        const refreshToken = await RefreshToken.create({
            token: token,
            userId: user.id,
            expiresAt: expiresAt.getTime()
        });
        return refreshToken.token;
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
            
            return res.status(200).json({ data: { user: payload, token, refreshToken } })
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
                return res.status(403).json({ message: "Refresh token is not in the database!" })
            }
            if (RefreshToken.verifyExpiration(refreshToken)) {
                RefreshToken.destroy({ where: { id: refreshToken.id } })
                return res.status(403).json({
                    message: "Sua sessão expirou. Por favor faça login novamente"
                })
            }
            const user = await User.findByPk(refreshToken.userId);

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
                refreshToken: refreshToken.token
            })


        } catch (err) {
            return res.status(500).send({ message: err })
        }
    },

    async logout(req, res) {
        try {
            const { requestToken } = req.body;
            if (!requestToken) {
                return res.status(400).json({ message: "Refresh Token is required to logout" })
            }
            await RefreshToken.destroy({ where: { token: requestToken } });
            return res.status(200).json({ message: "Logout successful" })
        } catch (err) {
            return res.status(500).send({ message: err })
        }

    }

};
