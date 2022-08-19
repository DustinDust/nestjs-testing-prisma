import { Test } from '@nestjs/testing';
import { Cat } from '@prisma/client';
import { PrismaModule } from '../prisma/prisma.module';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CreateCatDTO } from './DTO/createCat.dto';

const mockCatData: Cat[] = [
  {
    breed: 'mock breed 01',
    id: 1,
    name: 'mock cat 01',
    weight: 13,
  },
  {
    breed: 'mock breed 02',
    id: 2,
    name: 'mock cat 02',
    weight: 15,
  },
];

const randomId = Math.floor(Math.random() * 10000);

describe('CatController', () => {
  let catController: CatController;
  let catService: CatService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        {
          provide: CatService,
          useValue: {
            getAllCat: jest.fn().mockResolvedValue(mockCatData),
            getOneCat: jest.fn().mockImplementation(async (id: number) => {
              return {
                name: 'mock name to be found',
                breed: 'mock breed to be found',
                id: id, // id to be found
                weight: 14, // to be found,
              };
            }),
            addCat: jest
              .fn()
              .mockImplementation((createCatDTO: CreateCatDTO) => {
                return {
                  id: randomId,
                  ...createCatDTO,
                };
              }),
            deleteCat: jest.fn().mockImplementation((id: number) => {
              return {
                deleted: id,
              };
            }),
            updateCat: jest.fn().mockImplementation((updateData: Cat) => {
              return {
                ...updateData,
              };
            }),
          },
        },
      ],
      imports: [PrismaModule],
    }).compile();
    catService = moduleRef.get<CatService>(CatService);
    catController = moduleRef.get<CatController>(CatController);
  });

  it('Should be defined', () => {
    expect(catController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      expect(await catController.getAll()).toEqual(mockCatData);
    });
  });

  describe('find One', () => {
    const fId = 69420;
    it('Should return one cat instance with the data', async () => {
      expect(await catController.getOne(fId)).toEqual({
        id: fId,
        name: 'mock name to be found',
        breed: 'mock breed to be found',
        weight: 14,
      });
    });
  });

  describe('create one', () => {
    it('Should return the created cat', async () => {
      const mockCatDTO: CreateCatDTO = {
        breed: 'mock breed to be created',
        name: 'mock name to be created',
        weight: 32.1,
      };

      expect(await catController.addCat(mockCatDTO)).toEqual({
        id: randomId,
        ...mockCatDTO,
      });
    });
  });

  describe('delete one', () => {
    it("Should return the deleted Cat's id", async () => {
      const deletedCatId = Math.floor(Math.random() * 1000);

      expect(await catController.deleteCat(deletedCatId)).toEqual({
        deleted: deletedCatId,
      });
    });
  });
});
