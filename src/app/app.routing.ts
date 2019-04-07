import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostViewComponent } from './posts/post-view/post-view.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes =[
    { path: 'home',             component: HomeComponent },
    { path: 'posts',            component: PostListComponent, canActivate: [AuthGuard] },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'view/:postId', component: PostViewComponent, canActivate: [AuthGuard] },
    { path: 'user-profile',     component: ProfileComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
