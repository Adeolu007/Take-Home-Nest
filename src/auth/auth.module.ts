import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { UsersController } from 'src/UsersController/users.controller';
@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema
  },
  {
    name: RefreshToken.name,
    schema: RefreshTokenSchema
  }
])],
  controllers: [AuthController, UsersController],
  providers: [AuthService],
})
export class AuthModule {}
