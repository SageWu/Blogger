import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

const user_back_routes: Routes = [
    { path: "",  }
];

@NgModule({
    imports: [
        RouterModule.forChild(user_back_routes)
    ],
    exports: [
        RouterModule
    ]
})
export class BackRoutingModule {}