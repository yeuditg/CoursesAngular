import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-delete',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-delete.component.html'
})
export class UserDeleteComponent {
  userId: number;
  token!: string; // Assume you get the token from somewhere

  constructor(private userService: UserService, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.userId = +id;
    } else {
      // Handle the case when id is null
      console.error('User ID is null');
      this.userId = 0; // or any default value or error handling
    }
  }

  deleteUser() {
    this.userService.deleteById(this.userId, this.token).subscribe(() => {
      console.log('User deleted');
    }, error => {
      console.error('Delete error:', error);
    });
  }
}

