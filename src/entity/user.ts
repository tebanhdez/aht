import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 32 })
    username: string

    @Column({ length: 32 })
    hash: string
}
