"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    host: '127.0.0.1',
    user: "root",
    password: '',
    db: 'ecommerce-backend',
    dialect: 'mysql',
    pool: {
        idle: 10000,
        max: 5,
        min: 0,
        acquire: 10000
    }
};
exports.default = dbConfig;
