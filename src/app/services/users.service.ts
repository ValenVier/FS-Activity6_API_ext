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

}
