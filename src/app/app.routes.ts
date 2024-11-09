import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';

export const routes: Routes = [
    {
        path: 'panel',
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'show',
                loadComponent: () => import('./components/panel/panel-show/panel-show.component')
                    .then(m => m.PanelShowComponent)
            },
            { path: '', redirectTo: 'show', pathMatch: 'full' }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login-show/login-show.component')
            .then(m => m.LoginShowComponent)
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];