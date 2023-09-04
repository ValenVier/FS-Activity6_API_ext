import { Component, inject } from '@angular/core';
import { Resource } from 'src/app/interfaces/resource.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  objResources: Resource;
  arrUsers: User[] = [];
  usersServices = inject(UsersService);
  page!:number; /* atributo para la paginación */

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
    try {
      this.objResources = await this.usersServices.getAll();
      this.arrUsers = this.objResources.results
    } catch (error) {
      Swal.fire({
        title: 'Ha habido un problema al recuperar los datos. Recargue la página. Error: '+ error,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
      });
    }
  }

}
