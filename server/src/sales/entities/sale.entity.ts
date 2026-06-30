import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Clothing } from '../../clothes/clothing.entity';

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  UAH = 'UAH',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isNegotiable: boolean;

  @OneToOne(() => Clothing)
  @JoinColumn()
  clothing: Clothing;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
