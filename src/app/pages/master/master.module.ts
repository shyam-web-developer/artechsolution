import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { SessionComponent } from './session/session.component';
import { StateComponent } from './state/state.component';
import { CityComponent } from './city/city.component';
import { DepartmentComponent } from './department/department.component';
import { DesignationComponent } from './designation/designation.component';
import { SectionComponent } from './section/section.component';
const routes: Routes = [ 
  { path: 'session', component: SessionComponent },
  { path: 'state', component: StateComponent },
  { path: 'city', component: CityComponent },
  { path: 'department', component: DepartmentComponent },
  { path: 'designation', component: DesignationComponent }, 
  { path: 'section', component: SectionComponent }
];

@NgModule({
  imports: [
    SharedModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [  
    SessionComponent,
    StateComponent,
    CityComponent,
    DepartmentComponent,
    DesignationComponent,  
    SectionComponent
  ]
})
export class MasterModule { }