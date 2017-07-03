import { Injectable } from '@angular/core';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowService {

  private draggingStatus: boolean;

  constructor() { }

  get nativeWindow (): any {
    return getWindow();
  }

  setDraggingStatus(status) {
    this.draggingStatus = status;
  }

  getDraggingStatus() {
    return this.draggingStatus;
  }
}
