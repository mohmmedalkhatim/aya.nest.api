import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import crypt from 'bcrypt'
import PrismaService from '../prisma/prisma.service'
import { CreateUserDto, SignInUserDto } from '../zod'

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
  }

  async registor (user: CreateUserDto): Promise<{ access_token: string }> {
    const User = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    })
    let pass = crypt.compare(user.password, user.password)
    if (!pass) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user.id, email: user.email }
    return {
      // 💡 Here the JWT secret key that's used for signing the payload
      // is the key that was passsed in the JwtModule
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
