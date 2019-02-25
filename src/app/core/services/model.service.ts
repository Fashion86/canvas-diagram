import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class ModelService {

  constructor(private http: HttpClient) { }

  getObjectList() {
    const httpParams = new HttpParams();
    // .append('filename', filename)
    // return this.http.get(Constants.API_URL + '/getChannelList',  {params: httpParams});
    // json dumy data for test
    return this.http.get('/assets/objects.json', { headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
      , responseType: 'text' });
  }

  getObjectByID(id: number) {
    return this.http.get(Constants.API_URL + '/object/' + id);
  }

  createObject(object: any) {
    return this.http.post(Constants.API_URL + '/create/object', object);
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
