import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Ficha = sequelize.define("Ficha", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },




})
export default Ficha