import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject, signal, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Distance } from '../../interfaces/distance.enum';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantListComponent } from '../../components/participant-list/participant-list.component';
import { ParticipantsService } from '../../services/participants.service';
import { RemoveParticipantModalComponent } from '../../components/remove-participant-modal/remove-participant-modal.component';

@Component({
  selector: 'participants-page',
  standalone: true,
  imports: [
    CommonModule,
    ParticipantListComponent,
    ReactiveFormsModule,
    RemoveParticipantModalComponent,
  ],
  templateUrl: './participants-page.component.html',
  styleUrl: './participants-page.component.scss'
})
export class ParticipantsListPageComponent implements OnInit, AfterViewInit {

  private participantsService: ParticipantsService = inject(ParticipantsService);

  @ViewChild('createParticipant')
  createDialog!: ElementRef<HTMLDialogElement>;

  public participants!: Signal<Participant[]>;

  public addParticipant: FormGroup = new FormGroup({
    firstname: new FormControl('', [
      Validators.required
    ]),
    lastname: new FormControl('', [
      Validators.required
    ]),
    phone: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required
    ]),
    location: new FormControl('', [
      Validators.required
    ]),
    distance: new FormControl(Distance.KM_37, [
      Validators.required
    ])
  })

  closeModal() {
    this.createDialog.nativeElement.close();
  }

  openModal() {
    this.createDialog.nativeElement.showModal();
  }

  openModalRemove() {
    this.createDialog.nativeElement.showModal();
  }

  ngOnInit(): void {
    this.participants = computed(() => {
      return this.participantsService.participants();
    });
  }

  ngAfterViewInit() {
    this.createDialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
    });
  }

  onSubmit(): void {
    if (this.addParticipant.invalid) {
      this.addParticipant.markAllAsTouched();
      return;
    }
    const participant: Participant = this.addParticipant.value;
    this.participantsService.createParticipant(participant).subscribe(participant => {
      this.closeModal();
      this.participantsService.addParticipant(participant);
    })
  }

}
