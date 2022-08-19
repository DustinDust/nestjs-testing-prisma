import { Injectable } from '@nestjs/common';
import { Cat } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatDTO } from './DTO/createCat.dto';

@Injectable()
export class CatService {
  constructor(private prismaService: PrismaService) {}

  async getAllCat() {
    try {
      return await this.prismaService.cat.findMany();
    } catch (e) {
      console.log(e);
    }
  }

  async getOneCat(id: number) {
    try {
      return await this.prismaService.cat.findUnique({
        where: {
          id: id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async addCat(cat: CreateCatDTO) {
    try {
      return await this.prismaService.cat.create({
        data: {
          name: cat.name,
          breed: cat.breed,
          weight: cat.weight,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async updateCat(updateData: Cat) {
    try {
      return await this.prismaService.cat.update({
        where: {
          id: updateData.id,
        },
        data: {
          name: updateData.name,
          breed: updateData.breed,
          weight: updateData.weight,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteCat(id: number) {
    try {
      await this.prismaService.cat.deleteMany({
        where: {
          id: id,
        },
      });
      return {
        deleted: id,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
