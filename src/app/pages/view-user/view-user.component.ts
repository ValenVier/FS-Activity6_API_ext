import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent {
  activatedRoute = inject(ActivatedRoute);
  theUser!: User | any;
  usersServices = inject(UsersService);
  router = inject(Router);

  ngOnInit():void{
    this.activatedRoute.params.subscribe(async (params:any)=>{
      let id:string = params.iduser.toString();
      this.theUser = await this.usersServices.getByIdPromise(id);
    });
  }

  deleteUser(_id:string){
    Swal.fire({
      title: '¿Estás seguro de querer borrar este Usuario?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then(async (result) => {
      let response = await this.usersServices.deleteUser(_id);
      if (result.isConfirmed && response.id) {
        Swal.fire('Eliminado!', '', 'success');
        this.router.navigate(['/home']);
      } else {
        Swal.fire('Cancelado!', '', 'info');
        this.router.navigate(['/home']);
      }
    })
  }
  
}
