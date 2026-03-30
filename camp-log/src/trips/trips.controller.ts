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
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripOwnerGuard } from 'src/common/guards/trip-owner.guard';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'creator')
  create(@Body() createTripDto: CreateTripDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.tripsService.create(createTripDto, user.sub);
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
  @UseGuards(RolesGuard, TripOwnerGuard)
  @Roles('admin', 'creator')
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard, TripOwnerGuard)
  @Roles('admin', 'creator')
  async remove(@Param('id') id: string) {
    return this.tripsService.remove(id);
  }
}
