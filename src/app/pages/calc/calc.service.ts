import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http:HttpClient) { }
  private queryParams = {"scn_id":sessionStorage.getItem("scnID"),"scn_version":sessionStorage.getItem("scnVersion")};
  getRelationships(): Observable<any>{

    let queryParams = {"scn_id":sessionStorage.getItem("scnID"),"version":sessionStorage.getItem("scnVersion")};
    return this.http.get("http://127.0.0.1:8000/rel/",{headers:this.httpHeaders,params:queryParams});
  }

  calculate(calcObject:any): Observable<any>{

    return this.http.post("http://127.0.0.1:8000/calc/",calcObject)

  }
    // To update handling multiple periods

  clearData(period):Observable<any>{
    console.log(this.queryParams)
    let queryParams = {"scn_id":sessionStorage.getItem("scnID"),"scn_version":sessionStorage.getItem("scnVersion"),"pd":period}

    return this.http.post("http://127.0.0.1:8000/clear-data/",queryParams)

  }

  // To update handling multiple periods
  clearCalc(period):Observable<any>{
    let queryParams = {"scn_id":sessionStorage.getItem("scnID"),"scn_version":sessionStorage.getItem("scnVersion"),"pd":period}
    console.log(this.queryParams)
    return this.http.post("http://127.0.0.1:8000/clear-calc/",queryParams)

  }
}
