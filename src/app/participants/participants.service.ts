import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, Signal, inject, signal } from '@angular/core';
import { Participant } from './interfaces/participant.interface';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class ParticipantsService implements OnInit {

  private http = inject( HttpClient );
  private baseUrl = environment.backend_base_url;
  private participantsSignal = signal<Participant[]>( [] );

  constructor() {
    this.ngOnInit();
  }


  getParticipants(): Observable<Participant[]> {
    const url = `${ this.baseUrl }/participants`
    return this.http.get<Participant[]>( url );
  }

  getParticipant( id: string ): Observable<Participant> {
    const url = `${ this.baseUrl }/participants/${ id }`
    return this.http.get<Participant>( url );
  }

  createParticipant( participant: Participant ): Observable<Participant> {
    const url = `${ this.baseUrl }/participants`
    return this.http.post<Participant>( url, participant )
      .pipe(
        tap( participant => {
          this.participantsSignal.update( participants => [ ...participants, participant ] );
        }
        )
      );
  }

  updateParticipant( participant: Participant ): Observable<Participant> {
    const { _id, ...updateParticipant } = participant;
    const url = `${ this.baseUrl }/participants/${ _id }`
    return this.http.patch<Participant>( url, updateParticipant ).pipe(
      tap( participant => {
        this.participantsSignal.update( participants =>
          participants.map( element =>
            element._id === participant._id ? participant : element )
        );
      } ),
    );
  }

  deleteParticipant( id: string ): Observable<Participant> {
    const url = `${ this.baseUrl }/participants/${ id }`
    return this.http.delete<Participant>( url )
      .pipe(
        tap( () => {
          this.participantsSignal.update( participants =>
            participants.filter( element => element._id !== id ) );
        } )
      )
      ;
  }

  get participants(): Signal<Participant[]> {
    return this.participantsSignal.asReadonly();
  }

  ngOnInit(): void {
    this.getParticipants()
      .subscribe( participants => {
        this.participantsSignal.set( participants );
      } )
  }
}
