import { UUIDV4 } from "sequelize";
import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: 'users',
  modelName: 'User',
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, // Username should not be NULL
  })
  declare username: string;

  @Column({
    type: DataType.ENUM("customer", "admin"),
    defaultValue: "customer",
    allowNull: false, // Role should not be NULL
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, // Email should not be NULL
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, // Password should not be NULL
  })
  declare password: string;
}

export default User;
