import User from "./database/models/userModel"
import bcrypt from "bcryptjs";
const adminSeeder=async():Promise<void>=>{
  const [data]=  await User.findAll({
        where:{
            email:"admin1@gmail.com"
        }
    })
    if(!data){
        await User.create({
            email:"admin1@gmail.com",
            password:bcrypt.hashSync("adminpassword", 10),
            username:"admin-bro",
            role:"admin"

        })
        console.log("admin credentils seeded success")
    }else{
        console.log("admin credentials already seeded ")
    }
}

export default adminSeeder;