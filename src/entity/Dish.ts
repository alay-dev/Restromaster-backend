import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity()
export class Dish {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes)
  @JoinColumn()
  restaurant: Restaurant;
}
