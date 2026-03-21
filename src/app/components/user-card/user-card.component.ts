import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
import { UsuariosServices } from '../../services/usuarios.services';
import { toast } from 'ngx-sonner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  usuario = input<IUser>()
  usuariosService = inject(UsuariosServices)
  @Output() deleteEmit: EventEmitter<string> = new EventEmitter()

  async deleteUsuario(id: string | undefined) {
    // confirmacion con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a borrar a ${this.usuario()?.first_name} ${this.usuario()?.last_name}`,
      icon: 'warning',
      showCancelButton: true,
    })

    if (result.isConfirmed) {
      try {
        const response = await this.usuariosService.deleteById(id)
        if (response._id) {
          toast.error(`Usuario ${response.first_name} ha sido borrado`)
          // enviamos el id al padre para que lo elimine del array
          this.deleteEmit.emit(response._id)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
