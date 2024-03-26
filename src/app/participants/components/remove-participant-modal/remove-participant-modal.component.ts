import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantsListPageComponent } from '../../pages/participants-page/participants-page.component';
import { ParticipantsService } from '../../services/participants.service';

@Component({
  selector: 'remove-participant-modal',
  standalone: true,
  imports: [],
  templateUrl: './remove-participant-modal.component.html',
  styleUrl: './remove-participant-modal.component.scss'
})
export class RemoveParticipantModalComponent {

  private ParticipantsService = inject(ParticipantsService);

  @Input( )
  participant!: Participant

  @ViewChild('dialog')
  dialog!: ElementRef<HTMLDialogElement>;

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
    this.ParticipantsService.removeParticipant(this.participant)
    this.closeDialog();
  }

}
