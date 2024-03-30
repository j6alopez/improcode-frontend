import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject, Signal, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddParticipantModalComponent } from '../../components/add-participant-modal/add-participant-modal.component';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantListComponent } from '../../components/participant-list/participant-list.component';
import { ParticipantsService } from '../../participants.service';
import { DeleteParticipantModalComponent as DeleteParticipantModalComponent } from '../../components/delete-participant-modal/delete-participant-modal.component';
import { EditParticipantModalComponent } from '../../components/edit-participant-modal/edit-participant-modal.component';

@Component({
  selector: 'participants-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddParticipantModalComponent,
    DeleteParticipantModalComponent,
    EditParticipantModalComponent,
    ParticipantListComponent,
  ],
  templateUrl: './participants-page.component.html',
  styleUrl: './participants-page.component.scss'
})
export class ParticipantsListPageComponent implements OnInit {

  private participantsService: ParticipantsService = inject(ParticipantsService);

  @ViewChild('createParticipant')
  createDialog!: AddParticipantModalComponent;

  @ViewChild('editParticipant')
  editDialog!: EditParticipantModalComponent;

  @ViewChild('deleteParticipant')
  deleteDialog!: DeleteParticipantModalComponent;


  public participants!: Signal<Participant[]>;

  ngOnInit(): void {
    this.participants = computed(() => {
      return this.participantsService.participants();
    });
  }
}
