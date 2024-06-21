import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "../config/dbConfig";
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: 3306,
  pool: {
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes migrated");
});

export default db;
