import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Welcome to angular proyect'
  tasks = [
    'tarea 1',
    'tarea 2',
    'tarea 3'
  ]

  name = signal('Aldo');

  colorCtrl: FormControl = new FormControl();

  constructor(){
    this.colorCtrl.valueChanges.subscribe(val => {
      console.log(val);
      
    })
  }

  onChangeElement(event: Event){
    let input = event.target as HTMLInputElement
    console.log(input.value);
    const newValue = input.value;
    this.name.set(newValue);

  }


}
