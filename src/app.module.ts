import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { GhibliModule } from './ghibli/ghibli.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AdminGuard } from './common/guards/admin.guard';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/guards/api-key.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000,
          limit: 1000,
        },
      ],
    }),
    StorageModule,
    GhibliModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: AdminGuard },
  ],
})
export class AppModule {}
