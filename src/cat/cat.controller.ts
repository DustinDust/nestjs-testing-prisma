import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Cat } from '@prisma/client';
import { CatService } from './cat.service';
import { CreateCatDTO } from './DTO/createCat.dto';

@Controller('cat')
export class CatController {
  constructor(private catService: CatService) {}

  @Get()
  async getAll() {
    return await this.catService.getAllCat();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.catService.getOneCat(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('new')
  async addCat(@Body() createCatDto: CreateCatDTO) {
    return await this.catService.addCat(createCatDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update')
  async updateCat(@Body() updateCat: Cat) {
    return await this.catService.updateCat(updateCat);
  }

  @Delete(':id')
  async deleteCat(@Param('id', ParseIntPipe) id: number) {
    return await this.catService.deleteCat(id);
  }
}
