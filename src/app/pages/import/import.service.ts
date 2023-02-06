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
    // let sheetNames: string[] = Array.from(sheetHash.keys());
    // console.log(sheetHash)
    // let jsonObject = {};
    // for (let sheet in sheetNames){

      
    //   let currentSheet = sheetHash.get(sheet);
    //   console.log(currentSheet)
    //   for (let key in currentSheet){
    //     jsonObject[key] = currentSheet[key];
    //   }
    // }
    // console.log(JSON.stringify(jsonObject))
    let jsonObject = {};
    sheetHash.forEach((value: string[], key: string) => {
      // console.log(key, value);
      jsonObject[key] = value;
    });
    let returnObject = {
      "Scenario":Number(sessionStorage.getItem("scnID")),
      "Version": Number(sessionStorage.getItem("scnVersion")),
      "data": jsonObject,
    }
    let returnObjectString = JSON.stringify(returnObject);
    // let post=this.http.post(this.baseurl+"import/",returnObject).subscribe(data => {
    //   this.logData = data
    //   return data;
    // });

    // console.log(this.logData)
    // console.log(this.response)
   return this.http.post(this.baseurl+"import/",returnObject)

  }

  getImportLog(): Observable<any>{
    
    return this.http.get(this.baseurl+"import-log/",{headers:this.httpHeaders});
  }

}
