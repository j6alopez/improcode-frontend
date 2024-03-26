import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, Signal, inject, signal } from '@angular/core';
import { Participant } from '../interfaces/participant.interface';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService implements OnInit {

  private http = inject(HttpClient);
  private baseUrl = environment.backend_base_url;

  constructor() {
    this.ngOnInit();
  }

  private participantsSignal = signal<Participant[]>([]);

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
    const url = `${this.baseUrl}/participants/${id}`
    return this.http.patch<Participant>(url, participant);
  }

  deleteParticipant(id: string): Observable<Participant> {
    const url = `${this.baseUrl}/participants/${id}`
    return this.http.delete<Participant>(url);
  }

  get participants(): Signal<Participant[]> {
    return this.participantsSignal.asReadonly();
  }

  addParticipant(participant: Participant): void {
    this.participantsSignal.update(participants => [...participants, participant]);
  }

  removeParticipant(participant: Participant): void {
    if ( !participant._id ) return;
    this.deleteParticipant(participant._id).subscribe(
      () => {
        this.participantsSignal.update( participants =>
          participants.filter(element => element._id !== participant._id));
      }
    )
  }


  ngOnInit(): void {
    console.log('oniint')
    this.getParticipants()
      .subscribe(participants => {
        console.log(participants)
        this.participantsSignal.set(participants);
      })
  }
}
