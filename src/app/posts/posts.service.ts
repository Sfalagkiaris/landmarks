import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                description: post.description,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                short_info: post.short_info,
                url: post.url,
                created_at: post.created_at,
                updated_at: post.updated_at
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      creator: string;
      created_at: string;
      updated_at: string;
      url: string;
      short_info: string;
      description: string;
    }>(BACKEND_URL + id);
  }

  addPost(
    title: string,
    short_info: string,
    image: File,
    description: string,
    url: string
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('short_info', short_info);
    postData.append('image', image, title);
    postData.append('description', description);
    postData.append('url', url);
    postData.append('created_at', '' + new Date());
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(['/posts']);
      });
  }

  updatePost(
    id: string,
    title: string,
    short_info: string,
    image: File | string,
    description: string,
    url: string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('short_info', short_info);
      postData.append('image', image, title);
      postData.append('description', description);
      postData.append('url', url);
      postData.append('updated_at', '' + new Date());
    } else {
      postData = {
        id: id,
        title: title,
        imagePath: image,
        creator: null,
        created_at: null,
        updated_at: '' + new Date(),
        url: url,
        short_info: short_info,
        description: description
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe(response => {
      this.router.navigate(['/posts']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
