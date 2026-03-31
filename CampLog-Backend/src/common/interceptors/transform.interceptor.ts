import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Handle array
        if (Array.isArray(data)) {
          data = data.map((item) => transformItem(item));
        } else {
          data = transformItem(data);
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}

function transformItem(item: any) {
  if (!item) return item;

  const obj = item.toObject ? item.toObject() : item;

  // Rename userId → user
  if (obj.userId) {
    obj.user = obj.userId;
    delete obj.userId;
  }

  // Remove Mongo noise
  delete obj.__v;

  return obj;
}