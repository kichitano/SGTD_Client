import { Directive, ElementRef, AfterViewInit, Renderer2, NgZone } from '@angular/core';

@Directive({
  selector: '[appImageBleed]',
  standalone: true
})
export class ImageBleedDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2, private ngZone: NgZone) { }

  ngAfterViewInit() {
    const img = this.el.nativeElement;
    if (img.complete) {
      this.onImageLoad(img);
    } else {
      img.onload = () => this.onImageLoad(img);
    }
  }

  private onImageLoad(img: HTMLImageElement) {
    this.ngZone.run(() => {
      const borderColor = this.extractBorderColor(img);
      this.renderer.setStyle(img.parentElement, 'backgroundColor', borderColor);
      setTimeout(() => {
        this.renderer.addClass(img, 'loaded');
      }, 50);
    });
  }

  private extractBorderColor(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx!.drawImage(img, 0, 0, img.width, img.height);

    const imageData = ctx!.getImageData(0, 0, 1, 1);
    const [r, g, b] = imageData.data;

    return `rgb(${r}, ${g}, ${b})`;
  }
}