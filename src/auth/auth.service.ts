import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from './dto/user.dto';
import { StorageService } from 'src/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly storage: StorageService) {}

  register(email: string): { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');

    if (users.some((u) => u.email === email)) {
      throw new ConflictException(`Email ${email} is already registered`);
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      role: UserRole.USER,
      apiKey: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.storage.write('users.json', [...users, newUser]);
    return { apiKey: newUser.apiKey };
  }

  login(email: string): User {
    const users = this.storage.read<User[]>('users.json');
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  regenerateKey(apiKey: string): { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');
    const index = users.findIndex((u) => u.apiKey === apiKey);
    if (index === -1) throw new NotFoundException('User not found');

    const newKey = uuidv4();
    users[index] = { ...users[index], apiKey: newKey };
    this.storage.write('users.json', users);
    return { apiKey: newKey };
  }

  findByApiKey(apiKey: string): User | undefined {
    return this.storage
      .read<User[]>('users.json')
      .find((u) => u.apiKey === apiKey);
  }

  getMe(apiKey: string): Omit<User, 'apiKey'> {
    const user = this.findByApiKey(apiKey);
    if (!user) throw new NotFoundException('User not found');
    const { apiKey: _, ...result } = user;
    return result;
  }

  deleteAccount(apiKey: string): void {
    const users = this.storage.read<User[]>('users.json');
    const index = users.findIndex((u) => u.apiKey === apiKey);
    if (index === -1) throw new NotFoundException('User not found');

    users.splice(index, 1);
    this.storage.write('users.json', users);
  }
}
