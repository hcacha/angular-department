import { Injectable, Provider, Optional, SkipSelf } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DepartmentDataService {

    constructor(private http: Http) {

    }

    getAll(): Observable<any> {
        let url = '/assets/mock-data/department.txt';
        return this.http.get(url)
            .map((r) => r.text());
    }
}
