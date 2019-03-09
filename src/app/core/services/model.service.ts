import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class ModelService {

  constructor(private http: HttpClient) { }

  getObjectList() {
    const httpParams = new HttpParams();
    // .append('filename', filename)
    return this.http.get(Constants.API_URL + '/types',  {params: httpParams});
    // json dumy data for test
    // return this.http.get('/assets/objects.json', { headers: new HttpHeaders()
    //     .set('Content-Type', 'application/json')
    //   , responseType: 'text' });
  }

  getAttributesByObject(objName) {
    const httpParams = new HttpParams()
    .append('typeName', objName);
    return this.http.get(Constants.API_URL + '/types/attributes',  {params: httpParams});
  }

  getFunctionsByObject(objName) {
    const httpParams = new HttpParams()
      .append('typeName', objName);
    return this.http.get(Constants.API_URL + '/types/functions',  {params: httpParams});
  }

  getComparatorsByObject(objName) {
    const httpParams = new HttpParams()
      .append('typeName', objName);
    return this.http.get(Constants.API_URL + '/types/comparators',  {params: httpParams});
  }

  getObjectByID(id: number) {
    return this.http.get(Constants.API_URL + '/object/' + id);
  }

  createObject(object: any) {
    return this.http.post(Constants.API_URL + '/types', object);
  }

  createAttribute(attribute: any) {
    return this.http.post(Constants.API_URL + '/types/attributes', attribute);
  }

  createFunction(functions: any) {
    return this.http.post(Constants.API_URL + '/types/functions', functions);
  }

  createComparator(comparator: any) {
    return this.http.post(Constants.API_URL + '/types/comparators', comparator);
  }

  updateObject(object: any) {
    return this.http.post(Constants.API_URL + '/update/object', object);
  }

  deleteObject(index) {
    return this.http.delete(Constants.API_URL + '/delete/object/' + index);
  }

// <----------------- attributes api ---------------------->
  getAttributeListByModel(modelID: number) {
    return this.http.get(Constants.API_URL + '/object/' + modelID + '/getObjectList/');
  }
}
