import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '@dpi/common';

/**
 * Users Service
 * Handles CRUD operations for users
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Find user by Google ID
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find user by mobile number
   */
  async findByMobile(mobile: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { mobile } });
  }

  /**
   * Find or create user from Google OAuth
   */
  async findOrCreateGoogleUser(data: {
    googleId: string;
    email: string;
    fullName: string;
    picture?: string;
  }): Promise<User> {
    // Try to find existing user by Google ID
    let user = await this.findByGoogleId(data.googleId);

    if (user) {
      // Update user info (in case name or picture changed)
      user.fullName = data.fullName;
      user.picture = data.picture;
      user.emailVerified = true;
      user.lastLoginAt = new Date();
      return this.userRepository.save(user);
    }

    // Try to find by email (user might have registered via OTP first)
    user = await this.findByEmail(data.email);

    if (user) {
      // Link Google account to existing user
      user.googleId = data.googleId;
      user.picture = data.picture;
      user.emailVerified = true;
      user.lastLoginAt = new Date();
      return this.userRepository.save(user);
    }

    // Create new user
    const newUser = this.userRepository.create({
      googleId: data.googleId,
      email: data.email,
      fullName: data.fullName,
      picture: data.picture,
      emailVerified: true,
      roles: [UserRole.CITIZEN],
      lastLoginAt: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Find or create user from Mobile OTP
   */
  async findOrCreateMobileUser(mobile: string, fullName?: string): Promise<User> {
    // Try to find existing user by mobile
    let user = await this.findByMobile(mobile);

    if (user) {
      // Update mobile verification and last login
      user.mobileVerified = true;
      user.lastLoginAt = new Date();
      return this.userRepository.save(user);
    }

    // Create new user
    const newUser = this.userRepository.create({
      mobile,
      fullName: fullName || `User ${mobile.substring(mobile.length - 4)}`, // Default name
      mobileVerified: true,
      roles: [UserRole.CITIZEN],
      lastLoginAt: new Date(),
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Update user information
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  /**
   * Add role to user
   */
  async addRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      return this.userRepository.save(user);
    }

    return user;
  }

  /**
   * Remove role from user
   */
  async removeRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = user.roles.filter((r) => r !== role);
    return this.userRepository.save(user);
  }
}
