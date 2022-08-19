import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { PrismaModule } from './prisma/prisma.module';
import { CatService } from './cat/cat.service';

@Module({
  imports: [CatModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, CatService],
})
export class AppModule {}
