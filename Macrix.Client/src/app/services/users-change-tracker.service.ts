import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersChangeTrackerService {

  private readonly dataChangedKey = 'data-changed';
  private readonly usersChanged = new BehaviorSubject<boolean>(false);

  constructor() {
    const valueFromStorage = sessionStorage.getItem(this.dataChangedKey);
    if (valueFromStorage) {
      this.usersChanged.next(true);
    }
  }

  markDataAsChanged(): void {
    this.usersChanged.next(true);
    sessionStorage.setItem(this.dataChangedKey, 'true');
  }

  markDataAsClean(): void {
    this.usersChanged.next(false);
    sessionStorage.removeItem(this.dataChangedKey);
  }

  dataChanged(): Observable<boolean> {
    return this.usersChanged;
  }
}
