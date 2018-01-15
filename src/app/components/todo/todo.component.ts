import { Component, Inject, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as task from '../../reducers';
import * as taskAction from '../../actions/task.actions';
import { DialogComponent } from '../../components/dialog/dialog.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs/Subject';

import { TaskService } from '../../services/task.service'
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  tasks$: Observable<Task[]>;
  isLoading$: Observable<boolean>;
  failActions$: Observable<Array<Action>>;
  tasks: Task[];
  failActions: Array<Action>;

  enableNetwork: boolean;

  constructor(private store: Store<task.State>,
    public dialog: MatDialog, 
    private taskService: TaskService) {
    this.tasks$ = store.select('task').select('entities');
    this.isLoading$ = store.select('task').select('loading');
    this.failActions$ = store.select('undoAction').select('failActions');
  }

  ngOnInit() {
    this.tasks$.subscribe(tasks => {
      this.tasks = JSON.parse(JSON.stringify(tasks));
    });

    this.failActions$.subscribe(action => {
      this.failActions = JSON.parse(JSON.stringify(action));
    });

    this.taskService.enableNetwork$.subscribe(val => {
      this.enableNetwork = val;
    });

    this.taskService.enableNetwork$.next(true);
    this.getData();
  }

  changeNetwork() {
    this.taskService.enableNetwork$.next(!this.enableNetwork);
  }

  getData() {
    this.store.dispatch(new taskAction.LoadAction());
  }

  add() {
    let task = new Task();
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new taskAction.AddAction(result));
      }
    });
  }

  update(task: Task) {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: Object.assign({}, task)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new taskAction.UpdateAction(result));
      }
    });
  }

  updateInline(task: Task) {
    this.store.dispatch(new taskAction.UpdateAction(task));
  }

  delete(task: Task) {
    this.store.dispatch(new taskAction.DeleteAction(task));
  }

  retryAction(action: Action) {
    this.store.dispatch(action);
  }
}

