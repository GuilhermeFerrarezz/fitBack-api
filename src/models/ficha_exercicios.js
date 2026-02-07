import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Ficha_Exercicio = sequelize.define("Ficha_Exercicio", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        primaryKey: true,
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
        type: DataTypes.INTEGER,
    },
})
export default Ficha_Exercicio