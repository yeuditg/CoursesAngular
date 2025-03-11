import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';

export const authGuard: CanActivateFn = (route, state) => {
 
  const userService: UserService = inject(UserService); // Inject the AuthService
  const router = inject(Router); // Inject the Router to navigate
  
  let isAuthenticated = false;
  userService.user$.subscribe(user => {
    console.log(user);
    
    if (user) {
      isAuthenticated = true;
    } else {
      router.navigate(['']);
      // Redirect to login if not authenticated
      // alert("You are not allowed, please log in or register");
    }
  });
  return isAuthenticated;

};
