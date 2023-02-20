import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ImportService {

  baseurl = "http://127.0.0.1:8000/";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'}
  
  )
  response:any;
  logData:any;
  constructor(private http:HttpClient) { 

  }

  postTables(sheetHash:Map<string,string[]>): Observable<any>{

    let jsonObject = {};
    sheetHash.forEach((value: string[], key: string) => {
      // console.log(key, value);
      jsonObject[key] = value;
    });
    let returnObject = {
      "Scenario":Number(sessionStorage.getItem("scnID")),
      "Version": Number(sessionStorage.getItem("scnVersion")),
      "PushAttributes":true,
      "data": jsonObject,
    }
    let returnObjectString = JSON.stringify(returnObject);
    console.log(sheetHash)
   return this.http.post(this.baseurl+"import/",returnObject)

  }

  importTable(jsonObject): Observable<any>{

    let returnObject = {
      "Scenario":Number(sessionStorage.getItem("scnID")),
      "Version": Number(sessionStorage.getItem("scnVersion")),
      "PushAttributes":false,
      "data": jsonObject,
    }

    return this.http.post(this.baseurl+"import/",returnObject)
  }
  getImportLog(): Observable<any>{
    
    return this.http.get(this.baseurl+"import-log/",{headers:this.httpHeaders});
  }

}
