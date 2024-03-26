import { Component, Input } from '@angular/core';
import { Participant } from '../../interfaces/participant.interface';

@Component({
  selector: 'participants-list',
  standalone: true,
  imports: [],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss'
})
export class ParticipantListComponent {
  @Input()
  participants: Participant[] = [];
}
