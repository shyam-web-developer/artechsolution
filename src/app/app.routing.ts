import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './components/layouts/home-layout.component';
import { LoginLayoutComponent } from './components/layouts/login-layout.component';
import { HomeComponent } from './website/home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './website/about/about.component';
import { ContactComponent } from './website/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard, UnsearchedTermGuard } from './_guards';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    // redirect to home page by default
    {
        path: '',
        component: LoginLayoutComponent,
        children: [            
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'home', component: HomeComponent },
          //  { path: 'home', component: HomeComponent, canDeactivate:[UnsearchedTermGuard] },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactComponent },
            // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent }
            //{ path: '**', component: PageNotFoundComponent }
        ]
        
    },  
    {
    path: '',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent }
        ]
    },
    { path: 'master', component :  HomeLayoutComponent, canActivate: [AuthGuard], loadChildren: './pages/master/master.module#MasterModule' },
    { path: 'users', component :  HomeLayoutComponent, canActivate: [AuthGuard], loadChildren: './pages/users-account/users-account.module#UsersAccountModule' }, 
    { path: 'inventory', component :  HomeLayoutComponent, canActivate: [AuthGuard], loadChildren: './pages/inventory/inventory.module#InventoryModule' },
    { path: 'student', component :  HomeLayoutComponent, canActivate: [AuthGuard], loadChildren: './pages/student/student.module#StudentModule' },
    { path: 'employee', component :  HomeLayoutComponent, canActivate: [AuthGuard], loadChildren: './pages/employee/employee.module#EmployeeModule' },
    
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
    
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
//export const AppRoutingModule = RouterModule.forRoot(appRoutes, {useHash: true}); // It is url like http://localhost:4200/#/login

// To do : We can direct put in app.moduel declarations
//export const RoutingComponents = [LoginLayoutComponent,HomeComponent];