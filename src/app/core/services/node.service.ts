import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Constants from '../../app.const';

@Injectable()
export class NodeService {

  constructor(private http: HttpClient) {
  }

 httpOptions =
{   
    headers:
        new HttpHeaders (
        {   
            "Content-Type": "application/json"
        }),
	params:{},
    withCredentials: true,
}
 getNode(treeId, parentNodeId , nodeId) {
    const httpParams = new HttpParams()
    .append('treeId', treeId)
	.append('parentNodeId', parentNodeId)
	.append('nodeId',nodeId);
	this.httpOptions.params= httpParams;
    return this.http.get(Constants.API_URL + '/nodes',  this.httpOptions);
  }
  
  createNode(object: any) {
    return this.http.post(Constants.API_URL + '/nodes', object, this.httpOptions);
  }
  
  deleteNode(index) {
    return this.http.delete(Constants.API_URL + '/delete/question/' + index, this.httpOptions);
  }
}


