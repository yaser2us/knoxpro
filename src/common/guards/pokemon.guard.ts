import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import { CombinedSlugService } from '../slug.service';

@Injectable()
export class PokemonGuard implements CanActivate {
    constructor(private slugService: CombinedSlugService) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<ExpressRequest>();
        const slug = this.slugService.getSlug(request);
        console.log('[PokemonGuard]', slug)
        request["slug"] = "www";
        if (slug) {
            request["slug"] = slug;
            // throw new BadRequestException('Invalid request. Missing slug');
        }
        return true;
    }
}