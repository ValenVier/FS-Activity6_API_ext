import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Resource } from '../interfaces/resource.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  httpClient = inject(HttpClient);
  private baseUrl = "https://peticiones.online/api/users/"

  constructor() { }

  getAll():Promise<Resource>{
    return lastValueFrom(this.httpClient.get<Resource>(this.baseUrl));
  }

  insert(formValue:any):Promise<User|any>{
    return lastValueFrom(this.httpClient.post<User>(this.baseUrl,formValue));
  }

  getByIdPromise(_id:string):Promise<User|any>{
    return lastValueFrom(this.httpClient.get<User>(`${this.baseUrl}${_id}`));
  }

  update(formValue:User):Promise<User|any>{
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}${formValue._id}`, formValue));
  }

  deleteUser(_id:string):Promise<User|any>{
    return lastValueFrom(this.httpClient.delete<any>(`${this.baseUrl}${_id}`));
  }

}
