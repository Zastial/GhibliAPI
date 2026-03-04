import { PartialType } from '@nestjs/mapped-types';
import { CreateGhibliDto } from './create-ghibli.dto';

export class UpdateGhibliDto extends PartialType(CreateGhibliDto) {}
