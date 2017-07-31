import { Component, OnInit } from '@angular/core';

import { DepartmentDataService } from './shared/department-data.service';

@Component({
  selector: 'test-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  departments: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];

  constructor(private departmentDataService: DepartmentDataService) { }

  ngOnInit() {
    this.departmentDataService
      .getAll()
      .do((r) => {
        console.log(r);
        this.loadDepartments(r);
      })
      .subscribe();
  }

  private loadDepartments(data: string) {
    let lines = data.split('\n');

    for (let line of lines) {
      let details = line.split('/').map(x => x.trim()).filter(x => x != '');
      let pairValues: any[];
      let pos: number;
      let code: string;
      let name: string;
      // Find departments
      if (details.length > 0) {
        pos = details[0].indexOf(' ');
        code = details[0].substr(0, pos);
        name = details[0].substr(pos);
        if (!this.departments.some(x => x.code === code)) {

          this.departments.push({
            code: code,
            name: name,
            parentCode: '-',
            parentName: '-'
          });
        }
      }
      // Find provinces
      if (details.length > 1) {
        pos = details[1].indexOf(' ');
        code = details[1].substr(0, pos);
        name = details[1].substr(pos);

        if (!this.provinces.some(x => x.code === code)) {
          let department = this.departments.find(x => x.code === details[0].trim().split(' ')[0]);

          this.provinces.push({
            code: code,
            name: name,
            parentCode: department.code,
            parentName: department.name
          });
        }
      }
      // Find districts
      if (details.length > 2) {
        pos = details[2].indexOf(' ');
        code = details[2].substr(0, pos);
        name = details[2].substr(pos);

        if (!this.provinces.some(x => x.code === code)) {
          let province = this.provinces.find(x => x.code === details[1].trim().split(' ')[0]);

          this.districts.push({
            code: code,
            name: name,
            parentCode: province.code,
            parentName: province.name
          });
        }
      }
    }

    console.log(lines);

  }


}
