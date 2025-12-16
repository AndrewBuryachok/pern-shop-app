import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ForumApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const project = request.params['project'];
    const apiKey = request.headers['x-api-key'];
    const envProject = process.env.APP_PROJECTS.split(',')[1];
    const envApiKey = process.env.FORUM_API_KEY;
    return project === envProject && apiKey === envApiKey;
  }
}
