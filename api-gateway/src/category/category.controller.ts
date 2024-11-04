import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('category')
export class CategoryController {
  constructor(
    @Inject('CATEGORY_SERVICE') private categoryService: ClientProxy,
  ) {}

  @Get('get-categories')
  async getCategories() {
    return await lastValueFrom(this.categoryService.send('get-categories', ''));
  }
}
