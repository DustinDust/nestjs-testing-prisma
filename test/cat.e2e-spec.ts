import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cat } from '@prisma/client';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { CreateCatDTO } from 'src/cat/DTO/createCat.dto';

const mockData = [
  {
    name: 'mock name 1',
    breed: 'mock breed 1',
    weight: 4,
  },
  {
    name: 'mock name 2',
    breed: 'mock breed 2',
    weight: 5,
  },
];

describe('Cat (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cat: Cat;

  const catShape = expect.objectContaining({
    id: expect.any(Number),
    name: expect.any(String),
    breed: expect.any(String),
    weight: expect.any(Number),
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();

    await prisma.cat.createMany({
      data: mockData,
    });
    cat = await prisma.cat.findFirst();
  });

  afterAll(async () => {
    await prisma.truncate(); // unsafe
    // await prisma.resetSequence(); // unsafe, not working
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /cat', () => {
    it('Fetch all cats', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/cat');

      expect(status).toEqual(200);
      expect(body).toStrictEqual(expect.arrayContaining([catShape]));
    });
    it('Fetch one cat', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/cat/${cat.id}`,
      );
      expect(status).toEqual(200);
      expect(body).toStrictEqual(catShape);
    });
  });

  describe('POST /cat', () => {
    it('Create new cat', async () => {
      const newCat: CreateCatDTO = {
        breed: 'MOCK MOCK BODY',
        name: 'test test name',
        weight: 69,
      };
      const { status, body } = await request(app.getHttpServer())
        .post('/cat/new')
        .send(newCat);
      expect(status).toEqual(HttpStatus.CREATED);
      expect(body).toStrictEqual(catShape);
    });
    it('Update cat', async () => {
      const updatedCat = {
        id: cat.id,
        name: `${cat.name} changed`,
        breed: `${cat.breed} changed`,
        weight: cat.weight + 1,
      };

      const { status, body } = await request(app.getHttpServer())
        .post('/cat/update')
        .send(updatedCat);
      expect(status).toEqual(200);
      expect(body).toStrictEqual(catShape);
    });
  });

  describe('DELETE /cat', () => {
    it('delete one cat', async () => {
      const removeId = cat.id;
      const { status, body } = await request(app.getHttpServer()).delete(
        `/cat/${removeId}`,
      );
      expect(status).toEqual(200);
      expect(body).toStrictEqual(
        expect.objectContaining({
          deleted: expect.any(Number),
        }),
      );
    });
  });
});
