import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalendarEvent } from '../shared/events/calendar.event.interface';

@Injectable( {
  providedIn: 'root'
} )
export class CalendarEventsService {

  private http = inject( HttpClient );
  private baseUrl = environment.backend_base_url;
  private calendarEventsSignal = signal<CalendarEvent[]>( [] );

  constructor() {
    this.ngOnInit();
  }

  get calendarEvents(): Signal<CalendarEvent[]> {
    return this.calendarEventsSignal.asReadonly();
  }


  getCalendarEvents(): Observable<CalendarEvent[]> {
    const url = `${ this.baseUrl }/calendar-events`
    return this.http.get<CalendarEvent[]>( url );
  }

  getCalendarEvent( id: string ): Observable<CalendarEvent> {
    const url = `${ this.baseUrl }/calendar-events/${ id }`
    return this.http.get<CalendarEvent>( url );
  }

  createCalendarEvent( CalendarEvent: CalendarEvent ): Observable<CalendarEvent> {
    const url = `${ this.baseUrl }/calendar-events`
    return this.http.post<CalendarEvent>( url, CalendarEvent )
      .pipe(
        tap( calendarEvent => {
          this.calendarEventsSignal.update( calendarEvents => [ ...calendarEvents, calendarEvent ] );
        } )
      );
  }

  updateCalendarEvent( calendarEvent: CalendarEvent ): Observable<CalendarEvent> {
    const { _id, ...updateCalendarEvent } = calendarEvent;
    const url = `${ this.baseUrl }/calendar-events/${ _id }`
    return this.http.patch<CalendarEvent>( url, updateCalendarEvent ).pipe(
      tap( calendarEvent => {
        this.calendarEventsSignal.update( calendarEvents =>
          calendarEvents.map( element =>
            element._id === calendarEvent._id ? calendarEvent : element )
        );
      } )
    );
  }

  deleteCalendarEvent( id: string ): Observable<CalendarEvent> {
    const url = `${ this.baseUrl }/calendar-events/${ id }`
    return this.http.delete<CalendarEvent>( url ).pipe(
      tap( () => {
        this.calendarEventsSignal.update( calendarEvents =>
          calendarEvents.filter( element => element._id !== id ) );
      } )
    );
  }

  ngOnInit(): void {
    this.getCalendarEvents()
      .subscribe( calendarEvents => {
        this.calendarEventsSignal.set( calendarEvents );
      } )
  }
}
