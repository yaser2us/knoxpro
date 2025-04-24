// src/scripts/seed.ts
import { DataSource } from 'typeorm';
import { 
    User,
    Workspace,
    Role,
    UserRole,
    ResourceAction,
    ResourceType,
    RolePermission,
    AccessPolicy
} from '../pulse/entity';

import { config } from 'dotenv';
config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Workspace,
    Role,
    UserRole,
    ResourceType,
    ResourceAction,
    RolePermission,
    AccessPolicy,
  ],
  synchronize: true, // NOTE: don't use this in prod
});

async function seed() {
  await dataSource.initialize();

  const workspace = await dataSource.getRepository(Workspace).save({
    id: 'mega-lab',
    name: 'MegaLab',
  });

  const users = await dataSource.getRepository(User).save([
    {
      id: 'user-a',
      email: 'a@example.com',
      name: 'User A',
      domain: 'customer',
      metadata: { geo: 'MY', specialty: 'blood' },
    },
    {
      id: 'doctor-x',
      email: 'x@lab.com',
      name: 'Dr. X',
      domain: 'lab',
      metadata: { geo: 'MY', specialty: 'blood' },
    },
  ]);

  const roles = await dataSource.getRepository(Role).save([
    { id: 'role-patient', name: 'patient', workspace },
    { id: 'role-doctor', name: 'doctor', workspace },
  ]);

  await dataSource.getRepository(UserRole).save([
    { user: users[0], workspace, role: roles[0] },
    { user: users[1], workspace, role: roles[1] },
  ]);

  const resourceType = await dataSource.getRepository(ResourceType).save({
    id: 'lab-report-type',
    name: 'lab_report',
    workspace,
  });

  await dataSource.getRepository(ResourceAction).save([
    { resourceType, actionName: 'view' },
    { resourceType, actionName: 'edit' },
  ]);

  await dataSource.getRepository(RolePermission).save({
    role: roles[1],
    resourceType,
    actionName: 'view',
  });

  await dataSource.getRepository(AccessPolicy).save({
    name: 'Blood Report Viewer',
    resourceType: 'lab_report',
    actionType: 'view',
    conditions: {
      geo: ['MY'],
      specialty: 'blood',
    },
  });

  console.log('✅ Seeding complete');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed', err);
  process.exit(1);
});
