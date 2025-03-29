import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LogindGuard } from './guards/login.guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
    {
        path:"dashboard",
        loadChildren: () => import("./dashboard/dashboard.routes").then(m => m.routes),
        canActivate:[LogindGuard]
    },
    {
        path:"auth",
        loadChildren: () => import("./auth/auth.routes").then(m => m.routes),
        canActivate: [IsAuthenticatedGuard]
    },
    {
        path:"",
        redirectTo:"dashboard",
        pathMatch:"full"
    },
    {
        path:"**",
        component: NotFoundComponent
    }
];
