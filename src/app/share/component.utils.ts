/**
 * @file 组件公共工具
 * @module app/share/component/utils
 */

import { AbstractControl } from "@angular/forms";

import { Category } from '@app/core/models/category.model';

//通过获取表单控制器的状态返回状态类
export function formControlStateClass(control: AbstractControl, error_class?: string, is_submited?: boolean): string {
    if (control.touched || control.root.touched || control.dirty || control.root.dirty || is_submited) {
        if (control.valid) {
            return 'has-success';
        } else {
            return error_class || 'has-error';
        }
    }
}

//构造文章目录级别
export function buildLevelCategories(categories: Category[]): Category[] {
    let result: Category[] = [];

    //构建树
    categories.forEach(
        (category: Category) => {
            categories.forEach(
                (child: Category) => {
                    if(child.parent_id === category._id) {
                        category.children = category.children || [];
                        category.children.push(child);
                        child["delete"] = true;
                    }
                }
            );
        }
    );

    categories = categories.filter(category => !category["delete"]);

    let flatTree = (parents: Category[], level: number) => {
        parents.forEach((parent: Category) => {
            parent.level = level;
            result.push(parent);

            if(parent.children && parent.children.length) {
                flatTree(parent.children, level + 1);
            }
        });
    }
    flatTree(categories, 0);

    return result;
}