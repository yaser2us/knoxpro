import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: 'admin',
      "id": "a1f39dc1-b99d-4101-aeb8-09f8e97430ea", //"8e1dd9b4-dc1e-4140-9c92-39a5db38bc11",  // doctor-x
      "workspaceId": "d9f8ec62-bb8b-4f7d-a192-c0a4c71f30dd",
      "metadata": {
        "geo": "SG",
        "specialty": "blood"
      }
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: 'guess'
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username && user.password === password);
  }

}
