import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Exercicio = sequelize.define("Exercicio", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        unique: true
    },

})
export default Exercicio;