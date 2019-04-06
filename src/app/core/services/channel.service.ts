import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class ChannelService {

  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    if (localStorage.getItem('user')) {console.log(localStorage.getItem('user'))
      this.headers = this.headers.append('uid', JSON.parse(localStorage.getItem('user')).uid);
    }
  }

  getChannelList() {
    return this.http.get(Constants.API_URL + '/channels', {headers: this.headers});
  }

  getAttributesByObject(objName) {
    const httpParams = new HttpParams()
      .append('typeName', objName);
    return this.http.get(Constants.API_URL + '/types/attributes',  {params: httpParams, headers: this.headers});
  }

  getFunctionsByObject(objName) {
    const httpParams = new HttpParams()
      .append('typeName', objName);
    return this.http.get(Constants.API_URL + '/types/functions',  {params: httpParams, headers: this.headers});
  }

  getComparatorsByObject(objName) {
    const httpParams = new HttpParams()
      .append('typeName', objName);
    return this.http.get(Constants.API_URL + '/types/comparators',  {params: httpParams, headers: this.headers});
  }

  getObjectByID(id: number) {
    return this.http.get(Constants.API_URL + '/object/' + id, {headers: this.headers});
  }

  createObject(object: any) {
    return this.http.post(Constants.API_URL + '/types', object, {headers: this.headers});
  }

  createAttribute(attribute: any) {
    return this.http.post(Constants.API_URL + '/types/attributes', attribute, {headers: this.headers});
  }

  createFunction(functions: any) {
    return this.http.post(Constants.API_URL + '/types/functions', functions, {headers: this.headers});
  }

  createComparator(comparator: any) {
    return this.http.post(Constants.API_URL + '/types/comparators', comparator, {headers: this.headers});
  }

  updateObject(object: any) {
    return this.http.post(Constants.API_URL + '/update/object', object, {headers: this.headers});
  }

  deleteObject(index) {
    return this.http.delete(Constants.API_URL + '/delete/object/' + index, {headers: this.headers});
  }
}
