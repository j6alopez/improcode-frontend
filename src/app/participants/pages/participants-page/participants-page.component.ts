import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, Signal, computed, AfterViewInit, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddParticipantModalComponent } from '../../components/add-participant-modal/add-participant-modal.component';
import { Participant } from '../../interfaces/participant.interface';
import { ParticipantListComponent } from '../../components/participant-list/participant-list.component';
import { ParticipantsService } from '../../participants.service';
import { DeleteParticipantModalComponent as DeleteParticipantModalComponent } from '../../components/delete-participant-modal/delete-participant-modal.component';
import { EditParticipantModalComponent } from '../../components/edit-participant-modal/edit-participant-modal.component';
import { Observable, concatMap, filter, of, tap } from 'rxjs';

@Component( {
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
} )
export class ParticipantsListPageComponent implements OnInit, AfterViewInit {

  private participantsService: ParticipantsService = inject( ParticipantsService );

  @ViewChild( 'createParticipant' )
  createDialog!: AddParticipantModalComponent;

  @ViewChild( 'editParticipant' )
  editDialog!: EditParticipantModalComponent;

  @ViewChild( 'deleteParticipant' )
  deleteDialog!: DeleteParticipantModalComponent;

  public participants!: Signal<Participant[]>;

  private addDialogClosed?: Observable<Participant | undefined>;
  private editDialogClosed?: Observable<Participant | undefined>;
  private deleteDialogClosed?: Observable<Participant | undefined>;

  ngOnInit(): void {
    this.participants = computed( () => {
      return this.participantsService.participants();
    } );

  }

  ngAfterViewInit(): void {

    this.handleAddParticipant();
    this.handleEditParticipant();
    this.handleDeleteParticipant();

  }

  private handleAddParticipant(): void {
    this.addDialogClosed = this.createDialog.afterClosed();
    this.addDialogClosed.pipe(
      filter( participant => participant !== undefined ),
      concatMap( participant => {
        return this.participantsService.createParticipant( participant! );
      } )
    ).subscribe();
  }

  private handleEditParticipant(): void {
    this.editDialogClosed = this.editDialog.afterClosed();
    this.editDialogClosed.pipe(
      filter( participant => participant !== undefined ),
      concatMap( participant => {
        return this.participantsService.updateParticipant( participant! );
      } )
    ).subscribe();
  }

  private handleDeleteParticipant(): void {
    this.deleteDialogClosed = this.deleteDialog.afterClosed();
    this.deleteDialogClosed.pipe(
      filter( participant => participant !== undefined ),
      concatMap( participant => {
        if ( participant?._id ) {
          return this.participantsService.deleteParticipant( participant._id );
        }
        return of();
      } )
    ).subscribe();
  }

}
