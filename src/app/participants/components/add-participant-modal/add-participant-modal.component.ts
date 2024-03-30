import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Modal } from '../../../shared/modals/modal.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Distance } from '../enums/distance.enum';
import { ParticipantsService } from '../../participants.service';
import { Participant } from '../../interfaces/participant.interface';

@Component( {
  selector: 'add-participant-modal',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './add-participant-modal.component.html',
  styleUrl: './add-participant-modal.component.scss'
} )
export class AddParticipantModalComponent {

  private participantsService: ParticipantsService = inject( ParticipantsService );

  @Input()
  participant!: Participant

  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  constructor( private elementRef: ElementRef<HTMLDialogElement> ) {
  }

  public addParticipant: FormGroup = new FormGroup( {
    firstname: new FormControl( '', [
      Validators.required
    ] ),
    lastname: new FormControl( '', [
      Validators.required
    ] ),
    phone: new FormControl( '', [
      Validators.required
    ] ),
    email: new FormControl( '', [
      Validators.required
    ] ),
    location: new FormControl( '', [
      Validators.required
    ] ),
    distance: new FormControl( Distance.KM_37, [
      Validators.required
    ] )
  } )

  openDialog(): void {
    this.dialog.nativeElement.showModal();
  }
  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

  onCancel() {
    this.closeDialog();
  }

  onConfirm() {
    this.participantsService.createParticipant( this.participant )
    this.closeDialog();
  }

  onSubmit(): void {
    if ( this.addParticipant.invalid ) {
      this.addParticipant.markAllAsTouched();
      return;
    }
    const participant: Participant = this.addParticipant.value;
    this.participantsService.createParticipant( participant ).subscribe( participant => {
      this.closeDialog();
    } )
  }

}
