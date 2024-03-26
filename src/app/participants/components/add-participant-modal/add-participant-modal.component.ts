import { Component, ElementRef } from '@angular/core';
import { Modal } from '../../../shared/modals/interfaces/modal.interface';

@Component({
  selector: 'add-participant-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-participant-modal.component.html',
  styleUrl: './add-participant-modal.component.scss'
})
export class AddParticipantModalComponent implements Modal {

  constructor(private elementRef: ElementRef<HTMLDialogElement>) {
  }

  open(): void {
    throw new Error('Method not implemented.');
  }
  close(): void {
    throw new Error('Method not implemented.');
  }
  onSave(): void {
    throw new Error('Method not implemented.');
  }
  onCancel(): void {
    throw new Error('Method not implemented.');
  }
}
