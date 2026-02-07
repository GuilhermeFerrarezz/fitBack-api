import sequelize from "../config/database.js";
import User from './user.js';
import RefreshToken from "./RefreshToken.js";
import Ficha from './ficha.js'
import Exercicio from "./exercicio.js";

User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
});

RefreshToken.belongsTo(User,
    {
        foreignKey: "userId"      
    });

User.hasMany(Ficha, {
    onDelete: "CASCADE"
});
Ficha.belongsTo(User);

User.hasMany(Exercicio, {
    onDelete: "CASCADE"

});
Exercicio.belongsTo(User)

Ficha.hasMany(Exercicio, {
    onDelete: "CASCADE"
});
Exercicio.belongsTo(Ficha);

const db = {
    sequelize,
    User,
    RefreshToken,
    Ficha,
    Exercicio
}
export default db

