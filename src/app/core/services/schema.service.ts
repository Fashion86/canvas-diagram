import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as Constants from '../../app.const';


@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    if (localStorage.getItem("user")) {
      this.headers = this.headers.append('uid', JSON.parse(localStorage.getItem('user')).uid);
    }
  }

  getSchemaList() {
    return this.http.get(Constants.API_URL + '/schemas', {headers: this.headers});
  }

  getSchemaByID(id: number) {
    return this.http.get(Constants.API_URL + '/schema/' + id, {headers: this.headers});
  }

  createSchema(schema: any) {
    return this.http.post(Constants.API_URL + '/schema', schema, {headers: this.headers});
  }

  updateSchema(schema: any) {
    return this.http.post(Constants.API_URL + '/update/schema', schema, {headers: this.headers});
  }

  deleteSchema(index) {
    return this.http.delete(Constants.API_URL + '/delete/schema/' + index, {headers: this.headers});
  }

  private jwt() {
    if (localStorage.getItem("user")) {
      const headers = new HttpHeaders().set("Authorization", "Bearer " + JSON.parse(localStorage.getItem('user')).uid);
      return {headers: headers};
    }
  }
}
