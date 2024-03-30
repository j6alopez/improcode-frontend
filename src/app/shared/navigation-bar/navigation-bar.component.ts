import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component( {
  selector: 'shared-navigation-bar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
} )
export class NavigationBarComponent {

}
