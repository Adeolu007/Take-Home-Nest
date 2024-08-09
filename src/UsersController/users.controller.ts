import { Controller, Put, Param, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard'; 
import { AuthService } from 'src/auth/auth.service'; 
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto'; 

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

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
}
