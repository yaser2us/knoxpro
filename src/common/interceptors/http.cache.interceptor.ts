import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const { slug } = context.switchToHttp().getRequest();

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    console.log('[cache]', isGetRequest, slug);

    const excludePaths: string[] = [
      // Routes to be excluded
    ];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes((httpAdapter.getRequestUrl(request) as any) || '')
      )
    ) {
      return undefined;
    }
    return httpAdapter.getRequestUrl(request);
  }
}