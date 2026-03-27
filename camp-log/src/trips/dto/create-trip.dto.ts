import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsNumber,
  ValidateNested,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

// ===== ENUMS =====
export enum TerrainType {
  SAND = "sand",
  MUD = "mud",
  GRAVEL = "gravel",
  GRASS = "grass",
  ROCK = "rock",
  MIXED = "mixed",
}

export enum Weather {
  SUNNY = "sunny",
  RAINY = "rainy",
  CLOUDY = "cloudy",
  STORM = "storm",
}

// ===== NESTED DTOs =====
export class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class VehicleDto {
  @IsString()
  name: string;

  @IsBoolean()
  is4x4: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}

export class MediaDto {
  @IsString()
  url: string;

  @IsEnum(["image", "video"])
  type: "image" | "video";

  @IsOptional()
  @IsString()
  caption?: string;
}

// ===== MAIN DTO =====
export class CreateTripDto {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(TerrainType)
  terrainType: TerrainType;

  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media: MediaDto[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsEnum(Weather)
  weather?: Weather;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
