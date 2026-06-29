import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Season } from '../common/clothes';
import { Sale } from './sale.entity';

@Entity()
export class Clothing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  userTitle: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  category: string;

  @Column('simple-array', { nullable: true })
  seasons: Season[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  ticker: string;

  @ManyToOne(() => User, (user) => user.clothes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ default: false })
  isFavorite: boolean;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ default: false })
  isForSale: boolean;

  @OneToOne(() => Sale, (sale) => sale.clothing, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  sale: Sale;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
