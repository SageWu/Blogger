/**
 * @file 记载组件
 * @module app/share/loading-spider/component
 */

import { Component, ViewChild, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'app-loading-spider',
    template: `
    <div #loadingSpider class="sa-loading-spider" [ngClass]="className">
        <div class="loader-mask"></div>
        <div class="loader-inner line-scale-pulse-out-rapid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    `,
    styleUrls: ["./loading-spider.component.scss"]
})
export class LoadingSpiderComponent {
    @Input() type = 400;
    @Input() show = false;

    @ViewChild('loadingSpider') private loadingSpider: ElementRef;

    get className() {
        return this.show ? 'flex' : 'none';
    }
}
