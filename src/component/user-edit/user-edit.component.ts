import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { UserType } from '../../models/userType';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatCardModule, ReactiveFormsModule]
})
export class UserEditComponent implements OnInit {
  editForm!: FormGroup;
  userId!: number;
  token!: string; // Assume you get the token from somewhere

  constructor(private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['student', Validators.required]
    });
  }

  ngOnInit() {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.userId, this.token).subscribe(user => {
      if (user) {
      this.editForm.patchValue(user);
      } else {
      console.error('User not found');
      }
    }, error => {
      console.error('Error fetching user:', error);
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const user: UserType = this.editForm.value;
      this.userService.updateUserDetails(this.userId, user, this.token).subscribe(response => {
        console.log('User updated:', response);
      }, error => {
        console.error('Update error:', error);
      });
    }
  }
}
