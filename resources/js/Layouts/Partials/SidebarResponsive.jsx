import ApplicationLogo from '@/components/ApplicationLogo';
import NavLinkResponsive from '@/Components/NavLinkResponsive';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
    IconAlertCircle,
    IconBook,
    IconBuildingCommunity,
    IconCategory,
    IconChartDots2,
    IconCircleKey,
    IconCreditCardPay,
    IconCreditCardRefund,
    IconDashboard,
    IconKeyframe,
    IconLayoutKanban,
    IconLayoutSidebar,
    IconLogout,
    IconMoneybag,
    IconRoute,
    IconSettingsExclamation,
    IconStack,
    IconUser,
    IconUsersGroup,
    IconVersions,
} from '@tabler/icons-react';

export default function SidebarResponsive({ url, user }) {
    return (
        <>
            <header className="flex h-12 items-center justify-between gap-4 border-b px-4 lg:h-[60px] lg:justify-end lg:px-6">
                {/* sidebar responseive */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                            <IconLayoutSidebar className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex max-h-screen flex-col overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>
                                <VisuallyHidden.Root>Sidebar Responsive</VisuallyHidden.Root>
                            </SheetTitle>
                            <SheetDescription>
                                <VisuallyHidden.Root>Sidebar Responsive</VisuallyHidden.Root>
                            </SheetDescription>
                        </SheetHeader>
                        {/* sidebar */}
                        <nav className="grid gap-6 text-lg font-medium">
                            <ApplicationLogo />
                            <nav className="grid items-start text-sm font-semibold">
                                {/* dashboard */}
                                {user.role.some((role) => ['admin', 'operator', 'member'].includes(role)) && (
                                    <>
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Dashboard</div>
                                        <NavLinkResponsive
                                            active={url.startsWith('/dashboard')}
                                            url={route('dashboard')}
                                            title="Dashboard"
                                            icon={IconDashboard}
                                        />
                                    </>
                                )}
                                {/* statistik */}
                                {user.role.some((role) => ['admin'].includes(role)) && (
                                    <>
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Statistik</div>
                                        <NavLinkResponsive
                                            active={url.startsWith('/admin/loan-statistics')}
                                            url={route('admin.loan-statistics.index')}
                                            title="Statistik Peminjaman"
                                            icon={IconChartDots2}
                                        />
                                        <NavLinkResponsive
                                            active={url.startsWith('/admin/fine-reports')}
                                            url={route('admin.fine-reports.index')}
                                            title="Laporan Denda"
                                            icon={IconMoneybag}
                                        />
                                        <NavLinkResponsive
                                            active={url.startsWith('/admin/book-stock-reports')}
                                            url={route('admin.book-stock-reports.index')}
                                            title="Laporan Stok Buku"
                                            icon={IconStack}
                                        />
                                    </>
                                )}
                                {/* Master */}
                                {user.role.some((role) => ['admin', 'operator'].includes(role)) && (
                                    <>
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Master</div>

                                        <NavLinkResponsive
                                            active={url.startsWith('/admin/categories')}
                                            url={route('admin.categories.index')}
                                            title="Kategori"
                                            icon={IconCategory}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.publishers.index')}
                                            active={url.startsWith('/admin/publishers')}
                                            title="Penerbit"
                                            icon={IconBuildingCommunity}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.books.index')}
                                            active={url.startsWith('/admin/books')}
                                            title="Buku"
                                            icon={IconBook}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.users.index')}
                                            active={url.startsWith('/admin/users')}
                                            title="Pengguna"
                                            icon={IconUsersGroup}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.fine-settings.create')}
                                            active={url.startsWith('/admin/fine-settings')}
                                            title="Pengaturan Denda"
                                            icon={IconSettingsExclamation}
                                        />
                                    </>
                                )}
                                {/* Peran dan Izin */}
                                {user.role.some((role) => ['admin'].includes(role)) && (
                                    <>
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">
                                            Peran dan Izin
                                        </div>
                                        <NavLinkResponsive
                                            url={route('admin.roles.index')}
                                            active={url.startsWith('/admin/roles')}
                                            title="Peran"
                                            icon={IconVersions}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.permissions.index')}
                                            active={url.startsWith('/admin/permissions')}
                                            title="Izin"
                                            icon={IconCircleKey}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.assign-permissions.index')}
                                            active={url.startsWith('/admin/assign-permissions')}
                                            title="Tetapkan Izin"
                                            icon={IconKeyframe}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.assign-users.index')}
                                            active={url.startsWith('/admin/assign-users')}
                                            title="Tetapkan Peran"
                                            icon={IconLayoutKanban}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.route-accesses.index')}
                                            active={url.startsWith('/admin/route-accesses')}
                                            title="Akses Rute"
                                            icon={IconRoute}
                                        />
                                    </>
                                )}

                                {/* Transaksi */}
                                {user.role.some((role) => ['admin', 'operator'].includes(role)) && (
                                    <>
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Transaksi</div>
                                        <NavLinkResponsive
                                            url={route('admin.loans.index')}
                                            active={url.startsWith('/admin/loans')}
                                            title="Peminjaman"
                                            icon={IconCreditCardPay}
                                        />
                                        <NavLinkResponsive
                                            url={route('admin.return-books.index')}
                                            active={url.startsWith('/admin/return-books')}
                                            title="Pengembalian"
                                            icon={IconCreditCardRefund}
                                        />
                                    </>
                                )}

                                {user.role.some((role) => ['member'].includes(role)) && (
                                    <>
                                        <NavLinkResponsive
                                            url={route('front.books.index')}
                                            active={url.startsWith('/books')}
                                            title="Buku"
                                            icon={IconBook}
                                        />
                                        <NavLinkResponsive
                                            url={route('front.categories.index')}
                                            active={url.startsWith('/categories')}
                                            title="Kategori"
                                            icon={IconCategory}
                                        />

                                        {/* Transaksi member */}
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Transaksi</div>

                                        <NavLinkResponsive
                                            url={route('front.loans.index')}
                                            active={url.startsWith('/loans')}
                                            title="Peminjaman"
                                            icon={IconCreditCardPay}
                                        />

                                        <NavLinkResponsive
                                            url={route('front.return-books.index')}
                                            active={url.startsWith('/return-books')}
                                            title="Pengembalian"
                                            icon={IconCreditCardRefund}
                                        />
                                        <NavLinkResponsive
                                            url={route('front.fines.index')}
                                            active={url.startsWith('/fines')}
                                            title="Denda"
                                            icon={IconMoneybag}
                                        />
                                    </>
                                )}

                                {/* Lainnya */}
                                <div className="px-3 py-2 text-sm font-semibold text-foreground">Lainnya</div>
                                {user.role.some((role) => ['admin', 'operator'].includes(role)) && (
                                    <>
                                        <NavLinkResponsive
                                            url={route('admin.announcements.index')}
                                            active={url.startsWith('/admin/announcements')}
                                            title="Pengumuman"
                                            icon={IconAlertCircle}
                                        />
                                    </>
                                )}

                                <NavLinkResponsive
                                    url={route('profile.edit')}
                                    active={url.startsWith('/admin/profile')}
                                    title="Profile"
                                    icon={IconUser}
                                />
                                <NavLinkResponsive
                                    url={route('logout')}
                                    method="post"
                                    as="button"
                                    title="Logout"
                                    icon={IconLogout}
                                />
                            </nav>
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
}
