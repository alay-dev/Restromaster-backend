import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @Column()
  customer_name: string;

  @Column()
  customer_phone: string;

  @Column()
  order_items: string;

  @Column()
  order_total: number;

  @Column({ default: false })
  paid: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes)
  @JoinColumn()
  restaurant: Restaurant;
}
