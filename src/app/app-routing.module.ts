import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentComponent } from './department/department.component';

export const appRoutes: Routes = [  
  { path: '', redirectTo: '/departments', pathMatch: 'full' },  
  { path: 'departments', component: DepartmentComponent }  
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const appRoutedComponents = [  
  DepartmentComponent
];
