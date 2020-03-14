
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { AuthGuard,UnsearchedTermGuard } from './_guards';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AboutComponent } from './website/about/about.component';
import { AboutService } from './website/about/about.service';
import { HomeComponent } from './website/home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './_services';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './website/contact/contact.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ParamsComponent } from './pages/dashboard/params.component';
import { ComponentsModule } from './components/components.module';
import { ConfirmComponent } from './_directives/confirm-box/confirm.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { ToastrModule } from 'ngx-toastr';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditDeleteButtonComponent } from './components/edit-delete-button';

@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,    
    AboutComponent,
    LoginComponent,
    RegisterComponent,    
    ContactComponent, 
    DashboardComponent,   
    ParamsComponent,
    ConfirmComponent,
    PageNotFoundComponent,
    EditDeleteButtonComponent  
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([ParamsComponent]),
    Ng4LoadingSpinnerModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ComponentsModule,
    BrowserAnimationsModule,  
    ToastrModule.forRoot()    
  ],
  entryComponents: [ ConfirmComponent,EditDeleteButtonComponent ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: APP_BASE_HREF, useValue: '/'},
    AuthGuard, UnsearchedTermGuard, AboutService,DatePipe],
  bootstrap: [AppComponent]  
})
export class AppModule { }
