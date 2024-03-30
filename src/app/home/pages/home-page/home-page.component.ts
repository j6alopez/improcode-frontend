import { AfterViewInit, Component, ViewChild, inject, OnInit, Signal, computed } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { AddEventComponent } from '../../../calendar-events/components/add-event/add-event.component';
import { Observable, filter, map, of, switchMap, tap, concatMap } from 'rxjs';
import { CalendarEvent } from '../../../shared/events/calendar.event.interface';
import { CalendarEventsService } from '../../../calendar-events/calendar-events.service';
import { DateClickInfo } from '../../../third-party/full-calendar/date-click-info.interface';
import { MapperCalendar } from '../../../calendar-events/mappers/MapperCalendar';
import { DeleteEventComponent } from '../../../calendar-events/components/delete-event/delete-event.component';

@Component( {
  selector: 'home-page',
  standalone: true,
  imports: [
    FullCalendarModule,
    AddEventComponent,
    DeleteEventComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
} )
export class HomePageComponent implements OnInit, AfterViewInit {

  @ViewChild( 'addEventDialog' )
  public addEventDialog!: AddEventComponent;

  @ViewChild( 'deleteEventDialog' )
  public deleteEventDialog!: DeleteEventComponent;

  @ViewChild( 'calendar' )
  public calendar!: FullCalendarComponent;

  private calendarEventService = inject( CalendarEventsService );

  public fullCalendarEvents!: Signal<EventInput[]>;
  public calendarEvents!: Signal<CalendarEvent[]>;


  private eventToDelete: CalendarEvent | undefined = undefined;

  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [ dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin ],
    themeSystem: 'bootstrap5',
    headerToolbar: {
      start: 'title',
      right: 'dayGridMonth,dayGridWeek,timeGridFiveDay,prev,next'
    },
    locale: 'en',
    timeZone: 'GMT+1',
    views: {
      timeGridFiveDay: {
        type: 'timeGrid',
        duration: { days: 5 },
        buttonText: '5 days',
        editable: true,
        selectable: true,
        dateClick: this.handleDateClick.bind( this ),
        eventClick: this.handleEventClick.bind( this )
      }
    },
  };

  private addEventDialogClosed?: Observable<CalendarEvent | undefined>;
  private deleteEventDialogClosed?: Observable<boolean>;

  handleDateClick( dateClickInfo: any ) {
    this.addEventDialog?.openDialog( dateClickInfo as DateClickInfo );
  }

  handleEventClick( clickInfo: EventClickArg ) {
    const { title } = clickInfo.event._def;
    this.eventToDelete = this.calendarEvents().find( element => {
      return element.title === title;
    } );
    this.deleteEventDialog?.openDialog();
  }

  private handleAddEvent(): void {
    this.addEventDialogClosed = this.addEventDialog.afterClosed();
    this.addEventDialogClosed.pipe(
      filter( event => event !== undefined )
    ).subscribe();
  }

  private handleDeleteEvent(): void {
    this.deleteEventDialogClosed = this.deleteEventDialog.afterClosed();
    this.deleteEventDialogClosed.pipe(
      filter( confirmed => confirmed ),
      concatMap( () => {
        if ( this.eventToDelete && this.eventToDelete._id ) {
          return this.calendarEventService.deleteCalendarEvent( this.eventToDelete._id );
        }
        return of();
      } )

    ).subscribe();
  }


  ngOnInit(): void {
    this.calendarEvents = computed( () => {
      return this.calendarEventService.calendarEvents();
    } )
    this.fullCalendarEvents = computed( () => {
      return MapperCalendar.ToMulitpleEventInputs( this.calendarEvents() )
    } );

  }

  ngAfterViewInit(): void {
    this.handleAddEvent();
    this.handleDeleteEvent();
  }

}
