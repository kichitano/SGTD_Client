import { Routes } from '@angular/router';

// export const routes: Routes = [
//     {
//         path: 'panel',
//         children: [
//             {
//                 path: 'show',
//                 loadComponent: () => import('./components/panel/panel-show/panel-show.component')
//                     .then(m => m.PanelShowComponent)
//             },
//             { path: '', redirectTo: 'show', pathMatch: 'full' } // Redirige a 'show' por defecto
//         ]
//     },
//     { path: '', redirectTo: '/panel/show', pathMatch: 'full' } // Ruta raíz redirige a panel/show
// ];

export const routes: Routes = [
    {
        path: 'panel',
        children: [
            {
                path: 'show',
                loadComponent: () => import('./components/panel/panel-show/panel-show.component')
                    .then(m => m.PanelShowComponent)
            },
            { path: '', redirectTo: 'show', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: '/panel/show', pathMatch: 'full' }
];
