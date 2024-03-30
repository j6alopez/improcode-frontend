import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { Participant } from '../../interfaces/participant.interface';
import { DeleteParticipantModalComponent } from '../delete-participant-modal/delete-participant-modal.component';
import { ParticipantsService } from '../../participants.service';
import { EditParticipantModalComponent } from '../edit-participant-modal/edit-participant-modal.component';

@Component({
  selector: 'participants-list',
  standalone: true,
  imports: [
    EditParticipantModalComponent,
    DeleteParticipantModalComponent
  ],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss'
})
export class ParticipantListComponent {

  private participantsService = inject(ParticipantsService);

  @Input()
  participants: Participant[] = [];
  @Output()
  onEditClicked = new EventEmitter<Participant>();
  @Output()
  onRemoveClicked = new EventEmitter<Participant>();


  editClicked(index: number): void {
    this.onEditClicked.emit(this.participants[index]);
  }

  removeClicked(index: number): void {
    this.onRemoveClicked.emit(this.participants[index]);
  }


}
