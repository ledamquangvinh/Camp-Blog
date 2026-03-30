import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'creator')
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.tripsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'creator')
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const trip = await this.tripsService.findOne(id);

    if (user.role !== 'admin' && trip.userId.toString() !== user.sub) {
      throw new ForbiddenException('You can only update your own trip');
    }

    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'creator')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    const trip = await this.tripsService.findOne(id);

    if (user.role !== 'admin' && trip.userId.toString() !== user.sub) {
      throw new ForbiddenException('You can only delete your own trip');
    }

    return this.tripsService.remove(id);
  }
}
