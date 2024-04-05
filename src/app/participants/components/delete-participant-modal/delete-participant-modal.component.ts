import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Participant } from '../../interfaces/participant.interface';
import { Observable, Subject } from 'rxjs';
import { Modal } from '../../../shared/modals/modal.interface';

@Component( {
  selector: 'delete-participant-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-participant-modal.component.html',
  styleUrl: './delete-participant-modal.component.scss'
} )
export class DeleteParticipantModalComponent implements Modal<Participant, Participant | undefined>, OnDestroy{

  private dialogSelection: Subject<Participant | undefined> = new Subject<Participant | undefined>();

  participant!: Participant

  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;


  openDialog(participant: Participant): void {
    this.participant = participant;
    this.dialog.nativeElement.showModal();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.dialogSelection.next( undefined );
  }

  onConfirm() {
    this.dialog.nativeElement.close();
    this.dialogSelection.next( this.participant );
  }

  afterClosed(): Observable<Participant | undefined> {
    return this.dialogSelection.asObservable();
  }

  ngOnDestroy(): void {
    this.dialogSelection.unsubscribe();
  }

}
