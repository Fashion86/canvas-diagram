import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class QuestionService {

  constructor(private http: HttpClient) {
  }

  getQuestionList() {
    return this.http.get(Constants.API_URL + '/getQuestionList');
  }

  createQuestion(question: any) {
    return this.http.post(Constants.API_URL + '/create/question', question);
  }

  updateQuestion(question: any) {
    return this.http.post(Constants.API_URL + '/update/question', question);
  }

  deleteQuestion(index) {
    return this.http.delete(Constants.API_URL + '/delete/question/' + index);
  }
}


