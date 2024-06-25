import { UUIDV4 } from "sequelize";
import { Table, Column, DataType, Model } from "sequelize-typescript";
@Table({
  tableName: "carts",
  modelName: "Cart",
  timestamps: true,
})
class Cart extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare categoryName: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare quantity: number;
}



export default Cart;
