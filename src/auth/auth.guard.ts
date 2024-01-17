import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
function validateRequest(request: any): boolean | Promise<boolean> | Observable<boolean> {
  throw new Error('Function not implemented.');
}

//The logic inside the validateRequest() function can be as simple or sophisticated as needed.