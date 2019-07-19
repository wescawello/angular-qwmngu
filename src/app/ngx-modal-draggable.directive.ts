import { Directive, AfterViewInit, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[ngxModalDraggable]'
})
export class NgxModalDraggableDirective implements AfterViewInit {
  private modalElement: HTMLElement;

  private topStart: number;

  private leftStart: number;

  private isDraggable: boolean;

  private handleElement: HTMLElement;
  constructor(private element: ElementRef) {
  }
  ngAfterViewInit() {

    let element = this.element.nativeElement;


    //only make the modal header draggable

    this.handleElement = element;//;.querySelector('.modal-header');


    console.log(this.handleElement);
    //change cursor on the header

    this.handleElement.style.cursor = 'pointer';


    //get the modal parent container element: that's the element we're going to move around

    for (let level = 3; level > 0; level--) {

      element = element.parentNode;

    }



    this.modalElement = element;

    // this.modalElement.style.position = 'relative';

  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {

    if (event.button === 2 || (this.handleElement && event.target !== this.handleElement)) {
      //console.log('jjkk');

      //console.log(event.button);
      //console.log(this.handleElement);
      //console.log(event.target);

      return; // prevents right click drag

    }


    //enable dragging

    this.isDraggable = true;



    //store original position

    this.topStart = event.clientY - Number(this.modalElement.style.top.replace('px', ''));

    this.leftStart = event.clientX - Number(this.modalElement.style.left.replace('px', ''));

    event.preventDefault();

  }



  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {

    this.isDraggable = false;

  }



  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDraggable) {
      //on moving the mouse, reposition the modal
      this.modalElement.style.top = (event.clientY - this.topStart) + 'px';
      this.modalElement.style.left = (event.clientX - this.leftStart) + 'px';
    }
  }



  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.isDraggable = false;
  }


}
