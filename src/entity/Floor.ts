import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity()
export class Floor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  floor_no: number;

  @Column()
  canvas: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.floors)
  restaurant: Restaurant;
}
