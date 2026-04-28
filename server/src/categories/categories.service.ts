import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCategory } from './user-category.entity';
import { CATEGORY_TYPES, TYPES } from '@fitly/shared';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(UserCategory)
    private categoriesRepository: Repository<UserCategory>,
  ) {}

  async initUserCategories(userId: string): Promise<UserCategory[]> {
    const categories: UserCategory[] = [];

    for (const categoryName of Object.values(CATEGORY_TYPES)) {
      const typesForCategory = TYPES[categoryName] || [];

      const userCategory = this.categoriesRepository.create({
        userId,
        name: categoryName,
        iconName: '',
        isHidden: false,
        categoryTypes: typesForCategory.map((typeName) => ({
          id: randomUUID(),
          name: typeName,
        })),
      });

      categories.push(userCategory);
    }

    return this.categoriesRepository.save(categories);
  }

  async findAllByUser(userId: string): Promise<UserCategory[]> {
    return this.categoriesRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async removeUserCategory(
    userId: string,
    categoryId: string,
  ): Promise<UserCategory[]> {
    await this.categoriesRepository.delete({ id: categoryId, userId });
    return this.findAllByUser(userId);
  }

  async createUserCategory(
    userId: string,
    body: {
      name: string;
      iconName?: string;
      categoryTypes?: { id: string; name: string }[];
    },
  ): Promise<UserCategory[]> {
    const userCategory = this.categoriesRepository.create({
      userId,
      name: body.name,
      iconName: body.iconName || '',
      isHidden: false,
      categoryTypes: body.categoryTypes || [],
    });

    await this.categoriesRepository.save(userCategory);
    return this.findAllByUser(userId);
  }

  async updateUserCategory(
    userId: string,
    body: Partial<UserCategory>,
  ): Promise<UserCategory[]> {
    const { id, ...updateData } = body;
    delete updateData.userId;

    await this.categoriesRepository.update({ id, userId }, updateData);
    return this.findAllByUser(userId);
  }
}
