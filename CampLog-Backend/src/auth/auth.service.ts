import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<{ token: string }> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = {
      sub: user._id.toString(),
      role: user.role,
      name: user.name,
    };

    // Sign token
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
