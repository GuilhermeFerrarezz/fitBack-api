
import db from '../models/index.js'
import { Op } from 'sequelize';
const Exercicio = db.Exercicio
export default {
    async create(req, res) {
        const { name, peso, series, repeticoes, observacoes } = req.body;
        const fichaId = req.params.fichaId
        const userId = req.userId
        if (!name || !fichaId || !userId) {
            return res.status(400).json({ message: "Dados incompletos" })
        }
        try {
            const exercicio = await Exercicio.create({
                name,
                peso,
                series,
                repeticoes,
                observacoes,
                UserId: userId,
                FichaId: fichaId
            })
            res.status(201).json(exercicio)
        } catch (error) {
            res.status(400).json({ error: error.message })

        }
    },

    async findAll(req, res) {
        const userId = req.userId
        const fichaId = req.params.fichaId
        if (!userId || !fichaId) {
            res.status(400).send({
                message: "Id do usuário não pode ser vazio"
            })
        }
        try {
            const exercicios = await Exercicio.findAll({ where: { FichaId: fichaId, UserId: userId } })
            res.json(exercicios)
        } catch (error) {
            res.status(500).json({ error: error.message })

        }

    },

    async findOne(req, res) {
        const userId = req.userId
        const fichaId = req.params.fichaId
        const id = req.params.id;;
        if (!id || !fichaId || !userId) {
            res.status(400).send({
                message: "ID não pode ser vazio"
            })
            return
        }
        try {
            const exercicio = await Exercicio.findOne({
                where: {
                    id: id,
                    FichaId: fichaId
                }
            })
            if (!exercicio) {
                return res.status(404).json({ error: 'Exercicio não encontrada' })
            }
            res.json(exercicio)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    async update(req, res) {
        const userId = req.userId
        const { name, peso, series, repeticoes, observacoes } = req.body;
        const id = req.params.id;
        const fichaId = req.params.fichaId
        if (!name || !id || !userId || !fichaId) {
            res.status(400).send({
                message: "Conteúdo não pode ser vazio"
            })
            return;
        }
        try {
            const exercicio = await Exercicio.findOne({
                where: { id: id, FichaId: fichaId, UserId: userId }
            })
            if (!exercicio) {
                return res.status(404).json({ error: 'Exercicio não encontrada' })
            }
            await exercicio.update({
                name,
                peso,
                series,
                repeticoes,
                observacoes,
                FichaId: fichaId
            })
            res.json(exercicio)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },

    async delete(req, res) {
        const userId = req.userId
        const id = req.params.id;
        const fichaId = req.params.fichaId
        if (!id || !fichaId || !userId) {
            res.status(400).send({
                message: "Id não pode ser vazio"
            })
            return;
        }
        try {
            const exercicio = await Exercicio.findOne({
                where: { id: id, FichaId: fichaId, UserId: userId }
            })
            if (!exercicio) {
                return res.status(404).json({ error: 'Exercicio não encontrada' })
            }
            await exercicio.destroy()
            res.status(204).json({ message: 'Deletado com sucesso' })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }

}