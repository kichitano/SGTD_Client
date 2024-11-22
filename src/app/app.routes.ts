import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { AuthRedirectGuard } from '../guard/auth-redirect.guard';

export const routes: Routes = [
    {
        path: 'panel',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./components/panel/panel-show/panel-show.component')
                    .then(m => m.PanelShowComponent)
            }
        ]
    },
    {
        path: 'login',
        canActivate: [AuthRedirectGuard],
        loadComponent: () => import('./components/login/login-show/login-show.component')
            .then(m => m.LoginShowComponent)
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];