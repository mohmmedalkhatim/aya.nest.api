import {
  Bind,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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

  @Get('profile')
  async getProfile (@Req() req: Request) {
    return req['user']
  }
  @Public()
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
  @Post('delete_account/:id')
  async delete_user (@Param('id', ParseIntPipe) id: number) {
    return this.authService.delete_account(id)
  }
}
