import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject, signal, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Distance } from '../../interfaces/distance.enum';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantListComponent } from '../../components/participant-list/participant-list.component';
import { ParticipantsService } from '../../services/participants.service';
import { RemoveParticipantModalComponent } from '../../components/remove-participant-modal/remove-participant-modal.component';
import { AddParticipantModalComponent } from '../../components/add-participant-modal/add-participant-modal.component';

@Component({
  selector: 'participants-page',
  standalone: true,
  imports: [
    CommonModule,
    AddParticipantModalComponent,
    ParticipantListComponent,
    ReactiveFormsModule,
    RemoveParticipantModalComponent,
  ],
  templateUrl: './participants-page.component.html',
  styleUrl: './participants-page.component.scss'
})
export class ParticipantsListPageComponent implements OnInit {

  private participantsService: ParticipantsService = inject(ParticipantsService);

  @ViewChild('createParticipant')
  createDialog!: AddParticipantModalComponent;

  public participants!: Signal<Participant[]>;

  ngOnInit(): void {
    this.participants = computed(() => {
      return this.participantsService.participants();
    });
  }
}
