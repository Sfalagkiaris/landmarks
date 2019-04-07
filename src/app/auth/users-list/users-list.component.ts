import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: AuthData[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  viewDetails = false; 
  private usersSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.viewDetails = false;
    this.authService.getUsers(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.usersSub = this.authService
      .getUsersUpdateListener()
      .subscribe((userData: { users: AuthData[]; usersCount: number }) => {
        this.isLoading = false;
        this.totalPosts = userData.usersCount;
        this.users = userData.users;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.authService.getUsers(this.postsPerPage, this.currentPage);
  }

  

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  
}
