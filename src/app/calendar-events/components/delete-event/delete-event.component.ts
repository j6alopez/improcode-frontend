import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { Modal } from '../../../shared/modals/modal.interface';
import { CommonModule } from '@angular/common';

@Component( {
  selector: 'calendar-delete-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './delete-event.component.html',
  styleUrl: './delete-event.component.scss'
} )
export class DeleteEventComponent implements Modal<void, boolean> {
  @ViewChild( 'dialog' )
  dialog!: ElementRef<HTMLDialogElement>;

  private dialogConfirmed: Subject<boolean> = new Subject<boolean>();

  public openDialog(): void {
    this.dialog.nativeElement.showModal();
  }
  afterClosed(): Observable<boolean> {
    return this.dialogConfirmed.asObservable();
  }

  onCancel() {
    this.dialog.nativeElement.close();
    this.dialogConfirmed.next( false );
  }

  onConfirm() {
    this.dialog.nativeElement.close();
    this.dialogConfirmed.next( true );
  }

  ngOnDestroy(): void {
    this.dialogConfirmed.unsubscribe();
  }

}
