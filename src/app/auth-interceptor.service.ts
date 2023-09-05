import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEventType,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  // เป็น function สำหรับคำขอ interceptor จะเรียกใช้ code ก่อนที่ request จะถูกส่งออกไป และก่อนที่ response จะถูกส่งไปให้ subscribe
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz'),
    });
    return next.handle(modifiedRequest); // ช่วยให้ไปขั้นตอนต่อไปได้ ถ้าไม่ใส่ request จะไม่ดำเนินการต่อ
  }
}
