import { UsersChangeTrackerService } from './../services/users-change-tracker.service';
import { UsersService } from './../services/users.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../models/user';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  userForm = new FormGroup({
    firstName: new FormControl(this.user?.firstName, [ Validators.required ]),
    lastName: new FormControl(this.user?.lastName, [ Validators.required ]),
    streetName: new FormControl(this.user?.streetName, [ Validators.required ]),
    houseNumber: new FormControl(this.user?.houseNumber, [ Validators.required ]),
    apartmentNumber: new FormControl(this.user?.apartmentNumber),
    postalCode: new FormControl(this.user?.postalCode, [ Validators.required ]),
    town: new FormControl(this.user?.town, [ Validators.required ]),
    phoneNumber: new FormControl(this.user?.town, [ Validators.required ]),
    dateOfBirth: new FormControl(this.user?.dateOfBirth, [ Validators.required, this.dateValidator() ])
  });

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key:string]: any} | null => {
      const today = new Date().getTime();

      if (!(control && control.value)) {
        return null;
      }

      return new Date(control.value).getTime() > today
        ? {invalidDate: 'You cannot use future dates'}
        : null;
    }
  }

  constructor(
    private readonly dialogRef: MatDialogRef<UserDialogComponent>,
    private readonly usersService: UsersService,
    private readonly usersChangeTrackerService: UsersChangeTrackerService,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }

  ngOnInit() {
    if (this.user) {
      this.userForm.setValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        streetName: this.user.streetName,
        houseNumber: this.user.houseNumber,
        apartmentNumber: this.user.apartmentNumber,
        postalCode: this.user.postalCode,
        town: this.user.town,
        phoneNumber: this.user.phoneNumber,
        dateOfBirth: this.user.dateOfBirth
      });
    }
  }

  reset(): void {
    this.userForm.reset();
    this.dialogRef.close();
  }

  submit(): void {
    if (!this.userForm.valid) {
      return;
    }

    this.user
      ? this.updateUser()
      : this.addUser();
  }

  private updateUser(): void {
    this.usersService.updateUser(this.user.id, this.userForm.value as User)
    .pipe(
      tap(_ => this.usersChangeTrackerService.markDataAsChanged()),
      tap(_ => this.dialogRef.close(true))
    ).subscribe();
  }

  private addUser(): void {
    this.usersService.addUser(this.userForm.value as User)
    .pipe(
      tap(_ => this.usersChangeTrackerService.markDataAsChanged()),
      tap(_ => this.dialogRef.close(true))
    ).subscribe();
  }
}

// export function dateValidator(): ValidatorFn {
//   return
// }
