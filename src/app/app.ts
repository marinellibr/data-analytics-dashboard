import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent, CardComponent, IconComponent } from 'creamy-kit';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent, CardComponent, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Data Analytics Dashboard';
}
