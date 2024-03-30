import { AfterViewInit, Component, ViewChild, inject, OnInit, Signal, computed } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { AddEventComponent } from '../../../calendar-events/components/add-event/add-event.component';
import { Observable, filter, map, of, switchMap, tap } from 'rxjs';
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

  public currentEvents!: Signal<CalendarEvent[]>;
  public fullCalendarEvents!: Signal<EventInput[]>;


  private eventToDelete: EventInput = {};

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
    const { title, start, end } = clickInfo.event;
    this.eventToDelete = this.fullCalendarEvents().filter( event => {
      event.title === title && event.start === start && event.end === end
    } )
    this.deleteEventDialog?.openDialog();
  }

  ngOnInit(): void {
    this.currentEvents = computed( () => {
      return this.calendarEventService.calendarEvents();
    } );

    this.fullCalendarEvents = computed( () => {
      return MapperCalendar.ToMulitpleEventInputs( this.currentEvents() )
    } );

  }

  ngAfterViewInit(): void {
    this.handleAddEvent();
    this.handleDeleteEvent();
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
      tap( deletionConfirmed => {
        if ( deletionConfirmed ) {
          this.eventToDelete = {};
        }
      } ),
      filter( deleteAction => deleteAction )
    ).subscribe();
  }
}
