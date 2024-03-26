import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParticipantListComponent } from '../../components/participant-list/participant-list.component';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantsService } from '../../services/participants.service';
import { CommonModule } from '@angular/common';
import { Distance } from '../../interfaces/distance.enum';
import { RemoveParticipantModalComponent } from '../../components/remove-participant-modal/remove-participant-modal.component';

@Component({
  selector: 'participants-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ParticipantListComponent,
    CommonModule,
    RemoveParticipantModalComponent
  ],
  templateUrl: './participants-page.component.html',
  styleUrl: './participants-page.component.scss'
})
export class ParticipantsListPageComponent implements OnInit, AfterViewInit {

  private participantsService: ParticipantsService = inject(ParticipantsService);

  @ViewChild('dialogtest')
  dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('removemodal')
  dialog2!: RemoveParticipantModalComponent;

  public participants: Participant[] = [];

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
    this.dialog.nativeElement.close();
  }

  openModal() {
    this.dialog.nativeElement.showModal();
  }

  openModalRemove() {
    this.dialog.nativeElement.showModal();
  }

  ngOnInit(): void {
    this.participantsService.getParticipants()
      .subscribe(participants => {
        console.log(participants);
        this.participants = participants
      });
  }

  ngAfterViewInit() {
    this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const target = event.target as Element;
    });
  }

  onSubmit(): void {
    if (this.addParticipant.invalid) {
      this.addParticipant.markAllAsTouched();
      console.log('nop');
      return;
    }
    const participant: Participant = this.addParticipant.value;
    this.participantsService.createParticipant(participant).subscribe( participant => {
      this.participants.push(participant);
      this.closeModal();
    })
  }

}
