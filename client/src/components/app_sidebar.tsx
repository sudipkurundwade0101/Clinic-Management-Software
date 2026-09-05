import React from 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                trigger?: string;
                target?: string;
                colors?: string;
                state?: string;
                className?: string;
            };
        }
    }
}

import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInset,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarFooter
} from '@/components/animate-ui/components/radix/sidebar';
import { Settings, LayoutDashboard, User2, LogOut, Calendar, Users, Stethoscope, FileText, CreditCard, ChartNoAxesCombined } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';

export const AppSidebar = ({ children }: { children?: React.ReactNode }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const getPageName = (pathname: string) => {
        switch (pathname) {
            case ROUTES.HOME:
            case ROUTES.DASHBOARD: return 'Dashboard Overview';
            case ROUTES.REPORTS: return 'Practice Report';
            case ROUTES.APPOINTMENTS: return 'Appointments';
            case ROUTES.PATIENTS: return 'Patients Registry';
            case ROUTES.DOCTORS: return 'Doctors & Staff';
            case ROUTES.MEDICAL_RECORDS: return 'Medical Records (EMR)';
            case ROUTES.BILLING: return 'Billing & Invoices';
            case ROUTES.SETTINGS: return 'Clinic Settings';
            case ROUTES.PROFILE: return 'Staff Profile';
            default:
                const segment = pathname.split('/').filter(Boolean).pop();
                if (!segment) return 'Clinic Portal';
                return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        }
    };

    const navItems = [
        { title: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard className="size-5 shrink-0" /> },
        { title: 'Reports', path: ROUTES.REPORTS, icon: <ChartNoAxesCombined className="size-5 shrink-0" /> },
        { title: 'Appointments', path: ROUTES.APPOINTMENTS, icon: <Calendar className="size-5 shrink-0" /> },
        { title: 'Patients', path: ROUTES.PATIENTS, icon: <Users className="size-5 shrink-0" /> },
        { title: 'Doctors & Staff', path: ROUTES.DOCTORS, icon: <Stethoscope className="size-5 shrink-0" /> },
        { title: 'Medical Records', path: ROUTES.MEDICAL_RECORDS, icon: <FileText className="size-5 shrink-0" /> },
        { title: 'Billing & Invoices', path: ROUTES.BILLING, icon: <CreditCard className="size-5 shrink-0" /> },
        { title: 'Settings', path: ROUTES.SETTINGS, icon: <Settings className="size-5 shrink-0" /> }
    ];

    return (
        <SidebarProvider>
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            <Stethoscope className="size-5" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold text-foreground">MediCare Clinic</span>
                            <span className="truncate text-xs text-muted-foreground">Management v1.0</span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Clinic Management</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.path)}>
                                            <Link to={item.path}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div 
                                        className="flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1 text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                                        data-size="lg"
                                    >
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                                            <User2 className="size-4" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.name || 'Dr. Medical Staff'}</span>
                                            <span className="truncate text-xs">{user?.email || 'staff@medicareclinic.com'}</span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" side="top">
                                    <DropdownMenuItem>
                                        <Link to={ROUTES.PROFILE} className="flex items-center gap-2 w-full">
                                            <User2 className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to={ROUTES.SETTINGS} className="flex items-center gap-2 w-full">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

            </Sidebar>


            {/* 
        Main layout content goes here. 
        Note that AppSidebar controls the layout shell, so we wrap {children} in SidebarInset and handle header.
      */}
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b px-4">
                    <div className="flex items-center gap-2 px-1">
                        <SidebarTrigger className="-ml-1" />
                        <span className="font-semibold text-sm">{getPageName(location.pathname)}</span>
                    </div>
                    <ThemeTogglerButton variant="ghost" className="shrink-0" />
                </header>
                <main className="flex flex-1 flex-col overflow-auto bg-background focus:outline-none relative">
                    <React.Suspense fallback={
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm gap-3 z-50">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
                                <Stethoscope className="size-5 animate-spin" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading page...</p>
                        </div>
                    }>
                        {children || <Outlet />}
                    </React.Suspense>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};
