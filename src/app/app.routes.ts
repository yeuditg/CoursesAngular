import { Routes } from '@angular/router';
import { MenueComponent } from '../component/menue/menue.component';
import { LoginComponent } from '../component/login/login.component';
import { CoursesComponent } from '../component/courses/courses.component';
import { CourseDetailsDialogComponent } from '../component/course-details-dialog/course-details-dialog.component';
import { CourseEditComponent } from '../component/course-edit/course-edit.component';
import { MyCoursesComponent } from '../component/my-courses/my-courses.component';
import { authGuard } from '../gards/auth.guard';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' }, // ברירת מחדל לדף התחברות
    { path: 'login', component: LoginComponent },
    
    {
        path: 'menu', component: MenueComponent,
        children: [
            {
                path: 'courses', component: CoursesComponent,
                children: [
                    { path: 'edit/:id', component: CourseEditComponent }, // עריכת קורס
                    { path: 'detail/:id', component: CourseDetailsDialogComponent } // פרטי קורס
                ]
            },
            { path: 'my-courses', component: MyCoursesComponent }
            // {
            //     path: 'user-list', component: UserListComponent,
            //     children: [
            //         { path: 'delete/:id', component: UserDeleteComponent } // מחיקת משתמש
            //     ]
            // },
        ],
        canActivate: [authGuard]
    }


    // { path: '**', component: PageNotFoundComponent } // דף שגיאה לכל נתיב לא תקין



];
