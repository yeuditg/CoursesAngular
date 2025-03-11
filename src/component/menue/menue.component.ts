import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-menue',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule,RouterOutlet,RouterLink,RouterLinkActive,HttpClientModule], 
  templateUrl: './menue.component.html',
  styleUrl: './menue.component.css'
})
export class MenueComponent  {
  constructor(private dialog: MatDialog) {}

 

  

}
