import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  errorMessage = null;

  private errorSub: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    // Handling Error with Subject
    this.errorSub = this.postService.errors.subscribe((error) => {
      this.errorMessage = error;
    });

    // this.fetchPost();
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  onCreatePost(postData: Post) {
    // Send Http request
    // console.log(postData); // {"title": "test","content": "test some content"}
    // การเติม /posts.json ต่อท้าย url เป็นสิ่งที่ firebase require
    // this.http
    //   .post<{ name: string }>(
    //     'https://angular-http-44c47-default-rtdb.firebaseio.com/posts.json',
    //     postData
    //   )
    //   .subscribe((responseData) => {
    //     console.log(responseData); // {name: "-NdYUIzcvEABYwQHGHEU"}
    //   }); // post() return ออกมาเป็น Observable เลยต้อง subscribe ให้ observer ทำงาน เพื่อที่จะได้ส่งคำขอนี้ไป และรับข้อมูลที่ response กลับมาใช้ต่อ ถ้าไม่ใส่ subscribe rxjs กับ angular จะคิดว่าไม่มีใครสนใจคำขอนี้เลยไม่มีการส่งคำขอออกไป
    this.postService.creatAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    // this.fetchPost();
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe((posts) => {
      // subscribe ที่นี่ เพราะ ต้องการ clear loadedPosts ใน component ด้วย เพื่อให้พอกด clear แล้วหน้าเว็บอัพเดทตามเลย
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.errorMessage = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  // private fetchPost() {
  //   this.isFetching = true;
  //   this.http
  //     .get<{ [key: string]: Post }>(
  //       'https://angular-http-44c47-default-rtdb.firebaseio.com/posts.json'
  //     )
  //     // map ช่วยรับข้อมูลบางส่วนและส่งคืนข้อมูลใหม่ ซึ่งถูกรวมเข้ากับ subscribe (ถ้าไม่รวมจะไม่สามารถรับข้อมูลได้) ซึ่งมันรับเป็นข้อมูล response และ return
  //     // เป็นข้อมูลที่ transform แล้ว
  //     .pipe(
  //       map((reponseData) => {
  //         const postsArr: Post[] = [];
  //         console.log(reponseData); //{"-NdYUIzcvEABYwQHGHEU": {"content": "This is POST!", "title": "Test"} }
  //         for (const key in reponseData) {
  //           if (reponseData.hasOwnProperty(key)) {
  //             postsArr.push({ ...reponseData[key] }); // เพิ่ม new obj
  //           }
  //         }
  //         return postsArr;
  //       })
  //     ) // เป็น method ใน observable ที่จะช่วย transform ข้อมูลผ่าน operator ของ observable ก่อนไป subscribe
  //     .subscribe((posts) => {
  //       console.log(posts);
  //       this.isFetching = false;
  //       this.loadedPosts = posts;
  //     });
  // }
}
