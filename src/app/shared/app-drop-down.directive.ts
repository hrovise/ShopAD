import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive ({
    selector: '[appDropDown]'
})
export class DropDownDirective implements OnInit{



 @HostBinding('class.open')isOpen = false ;

    constructor(private elRef: ElementRef, private renderer: Renderer2) { }
    ngOnInit(): void {

    }

    @HostListener('click') mouseclick(){
        // this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
        this.isOpen= !this.isOpen;
      }
  }

