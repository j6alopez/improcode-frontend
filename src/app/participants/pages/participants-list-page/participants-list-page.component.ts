import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'participants-list-page',
  standalone: true,
  imports: [],
  templateUrl: './participants-list-page.component.html',
  styleUrl: './participants-list-page.component.scss'
})
export class ParticipantsListPageComponent implements AfterViewInit{
  @ViewChild('dialogtest') dialog!: ElementRef<HTMLDialogElement>;

  closeModal() {
    this.dialog.nativeElement.close();
  }

  openModal() {
    this.dialog.nativeElement.showModal();

  }

  ngAfterViewInit() {
    this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const target = event.target as Element;
      if (target.nodeName === 'DIALOG') {
        this.closeModal();
      }
    });
  }

}
