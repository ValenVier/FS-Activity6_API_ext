import { Component, inject } from '@angular/core';
import { Resource } from 'src/app/interfaces/resource.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  objResources: Resource;
  arrUsers: User[] = [];
  usersServices = inject(UsersService);

  constructor() {
    this.objResources = {
      "page": 0,
      "per_page": 0,
      "total": 0,
      "total_pages": 0,
      "results": [],
    }
  }

  async ngOnInit(): Promise<void> {
    var a: User | any;
    try {
      this.objResources = await this.usersServices.getAll();
      this.arrUsers = this.objResources.results
    } catch (error) {
      console.log(error);
    }
  }


}
