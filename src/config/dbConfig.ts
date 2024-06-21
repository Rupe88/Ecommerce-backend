interface Database {
  host: string;
  user: string;
  password: string;
  db: string;
  dialect: "mysql" | "postgres" | "sqlite";
  pool: {
    max: number;
    min: number;
    idle: number;
    acquire:number
  };
}
const dbConfig:Database={
    host:'127.0.0.1',
    user:"root",
    password:'',
    db:'ecommerce-backend',
    dialect:'mysql',
    pool:{
        idle:10000,
        max:5,
        min:0,
        acquire:10000

    }

}

export default dbConfig;