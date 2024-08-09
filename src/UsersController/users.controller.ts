import { Controller, Delete, Put, Param, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard'; 
import { AuthService } from 'src/auth/auth.service'; 
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto'; 
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @InjectQueue('user-delete') private readonly userDeleteQueue: Queue,
    private readonly authService: AuthService) {}

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Req() req,
  ) {
    if (req.userId !== id) {
      throw new UnauthorizedException('You can only update your own account');
    }
    return this.authService.updateUser(id, updateData);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Req() req,
  ) {
    if (req.userId !== id) {
      throw new UnauthorizedException('You can only delete your own account');
    }
    
    // Enqueue a delete job
    await this.userDeleteQueue.add({
      userId: id,
    });

    return { message: 'User deletion request has been queued' };
  }
}
