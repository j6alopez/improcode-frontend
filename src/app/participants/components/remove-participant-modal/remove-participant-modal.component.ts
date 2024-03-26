import { Component, ElementRef, ViewChild } from '@angular/core';
import { Modal } from '../../../shared/modals/interfaces/modal.interface';

@Component({
  selector: 'remove-participant-modal',
  standalone: true,
  imports: [],
  templateUrl: './remove-participant-modal.component.html',
  styleUrl: './remove-participant-modal.component.scss'
})
export class RemoveParticipantModalComponent {
onCancel() {
throw new Error('Method not implemented.');
}
onConfirm() {
throw new Error('Method not implemented.');
}
  @ViewChild('dialog')
  dialog!: ElementRef<HTMLDialogElement>;

  openDialog(): void {
    this.dialog.nativeElement.showModal();
  }
  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

}
