import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarEvent } from '../../../shared/events/calendar.event.interface';
import { Subject, Observable } from 'rxjs';
import { Modal } from '../../../shared/modals/modal.interface';
import { CommonModule } from '@angular/common';
import { DateClickInfo } from '../../../third-party/full-calendar/date-click-info.interface';
import { ValidatorService } from '../../../shared/validators/validator.service';

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
export class AddEventComponent implements Modal<any, CalendarEvent | undefined>, OnDestroy {
  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  constructor( private validatorService: ValidatorService ) { }

  calendarEvent!: CalendarEvent;

  addEventForm: FormGroup = new FormGroup(
    {
      title: new FormControl( '', [ Validators.required ] ),
      start_date: new FormControl( [ Validators.pattern(ValidatorService.datePattern) ] ),
      end_date: new FormControl( '', [  Validators.pattern(ValidatorService.datePattern) ] )
    },
    {
      validators: [
        this.validatorService.isFielOneGreaterThanFieldTwoDates( 'end_date', 'start_date' )
      ]

    }
  );

  private dialogConfirmed: Subject<CalendarEvent | undefined> = new Subject<CalendarEvent | undefined>();

  public openDialog( dateClickInfo: DateClickInfo ): void {
    this.initializeForm( dateClickInfo );
    this.dialog.nativeElement.showModal();
  }

  initializeForm( dateClickInfo: DateClickInfo ) {
    const startEventDate: Date = new Date( dateClickInfo.date );
    this.addEventForm.get( 'start_date' )?.setValue( startEventDate.toISOString().substring( 0, 16 ) );
    const ADDITIONAL_HOURS: number = 1;
    const endEventDate: Date = new Date( startEventDate.getTime() );
    endEventDate.setHours( startEventDate.getHours() + ADDITIONAL_HOURS );

    this.addEventForm.get( 'end_date' )?.setValue( endEventDate.toISOString().substring( 0, 16 ) );
  }

  afterClosed(): Observable<CalendarEvent | undefined> {
    return this.dialogConfirmed.asObservable();
  }

  onCancel() {
    this.closeAndResetForm();
    this.dialogConfirmed.next( undefined );
  }

  onConfirm() {
    if ( this.addEventForm.invalid ) {
      this.addEventForm.markAllAsTouched();
      return;
    }
    console.log('fdsfsfdf')
    this.dialogConfirmed.next( this.addEventForm.value as CalendarEvent );
    this.closeAndResetForm();
  }

  private closeAndResetForm() {
    this.addEventForm.reset();
    this.dialog.nativeElement.close();
  }

  getFormErrors(): string | null {
    return this.addEventForm.getError( 'notGreater' );
  }

  isNotValidField(field: string) {
    return this.validatorService.isNotValidField(this.addEventForm, field);
  }

  ngOnDestroy(): void {
    this.dialogConfirmed.unsubscribe();
  }

}
