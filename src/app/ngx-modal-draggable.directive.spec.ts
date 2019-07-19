import { NgxModalDraggableDirective } from './ngx-modal-draggable.directive';
import { ElementRef } from '@angular/core';






describe('NgxModalDraggableDirective', () => {
  it('should create an instance', () => {
    let el: ElementRef;
    const directive = new NgxModalDraggableDirective(el);
    expect(directive).toBeTruthy();
  });
});
