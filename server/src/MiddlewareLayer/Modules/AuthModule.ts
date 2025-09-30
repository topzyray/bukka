import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: Number.parseInt(
          process.env.TOKEN_EXPIRY_IN_SECONDS as string,
        ),
      },
    }),
  ],
})
export class AuthModule {}
