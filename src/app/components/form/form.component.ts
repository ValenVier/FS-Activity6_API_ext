import { Component, Inject, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
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
  /* valores que cambian en función de si es un registro nuevo o para actualizar */
  formTitle: string = "Nuevo";
  formButton: string = "Guardar";

  constructor() {
    this.userForm = new FormGroup({
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      last_name: new FormControl("", [
        Validators.required,
      ]),
      email: new FormControl("", [
        Validators.required,
        this.emailValidator,
      ]),
      username: new FormControl("", []),
      password: new FormControl("", []),
      image: new FormControl("", [
        Validators.required,
        this.imageValidator,
      ]),
    }, []);
  }

  async getDataForm(): Promise<void> {
    if (this.userForm.value.id) {
      /* si tiene id entonces se está actulizando un registro y no creando uno nuevo */
      let response = await this.usersService.update(this.userForm.value);/* actualizo el registro */
      if (response.id) { /* Si la respuesta tiene id es que se ha actualizado correctamente */
        var title: string = 'Usuario actualizado correctamente!';
        var icon: string = 'success';
        var result: any = this.router.navigate(['/home']);
        this.sweetAlert(title, icon, result); /* llamo a la función para crear la alerta */
      } else {
        var title: string = response.error !== "" || response.error !== undefined ? response.error : "No se ha podido actualizar el Usuario";;
        var icon: string = 'error';
        var result: any = this.router.navigate(['/home']);
        this.sweetAlert(title, icon, result);
      }
    } else {
      /* si no tiene id estamos creando un registro nuevo */
      this.userForm.value.password = "12345"; /* añado una password ya que en el word no lo piden en el formulario pero si para algunos verbos del CRUD */
      this.userForm.value.username = this.userForm.value.first_name + this.userForm.value.last_name; /* creo el username uniendo el first y el last name */
      this.userForm.value.username = this.userForm.value.username.replace(/\s+/g, '.');
      let response: any = await this.usersService.insert(this.userForm.value); /* inserto el registro */
      if (response.id) {  /* si la respuesta tiene id entonces se ha insertado correctamente un nuevo registro */
        var title: string = 'Usuario añadido satisfactoriamente!';
        var icon: string = 'success';
        var result: any = this.router.navigate(['/home']);
        this.sweetAlert(title, icon, result);
      } else {/* si la respuesta no tiene id, ha habido un error, recargo el formulario vacío */
        var title: string = response.error !== "" || response.error !== undefined ? response.error : "Error al introducir el Usuario";
        var icon: string = 'error';
        var result: any = this.userForm = new FormGroup({
          first_name: new FormControl("", [
            Validators.required,
            Validators.minLength(3),
          ]),
          last_name: new FormControl("", [
            Validators.required,
          ]),
          email: new FormControl("", [
            Validators.required,
            this.emailValidator,
          ]),
          username: new FormControl("", []),
          password: new FormControl("", []),
          image: new FormControl("", [
            Validators.required,
            this.imageValidator,
          ]),
        }, []);
        this.sweetAlert(title, icon, result);
      }
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {/* Recojo los parámetros de la url y si tiene iduser entonces es un registro a actualizar */
      if (params.iduser !== "" && params.iduser !== undefined) {
        this.formTitle = "Actualizar";
        this.formButton = "Actualizar";
        let _id: string = params.iduser;
        let response = await this.usersService.getByIdPromise(_id);/* cojo el _id del usuario y busco la información en el servidor */
        if (response.id) { /* Si la respuesta tiene id es que ha encontrado el registro; cargo la información en el formulario */
          this.userForm = new FormGroup({
            _id: new FormControl(response._id, []),
            id: new FormControl(response.id, []),
            first_name: new FormControl(response.first_name, [
              Validators.required,
              Validators.minLength(3),
            ]),
            last_name: new FormControl(response.last_name, [
              Validators.required,
            ]),
            username: new FormControl(response.username, []),
            email: new FormControl(response.email, [
              Validators.required,
              this.emailValidator,
            ]),
            image: new FormControl(response.image, [
              Validators.required,
              this.imageValidator,
            ]),
          }, []);
        } else {
          var title: string = response.error !== "" || response.error !== undefined ? response.error : "Error al capturar el registro del Usuario";;
          var icon: string = 'error';
          var result: any = this.router.navigate(['/home']);
          this.sweetAlert(title, icon, result);
        }
      }
    });
  }

  /* función alerta a parte para no reescribir el código múltiples veces */
  sweetAlert(titleAlarm: string, iconAlarm: string | any, resultConfirmed: any): void {
    Swal.fire({
      position: 'top',
      icon: iconAlarm,
      title: titleAlarm,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        resultConfirmed;
      }
    });
  }

  /* Comprueba los errores en el formulario */
  checkControl(formControlName: string, validator: string): boolean | undefined {
    return this.userForm.get(formControlName)?.hasError(validator) && this.userForm.get(formControlName)?.touched;
  }

  /* comprueba los validadores del formulario */
  imageValidator(controlName: AbstractControl): any {
    const image: string = controlName.value;
    if (image === ''){
      return {'imagevalidator': "Debe añadir una dirección URL de una imagen."};
    }
    console.log(controlName.value);
    console.log(image.indexOf('http'));
    if (image.indexOf('http') !== -1 && (image.indexOf('peticiones.online') !== -1 || image.indexOf('jpeg') !== -1 || image.indexOf('jpg') !== -1 || image.indexOf('png') !== -1 || image.indexOf('gif') !== -1 || image.indexOf('webp') !== -1)) {
      return null;
    } else {
      return {'imagevalidator': "No es una url de imágen válida."};
    }
  }

  emailValidator(controlName: AbstractControl): any {
    const email: string = controlName.value;
    if (email === ''){
      return {'emailvalidator': 'Debe añadir un email.'};
    }
    const reg1 = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}$/;
    const reg2 = /^[\w-\.]+[\w]+@([\w-]+\.)+[\w-]{2,6}$/;

    if (reg1.test(email) || reg2.test(email)) {
      return null;
    } else {
      return {'emailvalidator': 'El email no tiene un formato válido.'};
    }

  }

}
