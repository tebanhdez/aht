import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Telemetry {

  @PrimaryGeneratedColumn()
  id: number

  @Column("double")
  reading: number
}
