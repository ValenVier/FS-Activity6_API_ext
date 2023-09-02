import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal, { SweetAlertGrow, SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  userForm: FormGroup;
  usersService = inject(UsersService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  constructor(){
    this.userForm = new FormGroup({
      first_name: new FormControl("",[]),
      last_name: new FormControl("",[]),
      email: new FormControl("",[]),
      username: new FormControl("",[]),
      password: new FormControl("",[]),
      image: new FormControl("",[]),
    },[]);
  }

  async getDataForm(): Promise<void>{
    if(this.userForm.value.id){
      let response = await this.usersService.update(this.userForm.value);
      if (response.id) {
        var title:string = 'Usuario actualizado correctamente!';
        var icon:string = 'success';
        var result:any = this.router.navigate(['/home']);
        this.sweetAlert(title,icon,result);
      } else {
        var title:string = response.error !== "" || response.error !== undefined ? response.error : "No se ha podido actualizar el Usuario";;
        var icon:string = 'error';
        var result:any = this.router.navigate(['/home']);
        this.sweetAlert(title,icon,result);
      }
    } else {
      this.userForm.value.password = "12345";
      this.userForm.value.username = this.userForm.value.first_name + this.userForm.value.last_name;
      this.userForm.value.username = this.userForm.value.username.replace(/\s+/g, '.');
      let response:any = await this.usersService.insert(this.userForm.value);
      if(response.id){
        var title:string = 'Usuario añadido satisfactoriamente!';
        var icon:string = 'success';
        var result:any = this.router.navigate(['/home']);
        this.sweetAlert(title,icon,result);
      } else {
        var title:string = response.error !== "" || response.error !== undefined ? response.error : "Error al introducir el Usuario";
        var icon:string = 'error';
        var result:any = this.userForm = new FormGroup({ 
          first_name: new FormControl("",[]),
          last_name: new FormControl("",[]),
          email: new FormControl("",[]),
          username: new FormControl("",[]),
          password: new FormControl("",[]),
          image: new FormControl("",[]),
        },[]);
        this.sweetAlert(title,icon,result);
      }
    }
  }

  ngOnInit():void{
    this.activatedRoute.params.subscribe(async (params:any)=>{
      if(params.iduser !== "" && params.iduser !== undefined){
        let _id: string = params.iduser;
        let response = await this.usersService.getByIdPromise(_id);
        if(response.id){
          this.userForm = new FormGroup({
            _id: new FormControl(response._id,[]),
            id: new FormControl(response.id, []),//para actualizar el post necesito poner el id ya que se va a enviar al servidor
            first_name: new FormControl(response.first_name, []),
            last_name: new FormControl(response.last_name, []),
            username: new FormControl(response.username, []),
            email: new FormControl(response.email, []),
            image: new FormControl(response.image, []),
          }, []);
        } else {
          var title:string = response.error !== "" || response.error !== undefined ? response.error : "Error al capturar el registro del Usuario";;
          var icon:string = 'error';
          var result:any = this.router.navigate(['/home']);
          this.sweetAlert(title,icon,result);
        }        
      }
    });
  }

  sweetAlert(titleAlarm:string,iconAlarm:string|any,resultConfirmed:any):void{
    Swal.fire({
      position: 'top',
      icon: iconAlarm,
      title: titleAlarm,
      showConfirmButton: true,
    }).then((result)=>{
      if(result.isConfirmed){
        resultConfirmed;
      }
    });
  }

}
