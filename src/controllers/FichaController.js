import Exercicio from '../models/exercicio.js';
import db from '../models/index.js'
import { Op } from 'sequelize';
const Ficha = db.Ficha
export default {

    async create(req, res) {
        const nome = req.body.name
        const userId = req.userId
        if (!nome || !userId) {
            res.status(400).send({
                message: "Conteúdo não pode ser vazio"
            })
            return;
        }
        try {
            const ficha = await Ficha.create({
                name: nome,
                UserId: userId
            })
            res.status(201).json(ficha)
        } catch (error) {
            res.status(400).json({ error: error.message })

        }
    },

    async findAll(req, res) {
        const userId = req.userId
        if (!userId) {
            res.status(400).send({
                message: "Id do usuário não pode ser vazio"
            })
        }
            try {
                const fichas = await Ficha.findAll({ where: { UserId: userId } })
                res.json(fichas)
            } catch (error) {
                res.status(500).json({ error: error.message })

            }

},

    async findOne(req, res) {
        const id = req.params.id;
        const userId = req.userId;
        if (!id || !userId) {
            res.status(400).send({
                message: "ID não pode ser vazio"
            })
            return
        }
        try {
            const ficha = await Ficha.findOne({
                where: {
                    id: id,
                    UserId: userId
                },
                include: [
                    {
                        model: Exercicio,

                    }
            ]})
            if (!ficha) {
                return res.status(404).json({ error: 'Ficha não encontrada' })
            }
            res.json(ficha)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    async update(req, res) {
        const nome = req.body.name
        const id = req.params.id
        const userId = req.userId;
        if (!nome || !id || !userId) {
            res.status(400).send({
                message: "Conteúdo não pode ser vazio"
            })
            return;
        }
        try {
            const ficha = await Ficha.findOne({
                where: {id: id, UserId: userId}
            })
            if (!ficha) {
                return res.status(404).json({ error: 'Ficha não encontrada' })
            }
            await ficha.update({
                name: nome
            })
            res.json(ficha)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },

    async delete(req, res) {
        const id = req.params.id
        const userId = req.userId;
        if (!id || !userId) {
            res.status(400).send({
                message: "Id não pode ser vazio"
            })
            return;
        }
        try {
            const ficha = await Ficha.findOne({
                where: {id: id, UserId: userId}
            })
            if (!ficha) {
                return res.status(404).json({ error: 'Ficha não encontrada' })
            }
            await ficha.destroy()
            res.status(204).json({ message: 'Deletado com sucesso'})
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

}