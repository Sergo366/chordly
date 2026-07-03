import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { CategoriesService } from '../categories/categories.service';

export interface Tokens {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private categoriesService: CategoriesService,
  ) {}

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_SECRET || 'secretKey',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
      user: {
        id: userId,
        email,
      },
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // TTL 7 days

    await this.usersRepository.update(userId, {
      hashedRt: hash,
      rtExpiresAt: expiresAt,
    });
  }

  async signup(signupDto: SignupDto): Promise<Tokens> {
    if (signupDto.password !== signupDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = this.usersRepository.create({
      email: signupDto.email,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const tokens = await this.getTokens(savedUser.id, savedUser.email);
    await this.updateRtHash(savedUser.id, tokens.refresh_token);

    // Initialize default categories for the user
    await this.categoriesService.initUserCategories(savedUser.id);

    return tokens;
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<Tokens> {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      hashedRt: null,
      rtExpiresAt: null,
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.hashedRt || !user.rtExpiresAt) {
      throw new ForbiddenException('Access Denied');
    }

    if (new Date() > user.rtExpiresAt) {
      await this.logout(userId);
      throw new ForbiddenException('Refresh Token Expired');
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
