// src/common/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl } from 'accesscontrol';
import { readFileSync } from 'fs';
import { resolve } from 'path'

async function readFile(file) {
  const pathToFile = resolve(`mocks/${file}/index.json`);
  const data = await readFileSync(pathToFile, "utf-8");
  return JSON.parse(data)
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('i ma here');

    const [action, resource] = this.reflector.get<string[]>('roles', context.getHandler());

    const roleTypes = {
      "post-resource": "createOwn",
      "get-resources": "readOwn",
      "get-resource-by-id": "readOwn",
    }
   

    const request = context.switchToHttp().getRequest();
    const { params, user = {}} = request;
    // const userRoles: string[] = request.user ? request.user.roles : [];
    // const user: any = request.user ? request.user : {};
    console.log('[roles.guard] hey authorized meh lol ;)', user, params, action, resource);
    // console.log(request.header('Authorization'), '[roles.guard] header')
    params.resource = "task"
    const configType = await readFile(params.resource);
    const configJSON = configType; //JSON.parse(configType);
    const {
      rule,
      schema,
      relationships,
      transform: { create = {} },
      roles = []
    } = configJSON;

    if (!roles) {
      return true; // No roles specified, allow access
    }

    console.log('[roles.guard] roles', action, roles);

    const ac = new AccessControl(roles);
    // TODO: need to get user token here ;)

    // find the resource and action ;)
    try{
      // const permission = ac.can(user.role?.toLowerCase())[roleTypes[roleType[0]]]('donation');
      const permission = ac.can(user.role?.toLowerCase())[action](resource);
      return permission.granted;
    }catch(e){
      console.error('[Role]', e);
      return false;
    }
    // if (!permission.granted){
    //   console.log('hey not authorized meh lol ;)');
    // }

    // Add your roles and grants here
    // ac.grant('user').readOwn('profile').updateOwn('profile');
    // ac.grant('admin').extend('user').updateAny('profile').deleteAny('profile');

    // const permission = ac.can(user.role.toLowerCase()).execute(roles);
    // return true;
  }
}
