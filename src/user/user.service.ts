import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    private users: { [key: string]: string } = {};

    registerUser(username: string, password: string): void {
        this.users[username] = password;
    }

    loginUser(username: string, password: string): boolean {
        return this.users[username] === password;
    }
}
