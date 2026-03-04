import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GhibliService } from './ghibli.service';
import { QueryGhibliDto } from './dto/query-ghibli.dto';
import { CreateGhibliDto } from './dto/create-ghibli.dto';
import { UpdateGhibliDto } from './dto/update-ghibli.dto';
import { AdminOnly } from 'src/common/decorators/admin.decorator';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Ghibli')
@ApiSecurity('api-key')
@Controller('ghibli')
export class GhibliController {
  constructor(private readonly ghibliService: GhibliService) {}

  @ApiOperation({ summary: '[Public] Liste paginée des films Ghibli' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    example: 'Fantasy',
    description: 'Filtrer par genre (ex: Fantasy, Adventure)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['released', 'upcoming'],
    description: 'Filtrer par statut de sortie',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    type: String,
    example: 'en',
    description: 'Filtrer par langue disponible (ex: en, fr, jp)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    enum: ['releaseDate', 'rating'],
    description: 'Trier par champ (ex: title, releaseDate, rating)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Ordre de tri (asc ou desc)',
  })
  @ApiResponse({ status: 200, description: 'Liste retournée avec pagination' })
  @Public()
  @Get()
  findAll(@Query() query: QueryGhibliDto) {
    return this.ghibliService.findAll(query);
  }

  @ApiOperation({ summary: '[User] Rechercher des films Ghibli' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    example: 'Totoro',
    description: 'Terme de recherche dans le titre, le réalisateur ou le synopsis',
  })
  @ApiResponse({ status: 200, description: 'Résultats de la recherche' })
  @ApiResponse({ status: 400, description: 'Paramètre de requête "q" manquant ou vide' })
  @ApiResponse({ status: 404, description: 'Aucun film trouvé correspondant à la recherche' })
  @Get('search')
  search(@Query('q') q: string) {
    if (!q?.trim())
      throw new BadRequestException('Query param "q" is required');
    return this.ghibliService.search(q.trim());
  }

  @ApiOperation({ summary: '[Public] Détails d\'un film Ghibli' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du film' })
  @ApiResponse({ status: 200, description: 'Détails du film' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ghibliService.findOne(id);
  }

  @ApiOperation({ summary: '[Admin] Créer un film Ghibli' })
  @ApiResponse({ status: 201, description: 'Film créé' })
  @ApiResponse({
    status: 403,
    description: 'Accès réservé aux administrateurs',
  })
  @ApiResponse({ status: 409, description: 'Titre déjà existant' })
  @AdminOnly()
  @Post()
  @HttpCode(201)
  create(@Body() body: CreateGhibliDto) {
    return this.ghibliService.create(body);
  }

  @ApiOperation({ summary: '[Admin] Remplacer un film Ghibli' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du film à remplacer' })
  @ApiResponse({ status: 200, description: 'Film remplacé' })
  @ApiResponse({
    status: 403,
    description: 'Accès réservé aux administrateurs',
  })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @ApiResponse({ status: 409, description: 'Titre déjà existant' })
  @AdminOnly()
  @Put(':id')
  replace(@Param('id', ParseIntPipe) id: number, @Body() body: CreateGhibliDto) {
    return this.ghibliService.replace(id, body);
  }

  @ApiOperation({ summary: '[Admin] Mettre à jour un film Ghibli' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du film à mettre à jour' })
  @ApiResponse({ status: 200, description: 'Film mis à jour' })
  @ApiResponse({
    status: 403,
    description: 'Accès réservé aux administrateurs',
  })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  @ApiResponse({ status: 409, description: 'Titre déjà existant' })
  @AdminOnly()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateGhibliDto) {
    return this.ghibliService.update(id, body);
  }

  @ApiOperation({ summary: '[Admin] Supprimer un film Ghibli' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du film à supprimer' })
  @ApiResponse({ status: 204, description: 'Film supprimé' })
  @ApiResponse({
    status: 404,
    description: 'Film non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Impossible de supprimer un film à venir',
  })
  @AdminOnly()
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.ghibliService.remove(id);
  }
}
