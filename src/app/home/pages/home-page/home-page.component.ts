import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { AddEventComponent } from '../../../calendar-events/components/add-event/add-event.component';
import { Observable, filter } from 'rxjs';
import { CalendarEvent } from '../../../shared/events/calendar.event.interface';
import { CalendarEventsService } from '../../../calendar-events/calendar-events.service';
import { DateClickInfo } from '../../../third-party/full-calendar/date-click-info.interface';

@Component( {
  selector: 'app-home-page',
  standalone: true,
  imports: [
    FullCalendarModule,
    AddEventComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
} )
export class HomePageComponent implements AfterViewInit {

  private calendarEventService = inject( CalendarEventsService );

  @ViewChild( 'addEventDialog' )
  public addEventDialog!: AddEventComponent;

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
        event: this.handleEventClick.bind( this )
      }
    },
    events: [
      {
        title: 'First Race',
        start: '2024-03-28 09:00',
        end: '2024-03-28 13:00',
      },
      {
        title: 'Second Race',
        start: '2024-03-30',
        color: 'red'
      }
    ],
  };

  public modalClosed?: Observable<CalendarEvent | undefined>;

  handleDateClick( dateClickInfo: any ) {
    this.addEventDialog?.openDialog( dateClickInfo as DateClickInfo );
  }

  handleEventClick( clickInfo: EventClickArg ) {
    alert( 'event' );
  }

  ngAfterViewInit(): void {
    this.modalClosed = this.addEventDialog.closeDialog();
    this.modalClosed.pipe(
      filter( event => event !== undefined )
    ).subscribe( ( event ) => {
      this.calendarEventService.createCalendarEvent( event! ).subscribe();
    } );

  }
}



