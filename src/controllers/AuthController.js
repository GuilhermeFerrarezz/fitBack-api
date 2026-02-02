import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'query-string';
import User from '../models/user.js';
import { JWT_SECRET } from '../middlewares/auth.js';

export default {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || password) {
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
            if (isPasswordValid) {
                return res.status(401).json({ message: "Credenciais inválidas" });
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            const token = jwt.sign(
                {user: JSON.stringify(payload)},
                JWT_SECRET,
                { expiresIn: '15m', }
            )
            return res.status(200).json({data: {user: payload, token}})
        } catch (error) {
            return res.status(500).json({message: "Erro no login", error})
        }
    }
}