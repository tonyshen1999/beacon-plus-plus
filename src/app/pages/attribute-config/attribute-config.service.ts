import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttributeConfigService {

  constructor(private http:HttpClient) { }
  baseurl = "http://127.0.0.1:8000/";


  getDefaultAttributes(filter):Observable<any>{
    let queryParams = {
      "scn_id":parseInt(sessionStorage.getItem("scnID")),
      "version":parseInt(sessionStorage.getItem("scnVersion")),
      "scenario":filter
    };

    return this.http.get(this.baseurl + 'atr-filter/',{params:queryParams})
  }


  pushDefaultAttributes(): Observable<any>{

    return this.http.post(this.baseurl+"push-def-atr/",{},{})

  }

  pushCustomAttributes(attributes): Observable<any>{

    let queryParams = {"scn_id":sessionStorage.getItem("scnID"),"scn_version":sessionStorage.getItem("scnVersion"),"attributes":attributes}

    return this.http.post(this.baseurl+"push-custom-atr/",queryParams)
  }


}
