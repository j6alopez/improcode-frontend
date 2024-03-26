import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { Participant } from '../../interfaces/participant.interface';
import { RemoveParticipantModalComponent } from '../remove-participant-modal/remove-participant-modal.component';
import { ParticipantsService } from '../../services/participants.service';

@Component({
  selector: 'participants-list',
  standalone: true,
  imports: [
    RemoveParticipantModalComponent
  ],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss'
})
export class ParticipantListComponent {

  private participantsService = inject(ParticipantsService);

  @Input()
  participants: Participant[] = [];

}
