import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Participant } from '../../interfaces/participant.interface';
import { Observable, Subject } from 'rxjs';
import { Modal } from '../../../shared/modals/modal.interface';
import { ValidatorService } from '../../../shared/validators/validator.service';
import { CommonModule } from '@angular/common';

@Component( {
  selector: 'edit-participant-modal',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule ],
  templateUrl: './edit-participant-modal.component.html',
  styleUrl: './edit-participant-modal.component.scss'
} )
export class EditParticipantModalComponent implements Modal<Participant, Participant | undefined> {

  private dialogConfirmed: Subject<Participant | undefined> = new Subject<Participant | undefined>();

  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  private participant!: Participant;
  private validatorService = inject( ValidatorService );

  constructor( private elementRef: ElementRef<HTMLDialogElement> ) {
  }

  public editParticipant: FormGroup = new FormGroup( {
    firstname: new FormControl('',
      [
        Validators.required, Validators.pattern(ValidatorService.onlyLettersPattern)
      ] ),
    lastname: new FormControl('',
      [
        Validators.required, Validators.pattern(ValidatorService.onlyLettersPattern)
      ] ),
    phone: new FormControl('',
      [
        Validators.required, Validators.pattern(ValidatorService.spanishPhonePattern)
      ] ),
    distance: new FormControl('',
      [
        Validators.required
      ] )
  } )

  openDialog( participant: Participant ): void {
    this.participant = participant;
    this.editParticipant.patchValue( { ...participant } );
    this.dialog.nativeElement.showModal();
  }

  onCancel() {
    this.editParticipant.reset();
    this.dialog.nativeElement.close();
    this.dialogConfirmed.next( undefined );
  }

  onConfirm() {
    if ( this.editParticipant.invalid ) {
      this.editParticipant.markAllAsTouched();
      return;
    }

    this.dialogConfirmed.next( {
      ...this.participant,
      ...this.editParticipant.value,
    } );
    this.dialog.nativeElement.close();
  }

  isNotValidField( field: string ) {
    return this.validatorService.isNotValidField( this.editParticipant, field );
  }

  afterClosed(): Observable<Participant | undefined> {
    return this.dialogConfirmed.asObservable();
  }

  ngOnDestroy(): void {
    this.dialogConfirmed.unsubscribe();
  }

}
