import { ItemStatus } from './item-status.enum';
import { UserStatus } from './../auth/user-status.enum';
import { Test } from '@nestjs/testing';
import { ItemRepository } from './item.repository';
import { ItemsService } from './items.service';
import { NotFoundException } from '@nestjs/common';

const mockItemRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
});

const mockUser1 = {
  id: '1',
  username: 'test1',
  password: '1234',
  status: UserStatus.PREMIUM,
  items: [],
};
const mockUser2 = {
  id: '2',
  username: 'test2',
  password: '1234',
  status: UserStatus.FREE,
  items: [],
};

describe('ItemsServiceTest', () => {
  let itemsService: ItemsService;
  let itemRepository;
  beforeEach(async () => {
    // インスタンス化する。
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemRepository,
          useFactory: mockItemRepository,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  describe('findAll', () => {
    it('Normal', async () => {
      const expected = [];
      itemRepository.find.mockResolvedValue(expected);
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('Normal', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.findOne.mockResolvedValue(expected);
      const result = await itemsService.findById('test-id');
      expect(result).toEqual(expected);
    });

    it('abnormal', async () => {
      itemRepository.findOne.mockResolvedValue(null);
      await expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('normal', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        description: '',
        price: 5000,
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.createItem.mockResolvedValue(expected);
      const result = await itemsService.create(
        {
          name: 'PC',
          price: 5000,
          description: '',
        },
        mockUser1,
      );
      expect(result).toEqual(expected);
    });
  });
});
