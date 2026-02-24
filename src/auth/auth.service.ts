import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import crypt from 'bcrypt'
import PrismaService from '../prisma/prisma.service'
import { CreateUserDto, SignInUserDto } from '../zod'
import 'dotenv/config'

@Injectable()
export class AuthService {
  constructor (private jwtService: JwtService, private prisma: PrismaService) {}

  async signIn ({
    email,
    password,
  }: SignInUserDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (user) {
      let pass = crypt.compare(password, user.password)
      if (!pass) {
        throw new UnauthorizedException()
      }
      const payload = { sub: user.id, email: user.email }
      return {
        // 💡 Here the JWT secret key that's used for signing the payload
        // is the key that was passsed in the JwtModule
        access_token: await this.jwtService.signAsync(payload),
      }
    }else{
      throw new HttpException("conldn't find the user",HttpStatus.NOT_FOUND)
    }
  }

  async registor (user: CreateUserDto): Promise<{ access_token: string }> {
    let salt = await crypt.genSalt(crypt.getRounds(user.email))
    try {
      const User = await this.prisma.user.create({
        data: {
    
          email: user.email,
          password: crypt.hashSync(user.password, salt),
        },
      })
      const payload = { sub: user.id, email: user.email }
      return {
        // 💡 Here the JWT secret key that's used for signing the payload
        // is the key that was passsed in the JwtModule
        access_token: await this.jwtService.signAsync(payload),
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.SERVICE_UNAVAILABLE)
    }
  }
}
