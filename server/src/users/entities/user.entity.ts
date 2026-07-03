import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Clothing } from '../../clothes/clothing.entity';
import { UserCategory } from '../../categories/user-category.entity';
import { Currency } from '../../sales/entities/sale.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  hashedRt: string | null;

  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  surname: string | null;

  @Column({ nullable: true })
  fullName: string | null;

  @Column({ type: 'date', nullable: true })
  birthday: Date | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ nullable: true })
  profileImg: string | null;

  @Column({ nullable: true })
  location: string | null;

  @Column({ type: 'enum', enum: Currency })
  currencyPreference: Currency;

  @Column({ type: 'timestamptz', nullable: true })
  @Exclude()
  rtExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Clothing, (clothing) => clothing.user)
  clothes: Clothing[];

  @OneToMany(() => UserCategory, (category) => category.user)
  categories: UserCategory[];
}
