import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarEvent } from '../../../shared/events/interfaces/calendar.event.interface';
import { CalendarEventsService } from '../../calendar-events.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Modal } from '../../../shared/modals/interfaces/modal.interface';

@Component( {
  selector: 'calendar-add-event',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
} )
export class AddEventComponent implements Modal<any, boolean>, AfterViewInit, OnDestroy {
  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;
  calendarEvent!: CalendarEvent;
  addEvent: FormGroup = new FormGroup(
    {
      title: new FormControl( '', [] ),
      start: new FormControl( '', [] ),
      end: new FormControl( '', [] )
    }
  );

  private dialogConfirmed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private confirmed: boolean = false;

  public openDialog( calendarEvent?: CalendarEvent ): void {
    // this.calendarEvent = calendarEvent;
    this.dialog.nativeElement.showModal();
  }

  closeDialog(): Observable<boolean> {
    return this.dialogConfirmed.asObservable();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.dialogConfirmed.next( false );
  }

  onConfirm() {
    this.dialog.nativeElement.close();
    this.dialogConfirmed.next( true );
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.dialogConfirmed.unsubscribe();
  }

}
