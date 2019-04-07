import { Component, OnInit } from "@angular/core";
import { Post } from "app/posts/post.model";
import { PostsService } from "app/posts/posts.service";
import { Subscription } from "rxjs";
import { AuthService } from "app/auth/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  model = {
    left: true,
    middle: false,
    right: false
  };
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  focus;
  focus1;
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {
    
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.postsService.getPosts(5, 0);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
      });
  }
}
