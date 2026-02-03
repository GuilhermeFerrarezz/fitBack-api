import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"
const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
      type: DataTypes.STRING, 
      allowNull: true
    }

})
export default User;