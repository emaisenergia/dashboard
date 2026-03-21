'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    DollarSign,
    Package,
    TrendingUp,
    BarChart2,
    Bell,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Rocket,
    Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

const navPrincipal = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/operations-dashboard', badge: null },
    { label: 'Financeiro', icon: DollarSign, href: '/financial-management', badge: null },
    { label: 'Produtos', icon: Package, href: '/product-management', badge: null },
    { label: 'Atendentes', icon: Users, href: '/atendentes', badge: null },
];

const navAnalise = [
    { label: 'Performance', icon: TrendingUp, href: '/performance', badge: null },
    { label: 'Relatórios', icon: BarChart2, href: '/reports', badge: null },
];

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    function handleLogout() {
        logout();
        router.push('/login');
    }

    // Get initials from user name
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : 'U';

    const NavItem = ({ label, icon: Icon, href, badge }: typeof navPrincipal[0]) => {
        const active = isActive(href);
        return (
            <li>
                <Link href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group"
                    style={active ? {
                        background: 'linear-gradient(135deg, hsl(262 83% 30% / 0.5), hsl(240 83% 28% / 0.4))',
                        color: 'hsl(262 83% 80%)',
                        boxShadow: 'inset 0 0 0 1px hsl(262 83% 50% / 0.3)',
                    } : { color: 'hsl(215 20% 65%)' }}
                    title={collapsed ? label : undefined}>
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span className="flex-1">{label}</span>}
                    {!collapsed && badge && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold"
                            style={{ background: 'hsl(38 92% 40%)', color: 'hsl(38 92% 90%)' }}>
                            {badge}
                        </span>
                    )}
                    {collapsed && badge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full"
                            style={{ background: 'hsl(38 92% 56%)' }} />
                    )}
                </Link>
            </li>
        );
    };

    return (
        <aside className="relative flex flex-col shrink-0 transition-all duration-300"
            style={{ width: collapsed ? '64px' : '220px', background: 'hsl(222 47% 8%)', borderRight: '1px solid hsl(222 30% 15%)' }}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 overflow-hidden">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, hsl(262 83% 66%), hsl(240 83% 60%))' }}>
                    <Rocket size={16} className="text-white" />
                </div>
                {!collapsed && <span className="font-bold text-base text-white whitespace-nowrap">OpsDash</span>}
            </div>

            {/* Collapse button */}
            <button onClick={onToggle}
                className="absolute -right-3 top-6 z-10 flex items-center justify-center w-6 h-6 rounded-full transition-colors"
                style={{ background: 'hsl(222 35% 14%)', border: '1px solid hsl(222 30% 20%)', color: 'hsl(215 20% 65%)' }}>
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            <nav className="flex-1 overflow-y-auto px-2 pb-4">
                {/* Principal */}
                {!collapsed && (
                    <p className="px-3 pt-4 pb-2 text-[10px] font-semibold tracking-widest uppercase"
                        style={{ color: 'hsl(215 20% 45%)' }}>Principal</p>
                )}
                {collapsed && <div className="pt-4" />}
                <ul className="space-y-0.5">
                    {navPrincipal.map(item => <NavItem key={item.href} {...item} />)}
                </ul>

                {/* Análise */}
                {!collapsed && (
                    <p className="px-3 pt-5 pb-2 text-[10px] font-semibold tracking-widest uppercase"
                        style={{ color: 'hsl(215 20% 45%)' }}>Análise</p>
                )}
                {collapsed && <div className="pt-4" />}
                <ul className="space-y-0.5">
                    {navAnalise.map(item => <NavItem key={item.href} {...item} />)}
                </ul>
            </nav>

            {/* Bottom actions */}
            <div className="border-t px-2 py-3 space-y-0.5" style={{ borderColor: 'hsl(222 30% 15%)' }}>
                <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
                    style={{ color: 'hsl(215 20% 65%)' }}>
                    <Bell size={18} className="shrink-0" />
                    {!collapsed && <span>Notificações</span>}
                </button>
                <Link href="/settings"
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                    style={isActive('/settings') ? {
                        background: 'linear-gradient(135deg, hsl(262 83% 30% / 0.5), hsl(240 83% 28% / 0.4))',
                        color: 'hsl(262 83% 80%)',
                        boxShadow: 'inset 0 0 0 1px hsl(262 83% 50% / 0.3)',
                    } : { color: 'hsl(215 20% 65%)' }}
                    title={collapsed ? 'Configurações' : undefined}>
                    <Settings size={18} className="shrink-0" />
                    {!collapsed && <span>Configurações</span>}
                </Link>
            </div>

            {/* User */}
            <div className="border-t px-3 py-3 flex items-center gap-3 overflow-hidden"
                style={{ borderColor: 'hsl(222 30% 15%)' }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-bold text-white"
                    style={{ background: user?.avatarColor || 'linear-gradient(135deg, hsl(262 83% 60%), hsl(200 83% 50%))' }}>
                    {initials}
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuário'}</p>
                        <p className="text-xs truncate" style={{ color: 'hsl(215 20% 50%)' }}>{user?.email || ''}</p>
                    </div>
                )}
                {!collapsed && (
                    <button onClick={handleLogout}
                        title="Sair"
                        className="hover:text-white transition-colors"
                        style={{ color: 'hsl(215 20% 50%)' }}>
                        <LogOut size={16} />
                    </button>
                )}
                {collapsed && (
                    <button onClick={handleLogout}
                        title="Sair"
                        className="hover:text-white transition-colors absolute bottom-3 right-2"
                        style={{ color: 'hsl(215 20% 50%)' }}>
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </aside>
    );
}
