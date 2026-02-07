import sequelize from "../config/database.js";
import User from './user.js';
import RefreshToken from "./RefreshToken.js";
import Ficha from './ficha.js'
import Exercicio from "./exercicio.js";
import Ficha_Exercicio from "./ficha_exercicios.js";


User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
});

RefreshToken.belongsTo(User,
    {
        foreignKey: "userId"      
    });

User.hasMany(Ficha);
Ficha.belongsTo(User)

Ficha.belongsToMany(Exercicio, { through: Ficha_Exercicio });
Exercicio.belongsToMany(Ficha, { through: Ficha_Exercicio })

Ficha.hasMany(Ficha_Exercicio);
Ficha_Exercicio.belongsTo(Exercicio);

const db = {
    sequelize,
    User,
    RefreshToken,
    Ficha,
    Exercicio,
    Ficha_Exercicio
}
export default db

