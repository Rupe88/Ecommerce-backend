import { UUIDV4 } from "sequelize";
import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, // Moved inside the decorator
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, // Add allowNull if required
  })
  declare shippingAddress: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false, // Add allowNull if required
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM('pending', 'cancelled', 'delivered', 'preparation', 'ontheway'),
    allowNull: false, // Add allowNull if required
  })
  declare orderStatus: string;
}

export default Order;
