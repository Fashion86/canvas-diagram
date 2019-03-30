import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class ModelService {
  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    if (localStorage.getItem("user")) {
      this.headers = this.headers.append('uid', JSON.parse(localStorage.getItem('user')).uid);
    }
  }

  getObjectList() {
    return this.http.get(Constants.API_URL + '/types', {headers: this.headers});
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

// <----------------- attributes api ---------------------->
  getAttributeListByModel(modelID: number) {
    return this.http.get(Constants.API_URL + '/object/' + modelID + '/getObjectList/', {headers: this.headers});
  }

  private jwt() {
    if (localStorage.getItem("user")) {
      const headers = new HttpHeaders().set("Authorization", "Bearer " + JSON.parse(localStorage.getItem('user')).uid);
      return {headers: headers};
    }
  }
}
