import { ItemRepository } from './item.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemRepository])], //forRootはアプリ全体に反映させるもの、ItemRepositoryはmodule内に閉じ込めるからforFeatureを使う
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
