import { Component, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { Modal } from '../../../shared/modals/modal.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Distance } from '../enums/distance.enum';
import { Participant } from '../../interfaces/participant.interface';
import { ValidatorService } from '../../../shared/validators/validator.service';
import { Observable, Subject } from 'rxjs';

@Component( {
  selector: 'add-participant-modal',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './add-participant-modal.component.html',
  styleUrl: './add-participant-modal.component.scss'
} )
export class AddParticipantModalComponent implements Modal<any, Participant | undefined>, OnDestroy{

  private validatorService = inject( ValidatorService );

  @Input()
  participant!: Participant

  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  private dialogConfirmed: Subject<Participant | undefined> = new Subject<Participant | undefined>();

  constructor( private elementRef: ElementRef<HTMLDialogElement> ) {
  }

  public addParticipant: FormGroup = new FormGroup( {
    firstname: new FormControl( 'jose', [
      Validators.required
    ] ),
    lastname: new FormControl('jose', [
      Validators.required
    ]),
    phone: new FormControl( '123456789', [
      Validators.required
    ] ),
    email: new FormControl( 'a@gmail.com', [
      Validators.required
    ] ),
    location: new FormControl( 'girona', [
      Validators.required
    ] ),
    distance: new FormControl( Distance.KM_37, [
      Validators.required
    ] )
  } )

  openDialog(): void {
    this.dialog.nativeElement.showModal();
  }

  afterClosed(): Observable<Participant | undefined> {
    return this.dialogConfirmed.asObservable();
  }


  onCancel() {
    this.closeAndResetForm();
    this.dialogConfirmed.next( undefined );
  }

  private closeAndResetForm() {
    this.addParticipant.reset();
    this.dialog.nativeElement.close();
  }

  onConfirm() {
    if ( this.addParticipant.invalid ) {
      this.addParticipant.markAllAsTouched();
      return;
    }
    this.dialogConfirmed.next( this.addParticipant.value as Participant );
    this.closeAndResetForm();
  }

  isNotValidField(field: string) {
    return this.validatorService.isNotValidField(this.addParticipant, field);
  }

  ngOnDestroy(): void {
    this.dialogConfirmed.unsubscribe();
  }

}
