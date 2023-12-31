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
  phone_no: string;

  @Column({ nullable: true, default: "" })
  address: string;

  @Column({ nullable: true, default: "" })
  email: string;

  @Column({ nullable: true })
  dish_category: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Dish, (dish) => dish.restaurant)
  dishes: Dish[];

  @OneToMany(() => Floor, (floor) => floor.restaurant)
  floors: Floor[];
}
