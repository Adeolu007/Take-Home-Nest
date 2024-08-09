import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema'; 

@Processor('user-delete')
@Injectable()
export class UserDeleteProcessor {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Process()
  async handleDelete(job: Job) {
    const userId = job.data.userId;
    await this.userModel.findByIdAndDelete(userId);
  }
}
