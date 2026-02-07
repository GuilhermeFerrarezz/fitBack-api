import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Ficha = sequelize.define("Ficha", {
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
export default Ficha