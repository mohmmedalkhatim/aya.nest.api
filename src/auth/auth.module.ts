
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import PrismaService from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "hello world",
    }),
  ],
  providers: [AuthService,
    PrismaService

  ],

  controllers: [AuthController],
  exports: [AuthService,PrismaService],
})
export class AuthModule {}
