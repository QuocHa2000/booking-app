import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ManagerStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rawName: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    default: ManagerStatus.ACTIVE,
    enum: Object.values(ManagerStatus),
  })
  status: string;
}
