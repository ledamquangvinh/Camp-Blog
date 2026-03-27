import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Re-import nested DTOs from CreateTripDto
import {
  VehicleDto,
  MediaDto,
  CoordinatesDto,
} from './create-trip.dto';

// Make nested DTOs partial as well
class PartialVehicleDto extends PartialType(VehicleDto) {}
class PartialMediaDto extends PartialType(MediaDto) {}
class PartialCoordinatesDto extends PartialType(CoordinatesDto) {}

export class UpdateTripDto extends PartialType(CreateTripDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialCoordinatesDto)
  coordinates?: CoordinatesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PartialVehicleDto)
  vehicle?: VehicleDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PartialMediaDto)
  media?: MediaDto[];
}
