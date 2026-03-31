import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip, TripDocument } from '../schema/trip.schema';

@Injectable()
export class TripsService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<TripDocument>) {}

  // CREATE
  async create(createTripDto: CreateTripDto, userId: string): Promise<Trip> {
    const createdTrip = new this.tripModel({
      ...createTripDto,
      userId,
    });

    return createdTrip.save();
  }

  // READ ALL
  async findAll(query: any): Promise<Trip[]> {
    const filter: any = {
      deletedAt: null,
    };

    // Filter by terrain
    if (query.terrainType) {
      filter.terrainType = query.terrainType;
    }

    // Filter by location (partial match, case-insensitive)
    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    // Filter by tag
    if (query.tag) {
      filter.tags = query.tag;
    }

    return this.tripModel.find(filter).populate('userId', 'name role').exec();
  }

  // READ ONE
  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripModel
      .findById(id)
      .populate('userId', 'name role')
      .exec();

    if (!trip || trip.deletedAt) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  //find Owner of teh trip by id
  async findOwnerById(id: string): Promise<{ userId: any } | null> {
    return this.tripModel
      .findById(id)
      .select('userId') // ONLY fetch owner
      .exec();
  }

  // READ MY TRIPS
  async findByUser(userId: string): Promise<Trip[]> {
    return this.tripModel
      .find({
        userId,
        // $or: [
        //   { userId: userId }, // for string-stored userId
        //   { userId: new Types.ObjectId(userId) }, // for ObjectId-stored userId
        // ],
        deletedAt: null,
      })
      .populate('userId', 'name role')
      .exec();
  }

  // UPDATE
  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.tripModel.findById(id).exec();

    if (!trip || trip.deletedAt) {
      throw new NotFoundException('Trip not found');
    }

    // Merge top-level fields
    Object.assign(trip, updateTripDto);

    // Merge nested vehicle if exists
    if (updateTripDto.vehicle) {
      trip.vehicle = {
        ...trip.vehicle,
        ...updateTripDto.vehicle,
      };
    }

    // Merge coordinates if exists
    if (updateTripDto.coordinates) {
      trip.coordinates = {
        ...trip.coordinates,
        ...updateTripDto.coordinates,
      };
    }

    // Replace media if provided (simple approach)
    if (updateTripDto.media) {
      trip.media = updateTripDto.media as any;
    }

    return trip.save();
  }

  // DELETE (soft delete)
  async remove(id: string): Promise<{ message: string }> {
    const trip = await this.tripModel.findById(id).exec();

    if (!trip || trip.deletedAt) {
      throw new NotFoundException('Trip not found');
    }

    trip.deletedAt = new Date();
    await trip.save();

    return { message: 'Trip deleted successfully' };
  }
}
