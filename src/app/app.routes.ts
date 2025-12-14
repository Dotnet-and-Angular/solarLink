import { Routes } from '@angular/router';
import { CustomerDashboardComponent } from './components/dashboards/customer-dashboard/customer-dashboard.component';
import { AdminDashboardComponent } from './components/dashboards/admin-dashboard/admin-dashboard.component';
import { TechnicianDashboardComponent } from './components/dashboards/technician-dashboard/technician-dashboard.component';
import { InstallerDashboardComponent } from './components/dashboards/installer-dashboard/installer-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/pages/unauthorized/unauthorized.component';
import { roleGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login - SolarLink' },
    },
    {
        path: '',
        redirectTo: '/customer',
        pathMatch: 'full',
    },
    {
        path: 'customer',
        component: CustomerDashboardComponent,
        canActivate: [roleGuard],
        data: { title: 'Customer Dashboard', requiredRole: 'customer' },
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [roleGuard],
        data: { title: 'Admin Dashboard', requiredRole: 'admin' },
    },
    {
        path: 'technician',
        component: TechnicianDashboardComponent,
        canActivate: [roleGuard],
        data: { title: 'Technician Dashboard', requiredRole: 'technician' },
    },
    {
        path: 'installer',
        component: InstallerDashboardComponent,
        canActivate: [roleGuard],
        data: { title: 'Installer Dashboard', requiredRole: 'installer' },
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent,
        data: { title: 'Access Denied - SolarLink' },
    },
    {
        path: '**',
        redirectTo: '/customer',
    },
];

