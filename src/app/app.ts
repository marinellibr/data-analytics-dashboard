import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from 'creamy-kit/lib/actions/button/button.component';
import { CardComponent } from 'creamy-kit/lib/data-display/card/card.component';
import { IconComponent } from 'creamy-kit/lib/media/icon/icon.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonComponent, CardComponent, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Data Analytics Dashboard';
}
