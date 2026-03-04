import { Module } from '@nestjs/common';
import { GhibliController } from './ghibli.controller';
import { GhibliService } from './ghibli.service';

@Module({
  controllers: [GhibliController],
  providers: [GhibliService],
})
export class GhibliModule {}
