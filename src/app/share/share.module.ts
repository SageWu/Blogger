import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { LoadingSpiderComponent } from './loading-spider/loading-spider.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
    declarations: [
        CardComponent,
        LoadingSpiderComponent,
        CheckboxComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CardComponent,
        LoadingSpiderComponent,
        CheckboxComponent
    ]
})
export class ShareModule {}