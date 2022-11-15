import { UsersChangeTrackerService } from './services/users-change-tracker.service';
import { filter, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from './models/user';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UsersService]
})
export class AppComponent implements OnInit {
  title = 'Macrix.Client';
  users$: Observable<User[]>;
  dataChanged$: Observable<boolean>;
  reloadUsers$ = new Subject<void>();

  columns = [
    {
      columnDef: 'firstName',
      header: 'First Name',
      cell: (user: User) => `${user.firstName}`
    },
    {
      columnDef: 'lastName',
      header: 'Last Name',
      cell: (user: User) => `${user.lastName}`
    },
    {
      columnDef: 'streetName',
      header: 'Street Name',
      cell: (user: User) => `${user.streetName}`
    },
    {
      columnDef: 'houseNumber',
      header: 'House Number',
      cell: (user: User) => `${user.houseNumber}`
    },
    {
      columnDef: 'apartmentNumber',
      header: 'Apartment Number',
      cell: (user: User) => `${user.apartmentNumber}`
    },
    {
      columnDef: 'postalCode',
      header: 'Postal Code',
      cell: (user: User) => `${user.postalCode}`
    },
    {
      columnDef: 'town',
      header: 'Town',
      cell: (user: User) => `${user.town}`
    },
    {
      columnDef: 'phoneNumber',
      header: 'Phone Number',
      cell: (user: User) => `${user.phoneNumber}`
    },
    {
      columnDef: 'dateOfBirth',
      header: 'Date of birth',
      cell: (user: User) => `${new Date(user.dateOfBirth).toLocaleDateString()}`
    },
    {
      columnDef: 'age',
      header: 'Age',
      cell: (user: User) => `${user.age}`
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      cell: null
    }
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(
    public dialog: MatDialog,
    private readonly usersService: UsersService,
    private readonly usersChangeTrackerService: UsersChangeTrackerService) {}

  ngOnInit(): void {
    this.users$ = this.reloadUsers$.pipe(
      startWith({}),
      switchMap(_ => this.usersService.getUsers())
    );

    this.dataChanged$ = this.usersChangeTrackerService.dataChanged();
  }

  onAdd(): void {
    this.openDialog();
  }

  onEdit(user: User): void {
    this.openDialog(user, true);
  }

  onRemove(user: User): void {
    this.usersService.deleteUser(user.id)
      .pipe(
        tap(_ => this.usersChangeTrackerService.markDataAsChanged()),
        tap(_ => this.reloadUsers$.next())
      ).subscribe();
  }

  onCancel(): void {
    this.usersService.discardChanges()
      .pipe(
        tap(_ => this.reloadUsers$.next()),
        tap(_ => this.usersChangeTrackerService.markDataAsClean())
      ).subscribe();
  }

  onSave(): void {
    this.usersService.saveChanges()
      .pipe(
        tap(_ => this.usersChangeTrackerService.markDataAsClean())
      ).subscribe();
  }

  private openDialog(user?: User, reloadUsers?: boolean): void {
    this.dialog
      .open(UserDialogComponent, {
        data: user
      }).afterClosed()
        .pipe(
          filter(result => !!result),
          tap(_ => this.reloadUsers$.next()))
        .subscribe();
  }
}

