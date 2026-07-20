import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Season } from '../common/clothes';
import { Sale } from '../sales/entities/sale.entity';

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

  @Column({ type: 'text', nullable: true, default: null })
  size: string | number | null;

  @Column({ type: 'text', nullable: true, default: null })
  brand: string | null;

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
  sale: Sale | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
