import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { UsersController } from 'src/UsersController/users.controller';
import { UsersModule } from 'src/UsersController/user-module'; 
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]),
    BullModule.forRoot({
      redis: {
        // host: process.env.REDIS_HOST,
        // port: +process.env.REDIS_PORT,
        // port: parseInt(process.env.REDIS_PORT, 10),
        host: 'localhost',
        port: 6379, // Hardcoded port value
     
      },
    }),
    BullModule.registerQueue({
      name: 'user-delete',
    }),
    UsersModule, // Import UsersModule if you are using it in AuthModule
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService],
})
export class AuthModule {}
