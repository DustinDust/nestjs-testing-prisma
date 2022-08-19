import { Test, TestingModule } from '@nestjs/testing';
import { Cat } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CatService } from './cat.service';
import { CreateCatDTO } from './DTO/createCat.dto';

const mockData: Cat[] = [
  {
    breed: 'mock breed 01',
    id: 1,
    name: 'mock name 01',
    weight: 4,
  },
  {
    breed: 'mock breed 02',
    id: 2,
    name: 'mock name 02',
    weight: 5,
  },
  {
    breed: 'mock breed 03',
    id: 3,
    name: 'mock name 03',
    weight: 6,
  },
];

const randomCat = mockData[0];

const testCatName = 'test_name';
const testCatBreed = 'test_breed';

const randomId = Math.floor(Math.random() * 1000);

const mockDB = {
  cat: {
    findMany: jest.fn().mockResolvedValue(mockData),
    findUnique: jest
      .fn()
      .mockImplementation(async (obj: { where: { id: number } }) => {
        return mockData.find((item) => item.id === obj.where.id);
      }),
    update: jest
      .fn()
      .mockImplementation(
        async (obj: {
          where: { id: number };
          data: { name: string; breed: string; weight: number };
        }) => {
          return {
            ...obj.where,
            ...obj.data,
          };
        },
      ),
    deleteMany: jest
      .fn()
      .mockImplementation(async (obj: { where: { id: number } }) => {
        return {
          count: 1,
        };
      }),
    create: jest
      .fn()
      .mockImplementation(async (obj: { data: CreateCatDTO }) => {
        return {
          id: randomId,
          ...obj.data,
        };
      }),
  },
};

describe('CatService', () => {
  let service: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return array of cat', async () => {
      expect(await service.getAllCat()).toEqual(mockData);
    });
  });

  describe('getOne', () => {
    it('should return one cat with the same id', async () => {
      const id = 1;
      expect(await service.getOneCat(id)).toHaveProperty('id', 1);
    });
  });

  describe('create', () => {
    it('should return the created entry', async () => {
      const testW = Math.ceil(Math.random() * 10);
      const createCatDTO: CreateCatDTO = {
        breed: testCatBreed,
        name: testCatName,
        weight: testW,
      };
      expect(await service.addCat(createCatDTO)).toEqual({
        id: randomId,
        breed: testCatBreed,
        name: testCatName,
        weight: testW,
      });
    });
  });

  describe('update', () => {
    it('should return the updated entry', async () => {
      expect(await service.updateCat(randomCat)).toEqual(randomCat);
    });
  });

  describe('delete', () => {
    it('should return the deleted id', async () => {
      expect(await service.deleteCat(randomId)).toEqual({
        deleted: randomId,
      });
    });
  });
});
