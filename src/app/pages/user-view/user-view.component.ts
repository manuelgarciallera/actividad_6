import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { UsuariosServices } from '../../services/usuarios.services';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view',
  imports: [RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {
  // recibir id dinamico por ruta
  id = input<string>()
  usuariosService = inject(UsuariosServices)
  router = inject(Router)
  usuario = signal<IUser | null>(null)

  ngOnInit() {
    this.cargarUsuario()
  }

  async cargarUsuario() {
    try {
      this.usuario.set(await this.usuariosService.getById(this.id()))
    } catch (dataError) {
      console.log(dataError)
    }
  }

  async deleteUsuario() {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a borrar a ${this.usuario()?.first_name} ${this.usuario()?.last_name}`,
      icon: 'warning',
      showCancelButton: true,
    })

    if (result.isConfirmed) {
      try {
        const response = await this.usuariosService.deleteById(this.usuario()?._id)
        if (response._id) {
          toast.error(`Usuario ${response.first_name} ha sido borrado`)
          this.router.navigate(['/home'])
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
