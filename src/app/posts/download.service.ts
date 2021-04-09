import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders,HttpParams } from "@angular/common/http";
import {Observable,throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

const url = "http://localhost:3000/download"



@Injectable({ providedIn: "root" })
export class DownloadService {


  constructor(private http: HttpClient) {}

  downloadFile(x:string): Observable<any>{
    const param = new HttpParams().set('filename',x);
    const options = {
      params:param
    }
    return this.http.get(url,{...options,responseType:'blob'})
  }
}
