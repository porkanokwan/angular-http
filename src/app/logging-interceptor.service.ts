import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Outgoing req', req.url);
    console.log('Headers req', req.headers);
    return next.handle(req).pipe(
      // handle return ออกมาเป็น Observable ทำให้เราใช้ operators ในการ Transform data ก่อนส่งไปให้ subscribe ได้
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log('Incoming response', event.body);
        }
      })
    );
  }
}
