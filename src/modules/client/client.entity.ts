import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Role } from '../auth/enum/role.enum';

export enum ClientStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  INACTIVE = 'inactive',
}

export enum ClientGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: '' })
  rawName: string;

  @Column({ default: null })
  latestCodeTime: number;

  @Column({ default: '' })
  activateCode: string;

  @Column()
  password: string;

  @Column({ default: ClientStatus.INACTIVE, enum: Object.values(ClientStatus) })
  status: string;

  @Column({ enum: Object.values(ClientGender) })
  gender: string;

  @Column({ default: Role.Client })
  role: string;
}
