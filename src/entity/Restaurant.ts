import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Dish } from "./Dish";
import { Floor } from "./Floor";
import { BookedTable } from "./bookedTable";
import { Order } from "./Order";
import { Employee } from "./Employee";

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true, default: "" })
  cover_pic: string;

  @Column({ nullable: true, default: "" })
  description: string;

  @Column({ nullable: true, default: "" })
  cta: string;

  @Column({ nullable: true, default: "" })
  phone_no: string;

  @Column({ nullable: true, default: "" })
  address: string;

  @Column({ nullable: true, default: "" })
  email: string;

  @Column({ nullable: true })
  dish_category: string;

  @OneToOne(() => User, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Dish, (dish) => dish.restaurant)
  dishes: Dish[];

  @OneToMany(() => Floor, (floor) => floor.restaurant)
  floors: Floor[];

  @OneToMany(() => BookedTable, (booking) => booking.restaurant, {
    onDelete: "CASCADE",
  })
  bookings: BookedTable[];

  @OneToMany(() => Order, (order) => order.restaurant, {
    onDelete: "CASCADE",
  })
  orders: Order[];

  @OneToMany(() => Employee, (employee) => employee.restaurant, {
    onDelete: "CASCADE",
  })
  employee: Employee[];
}
