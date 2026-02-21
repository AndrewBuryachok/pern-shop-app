import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ForumApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.headers['x-api-key'] === process.env.FORUM_API_KEY;
  }
}
