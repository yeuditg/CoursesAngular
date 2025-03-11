
import { Component, OnInit } from '@angular/core';
import { UserType } from '../../models/userType';
import { UserService } from '../../service/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [BrowserModule,RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: UserType[] = [];
  token!: string  // Assume you get the token from somewhere (e.g., local storage)

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers(this.token).subscribe(users => {
      this.users = users;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
}
