import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { CurrentUser } from '../interfaces/current-user.interface';

@Injectable()
export class PreventAdminAsUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user as CurrentUser;

        if (user && user.roles.includes(UserRole.PLATFORM_ADMIN)) {
            throw new ForbiddenException('Admins cannot access citizen services directly');
        }

        return true;
    }
}
