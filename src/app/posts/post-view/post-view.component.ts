import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-view",
  templateUrl: "./post-view.component.html",
  styleUrls: ["./post-view.component.css"]
})
export class PostViewComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            imagePath: postData.imagePath,
            creator: postData.creator,
            created_at: postData.created_at,
            updated_at: postData.updated_at,
            url: postData.url,
            short_info: postData.short_info,
            description: postData.description
          };
        });
      } else {
        this.router.navigate(["/posts"]);
      }
    });
  }

  openFullSize() {
    const theImage = new Image();
    theImage.src = this.post.imagePath;

    const winWidth = theImage.width + 20;
    const winHeight = theImage.height + 20;

    window.open(
      this.post.imagePath,
      null,
      "height=" +
        winHeight +
        ", width=" +
        winWidth +
        ", toolbar=0, location=0, status=0, scrollbars=0, resizable=0"
    );
  }

  visitUrl() {
    window.open(this.post.url);
  }
}
