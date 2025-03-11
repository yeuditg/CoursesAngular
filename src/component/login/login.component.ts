import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UserType } from '../../models/userType';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // הוספת MatDialogRef
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatCardModule, ReactiveFormsModule, MatDialogModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  isRegister = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private dialogRef: MatDialogRef<LoginComponent>, 
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      role: ['student', Validators.required]
    });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 9;

    if (hasUpperCase && hasLowerCase && hasNumber && isValidLength) {
      return null;
    }
    return { 'passwordStrength': true };
  }

  toggleRegister() {
    this.isRegister = !this.isRegister;
    if (this.isRegister) {
      this.loginForm.addControl('name', this.fb.control('', Validators.required));
    } else {
      this.loginForm.removeControl('name');
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user: UserType = this.createUser();

      if (this.isRegister) {
        this.authService.register(user).subscribe({
          next: response => {
            if (response.userId && response.token) {
              const user: UserType = {
                id: response.userId, email: this.loginForm.value.email, role: response.role as 'student' | 'teacher' | 'admin',
                password: ''
              };
              this.userService.setUser(user, response.token);
              this.closeDialogAndNavigate();
            } else {
              console.error('Registration response does not contain userId or token');
            }
          },
          error: error => console.error('Registration error:', error)
        });
      } else {
        this.authService.login(user.email, user.password).subscribe({
          next: response => {
            if (response.userId && response.token) {
              const user: UserType = {
                id: response.userId, email: this.loginForm.value.email, role: response.role as 'student' | 'teacher' | 'admin',
                password: ''
              };
              this.userService.setUser(user, response.token);
              this.closeDialogAndNavigate();
            } else {
              console.error('Login response does not contain userId or token');
            }
          },
          error: error => console.error('Login error:', error)
        });
      }
    }
  }

  private createUser(): UserType {
    return this.isRegister ? {
      name: this.loginForm.value.name,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      role: this.loginForm.value.role
    } : {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
  }

  private closeDialogAndNavigate() {
    console.log("login1");

    this.dialogRef.close();
    console.log("login2");

    this.router.navigate(['/menu']);
    console.log("login3");
  }
}