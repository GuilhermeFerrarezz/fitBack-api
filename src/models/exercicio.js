import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Exercicio = sequelize.define("Exercicio", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    peso: {
        type: DataTypes.INTEGER,
    },
    series: {
        type: DataTypes.INTEGER,
    },
    repeticoes: {
        type: DataTypes.INTEGER,
    },
    observacoes: {
        type: DataTypes.STRING,
    },
})
export default Exercicio