import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UnauthorizedException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async updateRtHash(
    userId: string,
    hash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      hashedRt: hash,
      rtExpiresAt: expiresAt,
    });
  }

  async clearRtHash(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      hashedRt: null,
      rtExpiresAt: null,
    });
  }

  async updateUserData(userData: UserDto, userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const userWithNewData = { ...user, ...userData };
      return await this.userRepository.save(userWithNewData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
