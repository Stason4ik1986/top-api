import { getJWTConfig } from './../configs/jwt.config';
import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModel } from './user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    TypegooseModule.forFeature([{
      typegooseClass: UserModel,
      schemaOptions: {
        collection: 'User',
      }
    }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    ConfigModule,
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy]

})
export class AuthModule { }
