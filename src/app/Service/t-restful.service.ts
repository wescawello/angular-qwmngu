import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { viewClassName } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs';
 

@Injectable({
  providedIn: 'root'
})
export class TRestfulService {
 
  constructor(private http: HttpClient  , @Inject('BASE_URL') private BASE_URL: string ) { }
  //data$ = new BehaviorSubject<any[]>(false);
  //refobj
  getAll<T>(ctrlname:string)  {
    //var c = new C();
    //var ctrlname = c.constructor.name;
    return this.http.get<T[]>(`${this.BASE_URL}/api/${ctrlname}`);
  }
  get<T>(ctrlname:string, id: string) {
   //var  ctrlname = new C().constructor.name;
   return this.http.get<T[]>(`${this.BASE_URL}/api/${ctrlname}/${id}`);
  }
  del<T>(ctrlname: string,el:T, keynames?: string[]) {
    let subpath:string  = keynames ? keynames.map(k => el[k]).join("/") : el["id"];
    return this.http.delete<T>(`${this.BASE_URL}/api/${ctrlname}/${subpath}`);
  }
  add<T>(ctrlname: string, el: T) {
    return this.http.post<T>(`${this.BASE_URL}/api/${ctrlname}`,el);
  }
  update<T>(ctrlname: string, el: T, keynames?:string[]) {
    let subpath = keynames ?  keynames.map(k => el[k]).join("/") : el["id"];
    return this.http.put<T>(`${this.BASE_URL}/api/${ctrlname}/${subpath}`, el);
  }

}
