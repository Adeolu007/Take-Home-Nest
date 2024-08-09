import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { UsersController } from 'src/users-controller/users.controller';
import { UsersModule } from 'src/users-controller/user-module'; 
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]),

    // BullModule.forRoot({
    //   redis: {
    //     // host: process.env.REDIS_HOST,
    //     // port: +process.env.REDIS_PORT,
    //     // host: process.env.REDIS_HOST,
    //     // port: +process.env.REDIS_PORT, // Ensure conversion from string to number
    //     // port: parseInt(process.env.REDIS_PORT, 10),
    //     // host: 'localhost',
    //     // port: 6379, // Hardcoded port value
    //     host: configService.get<string>('redis.host'),
    //     port: configService.get<number>('redis.port'),
    //   },
    // }),
    BullModule.registerQueue({
      name: 'user-delete',
    }),
    UsersModule, // Import UsersModule if you are using it in AuthModule
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService],
})
export class AuthModule {}
