import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Task } from '../../models/task';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  newFilter = computed(() => {
    let filter =  this.filter();
    let tasks =  this.tasks();
    if(filter === 'pending'){
      return tasks.filter((task) => !task.completed);
    }
    if(filter === 'completed'){
      return tasks.filter((task) => task.completed);
    }
    return tasks
  })

  injector = inject(Injector);

  newTask: FormControl = new FormControl('',{
    nonNullable: true,
    validators:[
      Validators.required
    ]
  })

  // constructor(){
  //   effect(() => {
  //     const tasks = this.tasks();
  //     console.log('effects');
  //     console.log(tasks);
      
  //     localStorage.setItem('tasks',JSON.stringify(tasks));
  //   })
  // }

  ngOnInit(): void {
    const storage = localStorage.getItem('tasks');
    if(storage) this.tasks.set(JSON.parse(storage))
    this.trakcTrasks()
  }

  trakcTrasks(){
    effect(() => {
      const tasks = this.tasks();
      console.log('effects');
      localStorage.setItem('tasks',JSON.stringify(tasks));
      
    },{injector: this.injector})
  }

  handlerTasks(){
    const  value = this.newTask.value.trim();
    if (this.newTask.invalid || value === '') return;
    this.addTask(value);
    this.newTask.setValue('');
  }
  
  addTask(title:string){
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(index:number){
    this.tasks.update((tasks) => {
      return tasks.map((task,position) => {
        if(position === index) return {...task,completed: !task.completed};
        return task;
      })
    })
  }

  deleteTask(index:number){
    this.tasks.update((tasks) => tasks.filter((task,position) => position != index));
  }

  editingMode(index: number){
    this.tasks.update((tasks) => {
      return tasks.map((task,position) => {
        if(position === index) return {...task,editing: true};
        return {
          ...task,
          editing: false
        };
      })
    })
  }

  editTask(index:number, event: Event){
    let input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task,position) => {
        if(position === index) return {...task, title: input.value.trim() ,editing: false};
        return task;
      })
    })
  }

  changeFilter(filter:'all' | 'pending' | 'completed' ){
    this.filter.set(filter);
  }
}
