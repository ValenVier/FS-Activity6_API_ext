import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() miUser: User | any;
  usersServices = inject(UsersService);
  route = inject(Router);

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
        this.route.navigate(['/home']);
      } else {
        Swal.fire('Cancelado!', '', 'info');
        this.route.navigate(['/home']);
      }
    })
  }
}
