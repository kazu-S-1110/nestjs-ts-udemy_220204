import { ItemsService } from './items.service';
import { Controller, Get } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
