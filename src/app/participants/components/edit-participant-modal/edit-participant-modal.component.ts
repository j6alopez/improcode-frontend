import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Participant } from '../../interfaces/participant.interface';
import { Observable, Subject } from 'rxjs';
import { Modal } from '../../../shared/modals/modal.interface';

@Component( {
  selector: 'edit-participant-modal',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './edit-participant-modal.component.html',
  styleUrl: './edit-participant-modal.component.scss'
} )
export class EditParticipantModalComponent implements Modal<Participant, Participant | undefined> {

  private dialogConfirmed: Subject<Participant | undefined> = new Subject<Participant | undefined>();

  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  private participant!: Participant

  constructor( private elementRef: ElementRef<HTMLDialogElement> ) {
  }

  public editParticipant: FormGroup = new FormGroup( {
    firstname: new FormControl(
      '',
      [
        Validators.required
      ] ),
    lastname: new FormControl(
      '',
      [
        Validators.required
      ] ),
    phone: new FormControl(
      '',
      [
        Validators.required
      ] ),
    location: new FormControl(
      '',
      [
        Validators.required
      ] ),
    distance: new FormControl(
      '',
      [
        Validators.required
      ] )
  } )


  openDialog( participant: Participant ): void {
    this.participant = participant;
    this.editParticipant.patchValue( { ...participant } );
    this.dialog.nativeElement.showModal();
  }
  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

  onCancel() {
    this.editParticipant.reset();
    this.dialogConfirmed.next( undefined );
    this.closeDialog();
  }

  onConfirm() {
    this.dialog.nativeElement.close();

    this.dialogConfirmed.next( {
      ...this.participant,
      ...this.editParticipant.value,
    } );
  }

  afterClosed(): Observable<Participant | undefined> {
    return this.dialogConfirmed.asObservable();
  }

}
