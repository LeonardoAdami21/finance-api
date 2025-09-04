import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: { userId: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new UnauthorizedException('User unauthorized');
    }
    const { password, ...result } = user;
    return result;
  }
}
