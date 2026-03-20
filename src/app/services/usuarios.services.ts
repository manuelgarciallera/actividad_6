import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

// tipo rapido para respuesta paginada
type IResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: IUser[];
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosServices {
  private baseUrl: string = "https://peticiones.online/api/users"
  private httpClient = inject(HttpClient)

  getAll(): Promise<IResponse> {
    return lastValueFrom(this.httpClient.get<IResponse>(this.baseUrl))
  }

  getById(id: string | undefined): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${id}`))
  }

  insert(usuario: IUser): Promise<IUser> {
    return lastValueFrom(this.httpClient.post<IUser>(this.baseUrl, usuario))
  }

  update(usuario: IUser, id: string | undefined): Promise<IUser> {
    return lastValueFrom(this.httpClient.put<IUser>(`${this.baseUrl}/${id}`, usuario))
  }

  deleteById(id: string | undefined): Promise<IUser> {
    return lastValueFrom(this.httpClient.delete<IUser>(`${this.baseUrl}/${id}`))
  }
}
