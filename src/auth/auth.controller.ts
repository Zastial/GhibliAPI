import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import type { Request } from 'express';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('api-key')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '[Public] Enregistrement d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur enregistré avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà enregistré' })
  @Public()
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email);
  }

  @ApiOperation({ summary: '[Public] Connexion d\'un utilisateur existant' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email);
  }

  @ApiOperation({ summary: '[User] Récupérer les informations de son compte' })
  @ApiResponse({ status: 200, description: 'Informations du compte récupérées' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @Get('me')
  getMe(@Req() req: Request) {
    const user = (req as any).user;
    return this.authService.getMe(user.apiKey);
  }

  @ApiOperation({ summary: '[User] Regénérer la clé d\'API' })
  @ApiResponse({ status: 200, description: 'Clé d\'API regénérée' })
  @Post('regenerate-key')
  regenerateKey(@Req() req: Request) {
    return this.authService.regenerateKey((req as any).user.apiKey);
  }

  @ApiOperation({ summary: '[User] Supprimer le compte' })
  @ApiResponse({ status: 204, description: 'Compte supprimé' })
  @Delete('account')
  @HttpCode(204)
  deleteAccount(@Req() req: Request) {
    this.authService.deleteAccount((req as any).user.apiKey);
  }
}
