import { Controller, Get, Delete, Post, Body, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { UserCategory } from './user-category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@GetCurrentUserId() userId: string): Promise<UserCategory[]> {
    return this.categoriesService.findAllByUser(userId);
  }

  @Delete()
  async deleteCategory(
    @GetCurrentUserId() userId: string,
    @Body() body: { categoryId: string },
  ): Promise<UserCategory[]> {
    return this.categoriesService.removeUserCategory(userId, body.categoryId);
  }

  @Patch('/update-category')
  async updateCategory(
    @GetCurrentUserId() userId: string,
    @Body() body: Partial<UserCategory>,
  ): Promise<UserCategory[]> {
    return this.categoriesService.updateUserCategory(userId, body);
  }

  @Post()
  async createCategory(
    @GetCurrentUserId() userId: string,
    @Body()
    body: {
      name: string;
      iconName?: string;
      categoryTypes?: { id: string; name: string }[];
    },
  ): Promise<UserCategory[]> {
    return this.categoriesService.createUserCategory(userId, body);
  }
}
