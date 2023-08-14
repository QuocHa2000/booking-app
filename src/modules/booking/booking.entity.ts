import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELED = 'canceled',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room: number;

  @Column()
  client: number;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column({
    default: BookingStatus.PENDING,
    enum: Object.values(BookingStatus),
  })
  status: string;
}
