import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Participant } from '../interfaces/participant.interface';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  private http = inject(HttpClient);
  private baseUrl = environment.backend_base_url;

  constructor() { }

  getParticipants(): Observable<Participant[]> {
    const url = `${this.baseUrl}/participants`
    return this.http.get<Participant[]>(url);
  }

  getParticipant(id: string): Observable<Participant> {
    const url = `${this.baseUrl}/participants/$id`
    return this.http.get<Participant>(url);
  }

  createParticipant(participant: Participant): Observable<Participant> {
    const url = `${this.baseUrl}/participants`
    return this.http.post<Participant>(url, participant);
  }

  updateParticipant(id: string, participant: Participant): Observable<Participant> {
    const url = `${this.baseUrl}/participants/$id`
    return this.http.patch<Participant>(url, participant);
  }

  deleteParticipant(id: string): Observable<Participant> {
    const url = `${this.baseUrl}/participants/$id`
    return this.http.delete<Participant>(url);
  }

}
