import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema'; // Adjust import path if necessary
import { UserDeleteProcessor } from './user-delete.processor'; // Ensure path is correct

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserDeleteProcessor],
  exports: [MongooseModule], 
})
export class UsersModule {}
