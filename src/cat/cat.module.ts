import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';

@Module({
  controllers: [CatController],
  providers: [CatService, PrismaService],
  imports: [PrismaModule],
})
export class CatModule {}
