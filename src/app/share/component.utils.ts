/**
 * @file 组件公共工具
 * @module app/share/component/utils
 */

import { AbstractControl } from "@angular/forms";

export function formControlStateClass(control: AbstractControl, error_class?: string, is_submited?: boolean): string {
    if (control.touched || control.root.touched || control.dirty || control.root.dirty || is_submited) {
        if (control.valid) {
            return 'has-success';
        } else {
            return error_class || 'has-error';
        }
    }
}