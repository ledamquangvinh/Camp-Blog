import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TripsService } from '../../trips/trips.service';

@Injectable()
export class TripOwnerGuard implements CanActivate {
  constructor(private tripsService: TripsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tripId = request.params.id;

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // Admin can bypass
    if (user.role === 'admin') {
      return true;
    }

    const trip = await this.tripsService.findOwnerById(tripId);

    if (!trip) {
      throw new ForbiddenException('Trip not found');
    }

    if (trip.userId.toString() !== user.sub) {
      throw new ForbiddenException('You do not own this trip');
    }

    return true;
  }
}
