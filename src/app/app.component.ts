import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';

@Component( {
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, NavigationBarComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
} )
export class AppComponent {
  title = 'improcode-frontend';
}
