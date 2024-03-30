import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantsService } from '../../participants.service';

@Component({
  selector: 'edit-participant-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-participant-modal.component.html',
  styleUrl: './edit-participant-modal.component.scss'
})
export class EditParticipantModalComponent implements OnInit{

  private participantsService: ParticipantsService = inject(ParticipantsService);

  @ViewChild('dialog')
  dialog!: ElementRef<HTMLDialogElement>;

  participant!: Participant

  constructor(private elementRef: ElementRef<HTMLDialogElement>) {
  }


  public editParticipant: FormGroup = new FormGroup({
    firstname: new FormControl(
     '',
      [
        Validators.required
      ]),
    lastname: new FormControl(
      '',
      [
        Validators.required
      ]),
    phone: new FormControl(
      '',
      [
        Validators.required
      ]),
    location: new FormControl(
      '',
      [
        Validators.required
      ]),
    distance: new FormControl(
      '',
      [
        Validators.required
      ])
  })


  openDialog( participant: Participant): void {
    this.participant = participant;
    this.editParticipant.patchValue({...participant });
    this.dialog.nativeElement.showModal();
  }
  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

  onCancel() {
    this.editParticipant.reset();
    this.closeDialog();
  }

  onConfirm() {
    if( !this.editParticipant.valid ) return;
    const updatedParticipant = { ...this.participant, ...this.editParticipant.value }
    this.participantsService.updateParticipant(updatedParticipant).subscribe();
    this.closeDialog();
  }

  ngOnInit(): void {
    this.dialog.nativeElement.addEventListener('click', event => {
      event.preventDefault();
    })
  }

}
