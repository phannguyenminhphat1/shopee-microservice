import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('get-categories')
  async getCategories() {
    return await this.categoryService.getCategories();
  }
}
