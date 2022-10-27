import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from '../../user/user.service';
import { UserFromRequest } from '../../auth/dto/user.request.dto';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserFromRequest = request.user;
    const fullUserData = await this.usersService.findOne(user.sub);
    return fullUserData.isAdmin;
  }
}
