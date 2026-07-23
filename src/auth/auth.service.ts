import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scrypt, timingSafeEqual, createHash } from 'crypto';
import { Model } from 'mongoose';
import { promisify } from 'util';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthSession,
  AuthSessionDocument,
} from './schemas/auth-session.schema';
import { User, UserDocument } from './schemas/user.schema';
import { AuthenticatedUser } from './auth.types';

const scryptAsync = promisify(scrypt);
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(AuthSession.name)
    private readonly sessionModel: Model<AuthSessionDocument>,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const displayName = dto.displayName?.trim() || email.split('@')[0];

    try {
      const user = await this.userModel.create({
        email,
        displayName,
        passwordHash: await this.hashPassword(dto.password),
      });
      return this.createSession(user);
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException('This email is already registered');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email.trim().toLowerCase() })
      .select('+passwordHash');

    if (
      !user ||
      !(await this.verifyPassword(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createSession(user);
  }

  async getUserFromAccessToken(token: string): Promise<AuthenticatedUser> {
    const session = await this.sessionModel.findOne({
      tokenHash: this.hashToken(token),
      expiresAt: { $gt: new Date() },
    });

    if (!session)
      throw new UnauthorizedException('Access token is invalid or expired');

    const user = await this.userModel.findById(session.userId);
    if (!user) throw new UnauthorizedException('User no longer exists');

    return this.toAuthenticatedUser(user);
  }

  private async createSession(user: UserDocument) {
    const accessToken = randomBytes(48).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await this.sessionModel.create({
      userId: user._id.toString(),
      tokenHash: this.hashToken(accessToken),
      expiresAt,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresAt: expiresAt.toISOString(),
      user: this.toAuthenticatedUser(user),
    };
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, storedHash: string) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;

    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedKey = Buffer.from(hash, 'hex');
    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private toAuthenticatedUser(user: UserDocument): AuthenticatedUser {
    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    };
  }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
