import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosServices } from '../../services/usuarios.services';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  userForm: FormGroup
  usuariosService = inject(UsuariosServices)
  router = inject(Router)
  id = input<string>()
  title: string = 'Nuevo Usuario'
  botonTexto: string = 'Guardar'
  usuario = signal<IUser | undefined>(undefined)

  constructor() {
    this.userForm = new FormGroup({
      first_name: new FormControl("", [Validators.required]),
      last_name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.pattern(/^[\w.]+\@[a-zA-Z_0-9.]+?\.[a-zA-Z]{2,6}$/)]),
      image: new FormControl("", [Validators.required]),
    }, [])
  }

  async ngOnInit() {
    // si recibimos id estamos en actualizar
    if (this.id()) {
      this.title = "Actualizar Usuario"
      this.botonTexto = "Actualizar"
      // pedir datos al servicio para rellenar el formulario
      this.usuario.set(await this.usuariosService.getById(this.id()))
      this.userForm.patchValue({
        first_name: this.usuario()?.first_name,
        last_name: this.usuario()?.last_name,
        email: this.usuario()?.email,
        image: this.usuario()?.image
      })
    }
  }

  async getDataForm() {
    // llamar al servicio para insertar o actualizar
    if (this.id()) {
      // actualizamos
      try {
        const response = await this.usuariosService.update(this.userForm.value, this.id())
        if (response._id) {
          toast.warning('Usuario actualizado correctamente')
          this.router.navigate(['/home'])
        }
      } catch (dataError) {
        console.log(dataError)
      }
    } else {
      // insertamos
      try {
        const response = await this.usuariosService.insert(this.userForm.value)
        if (response.id) {
          toast.success('Usuario registrado correctamente')
          this.router.navigate(['/home'])
        }
        this.userForm.reset()
      } catch (dataError: any) {
        console.log(dataError)
      }
    }
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.userForm.get(controlName)?.hasError(errorName) && this.userForm.get(controlName)?.touched
  }
}
