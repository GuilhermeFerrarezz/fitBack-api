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
        type: DataTypes.STRING,
    },
    pesoType: {
        type: DataTypes.STRING
    },
    series: {
        type: DataTypes.STRING,
    },
    repeticoes: {
        type: DataTypes.STRING,
    },
    observacoes: {
        type: DataTypes.STRING,
    },
})
export default Exercicio