import { ItemStatus } from './item-status.enum';
import { UserStatus } from './../auth/user-status.enum';
import { Test } from '@nestjs/testing';
import { ItemRepository } from './item.repository';
import { ItemsService } from './items.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockItemRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
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
  describe('updateStatus', () => {
    // itより外で書くことでdescribe内なら使える
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 5000,
      description: '',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };

    it('normal', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.updateStatus('test-id', mockUser2);
      expect(itemRepository.save).toHaveBeenCalled(); //saveが呼び出されれば成功、呼び出されなければ失敗っていうこと
    });

    it('abnormal: buy own product', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      expect(itemsService.updateStatus('test-id', mockUser1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 5000,
      description: '',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };

    it('normal', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.delete('test-id', mockUser1);
      expect(itemRepository.delete).toHaveBeenCalled(); //saveが呼び出されれば成功、呼び出されなければ失敗っていうこと
    });

    it("abnormal: delete other people's product", async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
