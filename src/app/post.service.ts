import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  // เป็นประโยชน์เมื่อมีหลายตำแหน่งใน application ที่ต้อง handling error
  errors = new Subject<string>();

  constructor(private http: HttpClient) {}

  creatAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    // การเติม /posts.json ต่อท้าย url เป็นสิ่งที่ firebase require
    this.http
      .post<{ name: string }>(
        'https://angular-http-44c47-default-rtdb.firebaseio.com/posts.json',
        postData,
        { observe: 'response' }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData); // HTTP Response{body: {name: "-NdYUIzcvEABYwQHGHEU"}, headers: {}, ...}
        },
        (error) => {
          this.errors.next(error.message);
        }
      ); // post() return ออกมาเป็น Observable เลยต้อง subscribe ให้ observer ทำงาน เพื่อที่จะได้ส่งคำขอนี้ไป และรับข้อมูลที่ response กลับมาใช้ต่อ ถ้าไม่ใส่ subscribe rxjs กับ angular จะคิดว่าไม่มีใครสนใจคำขอนี้เลยไม่มีการส่งคำขอออกไป
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams.append('print', 'pretty');
    searchParams.append('mode', 'add');
    return (
      this.http
        .get<{ [key: string]: Post }>(
          'https://angular-http-44c47-default-rtdb.firebaseio.com/posts.json',
          {
            headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
            params: searchParams,
          }
        )
        // map ช่วยรับข้อมูลบางส่วนและส่งคืนข้อมูลใหม่ ซึ่งถูกรวมเข้ากับ subscribe (ถ้าไม่รวมจะไม่สามารถรับข้อมูลได้) ซึ่งมันรับเป็นข้อมูล response และ return เป็นข้อมูลที่ transform แล้ว
        .pipe(
          map((reponseData) => {
            const postsArr: Post[] = [];
            console.log(reponseData); //{"-NdYUIzcvEABYwQHGHEU": {"content": "This is POST!", "title": "Test"} }
            for (const key in reponseData) {
              if (reponseData.hasOwnProperty(key)) {
                postsArr.push({ ...reponseData[key] }); // เพิ่ม new obj
              }
            }
            return postsArr;
          }),
          catchError((errorRes) => {
            return throwError(errorRes);
          })
        ) // เป็น method ใน observable ที่จะช่วย transform ข้อมูลผ่าน operator ของ observable ก่อนไป subscribe
    );
  }

  clearPosts() {
    return this.http
      .delete(
        'https://angular-http-44c47-default-rtdb.firebaseio.com/posts.json',
        { observe: 'events' } // ช่วยให้ run code บางส่วนได้โดยไม่เปลี่ยนแปลงการตอบสนอง
      )
      .pipe(
        tap((event) => {
          console.log(event);
          // อันนี้เราต้องการ check type ว่าเราส่ง request ไปยัง
          if (event.type === HttpEventType.Sent) {
            // logic จัดการแจ้ง user ว่า ส่ง request แล้ว
            console.log('Sent Success');
          }
          // อันนี้เราต้องการ check type ว่าเราได้รับ response คืนมาหรือไม่
          if (event.type === HttpEventType.Response) {
            console.log('Response body: ', event.body);
          }
        })
      );
  }
}
