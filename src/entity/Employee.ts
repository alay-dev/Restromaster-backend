import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  created_at: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  designation: string;

  @Column()
  date_of_birth: Date;

  @Column()
  photo: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.employee)
  @JoinColumn()
  restaurant: Restaurant;
}
