import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity()
export class BookedTable {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  customer_name: string;

  @Column()
  phone_no: string;

  @Column()
  table_id: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column({ nullable: true, default: "" })
  note: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.bookings)
  restaurant: Restaurant;
}
