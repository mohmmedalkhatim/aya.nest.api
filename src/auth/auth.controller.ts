import {
  Bind,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { Public } from './decoraters'
import * as zod from '../zod'
import { ZodValidationPipe } from './create_user.pipe'

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile (@Req() req) {
    return req.user
  }
  @Post('register')
  @UsePipes(new ZodValidationPipe(zod.CreateUserSchame))
  async register (@Body() data: zod.CreateUserDto) {
    return this.authService.registor(data)
  }
  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(zod.SignInUserSchame))
  async sign_in (@Body() data: zod.SignInUserDto) {
    return this.authService.signIn(data)
  }
}
