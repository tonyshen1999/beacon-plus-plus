import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttributeConfigService {

  constructor(private http:HttpClient) { }
  baseurl = "http://127.0.0.1:8000/";


  getDefaultAttributes():Observable<any>{

    return this.http.get(this.baseurl + 'def-atr/')
  }

}
