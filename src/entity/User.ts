import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { hash } from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
