import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantsService } from '../../participants.service';

@Component( {
  selector: 'delete-participant-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-participant-modal.component.html',
  styleUrl: './delete-participant-modal.component.scss'
} )
export class DeleteParticipantModalComponent {

  private participantsService = inject( ParticipantsService );

  @Input()
  participant!: Participant

  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  openDialog( participant: Participant ): void {
    this.participant = participant;
    this.dialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

  onCancel() {
    this.closeDialog();
  }

  onConfirm() {
    const { _id } = this.participant;
    if ( !_id ) return;
    this.participantsService.deleteParticipant( _id ).subscribe();
    this.closeDialog();
  }

}
