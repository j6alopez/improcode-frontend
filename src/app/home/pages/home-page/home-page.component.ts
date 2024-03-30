import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { AddEventComponent } from '../../../calendar-events/components/add-event/add-event.component';
import { Observable, filter } from 'rxjs';

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
      // Add your events here
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
      // Add more events as needed
    ],
  };

  public closedObservable?: Observable<boolean>;

  handleDateClick( arg: any ) {
    console.log( 'djfhkjsahdfkjsdf' )
    this.addEventDialog?.openDialog( arg );
  }

  handleEventClick( clickInfo: EventClickArg ) {
    // Logic to handle event click
    alert( 'event' );
  }

  ngAfterViewInit(): void {
    this.closedObservable = this.addEventDialog.closeDialog();
    this.closedObservable.pipe(
      filter( isConfirmed => isConfirmed )
    ).subscribe( () => {
      console.log('empieza la movida')
    } );
  }
}



