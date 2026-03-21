import { Component, inject, signal } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UsuariosServices } from '../../services/usuarios.services';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-home',
  imports: [UserCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  arrUsuarios = signal<IUser[]>([])
  usuariosService = inject(UsuariosServices)

  ngOnInit() {
    this.cargarUsuarios()
  }

  async cargarUsuarios() {
    try {
      const response = await this.usuariosService.getAll()
      this.arrUsuarios.set(response.results)
    } catch (dataError: any) {
      toast.error('No se pudieron cargar los datos')
    }
  }

  // la api es mock, al borrar no persiste, filtramos del array local
  eventDelete(id: string) {
    this.arrUsuarios.update((currentUsuarios) => currentUsuarios.filter(u => u._id !== id))
  }
}
