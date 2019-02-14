/**
 * @file 复选框组件
 * @module app/share/checkbox/component
 */

import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgModel } from '@angular/forms';

@Component({
    selector: 'app-checkbox[ngModel]',
    templateUrl: "./checkbox.component.html",
    styleUrls: ["./checkbox.component.scss"]
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() disabled: boolean;
    @Input() label: string;
    @Input() value: string;
    @Input() checkboxClass: string;
    @Input() checkboxLabelClass: string;

    public model: NgModel;
    public state: boolean;

    constructor(@Self() state: NgModel) {
        this.model = state;
        state.valueAccessor = this;
    }

    public onChange(value: any): void {}
    public onTouch(value: any): void {}

    public writeValue(state: any): void {
        this.state = state;
    }

    public registerOnChange(fn: any): void {
        this.onChange = (state: boolean) => {
            this.writeValue(state);
            this.model.viewToModelUpdate(state);
        };
    }
    
    public registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
}
