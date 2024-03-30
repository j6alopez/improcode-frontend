import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarEvent } from '../../../shared/events/calendar.event.interface';
import { Subject, Observable } from 'rxjs';
import { Modal } from '../../../shared/modals/modal.interface';
import { CommonModule, formatDate } from '@angular/common';
import { DateClickInfo } from '../../../third-party/full-calendar/date-click-info.interface';

@Component( {
  selector: 'calendar-add-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
} )
export class AddEventComponent implements Modal<any, CalendarEvent | undefined>, AfterViewInit, OnDestroy {
  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;
  calendarEvent!: CalendarEvent;
  addEventForm: FormGroup = new FormGroup(
    {
      title: new FormControl( '', [ Validators.required ] ),
      start_date: new FormControl( { disabled: true }, [ Validators.required ] ),
      end_date: new FormControl( [ Validators.required ] )
    }
  );

  private dialogConfirmed: Subject<CalendarEvent | undefined> = new Subject<CalendarEvent | undefined>();

  public openDialog( dateClickInfo: DateClickInfo ): void {
    this.initializeForm( dateClickInfo );
    this.dialog.nativeElement.showModal();
  }

  initializeForm( dateClickInfo: DateClickInfo ) {
    const ADDITIONAL_HOURS: number = 1;
    const startEventDate: Date = new Date( dateClickInfo.date );

    this.addEventForm.get( 'start_date' )?.setValue( startEventDate.toISOString().substring( 0, 16 ) );

    const endEventDate: Date = new Date( startEventDate.getTime() );
    endEventDate.setHours( startEventDate.getHours() + ADDITIONAL_HOURS );
    this.addEventForm.get( 'end_date' )?.setValue( endEventDate.toISOString().substring( 0, 16 ) );
  }

  afterClosed(): Observable<CalendarEvent | undefined> {
    return this.dialogConfirmed.asObservable();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.dialogConfirmed.next( undefined );
  }

  onConfirm() {
    if ( this.addEventForm.invalid ) {
      this.addEventForm.markAllAsTouched();
      return;
    }
    this.dialog.nativeElement.close();

    this.calendarEvent = this.addEventForm.value;
    this.dialogConfirmed.next( this.calendarEvent );
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.dialogConfirmed.unsubscribe();
  }

}
