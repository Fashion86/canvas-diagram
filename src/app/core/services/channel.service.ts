import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class ChannelService {

  constructor(private http: HttpClient) { }

  getChannelList() {
    const httpParams = new HttpParams();
      // .append('filename', filename)
    // return this.http.get(Constants.API_URL + '/getChannelList',  {params: httpParams});
    // json dumy data for test
    return this.http.get('/assets/channels.json', { headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
      , responseType: 'text' });
  }

  createChannel(channel: any) {
    return this.http.post(Constants.API_URL + '/create/channel', channel);
  }

  updateChannel(channel: any) {
    return this.http.post(Constants.API_URL + '/update/channel', channel);
  }

  deleteChannel(index) {
    return this.http.delete(Constants.API_URL + '/delete/channel/' + index);
  }
}
