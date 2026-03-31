import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = request.params.id;

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // Admin can access any resource
    if (user.role === 'admin') {
      return true;
    }

    // User can only access their own resource
    if (user.sub === paramId) {
      return true;
    }

    throw new ForbiddenException('Access denied');
  }
}