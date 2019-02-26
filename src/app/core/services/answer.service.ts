import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class AnswerService {

  constructor(private http: HttpClient) {
  }

  getAnswerList() {
    return this.http.get(Constants.API_URL + '/getAnswerList');
  }

  createAnswer(answer: any) {
    return this.http.post(Constants.API_URL + '/create/answer', answer);
  }

  updateAnswer(answer: any) {
    return this.http.post(Constants.API_URL + '/update/answer', answer);
  }

  deleteAnswer(index) {
    return this.http.delete(Constants.API_URL + '/delete/answer/' + index);
  }
}