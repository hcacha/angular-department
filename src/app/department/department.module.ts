import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { DepartmentComponent } from './department.component';
import { DepartmentDataService } from './shared/department-data.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [DepartmentComponent],
  providers: [
    DepartmentDataService
  ],
})
export class DepartmentModule { }
