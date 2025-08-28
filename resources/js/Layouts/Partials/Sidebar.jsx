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
    IconLogout,
    IconMoneybag,
    IconRoute,
    IconSettingsExclamation,
    IconStack,
    IconUser,
    IconUsersGroup,
    IconVersions,
} from '@tabler/icons-react';
import NavLink from '../../Components/NavLink';

export default function Sidebar({ url, user }) {
    return (
        <>
            <nav className="sticky top-2 grid items-start px-2 text-sm font-semibold lg:px-4">
                {/* dashboard */}
                {user.role.some((role) => ['admin', 'operator', 'member'].includes(role)) && (
                    <>
                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Dashboard</div>
                        <NavLink
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
                        <NavLink
                            active={url.startsWith('/admin/loan-statistics')}
                            url={route('admin.loan-statistics.index')}
                            title="Statistik Peminjaman"
                            icon={IconChartDots2}
                        />
                        <NavLink
                            active={url.startsWith('/admin/fine-reports')}
                            url={route('admin.fine-reports.index')}
                            title="Laporan Denda"
                            icon={IconMoneybag}
                        />
                        <NavLink
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

                        <NavLink
                            active={url.startsWith('/admin/categories')}
                            url={route('admin.categories.index')}
                            title="Kategori"
                            icon={IconCategory}
                        />
                        <NavLink
                            url={route('admin.publishers.index')}
                            active={url.startsWith('/admin/publishers')}
                            title="Penerbit"
                            icon={IconBuildingCommunity}
                        />
                        <NavLink
                            url={route('admin.books.index')}
                            active={url.startsWith('/admin/books')}
                            title="Buku"
                            icon={IconBook}
                        />
                        <NavLink
                            url={route('admin.users.index')}
                            active={url.startsWith('/admin/users')}
                            title="Pengguna"
                            icon={IconUsersGroup}
                        />
                        <NavLink
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
                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Peran dan Izin</div>
                        <NavLink
                            url={route('admin.roles.index')}
                            active={url.startsWith('/admin/roles')}
                            title="Peran"
                            icon={IconVersions}
                        />
                        <NavLink
                            url={route('admin.permissions.index')}
                            active={url.startsWith('/admin/permissions')}
                            title="Izin"
                            icon={IconCircleKey}
                        />
                        <NavLink
                            url={route('admin.assign-permissions.index')}
                            active={url.startsWith('/admin/assign-permissions')}
                            title="Tetapkan Izin"
                            icon={IconKeyframe}
                        />
                        <NavLink
                            url={route('admin.assign-users.index')}
                            active={url.startsWith('/admin/assign-users')}
                            title="Tetapkan Peran"
                            icon={IconLayoutKanban}
                        />
                        <NavLink
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
                        <NavLink
                            url={route('admin.loans.index')}
                            active={url.startsWith('/admin/loans')}
                            title="Peminjaman"
                            icon={IconCreditCardPay}
                        />
                        <NavLink
                            url={route('admin.return-books.index')}
                            active={url.startsWith('/admin/return-books')}
                            title="Pengembalian"
                            icon={IconCreditCardRefund}
                        />
                    </>
                )}

                {user.role.some((role) => ['member'].includes(role)) && (
                    <>
                        <NavLink
                            url={route('front.books.index')}
                            active={url.startsWith('/books')}
                            title="Buku"
                            icon={IconBook}
                        />
                        <NavLink
                            url={route('front.categories.index')}
                            active={url.startsWith('/categories')}
                            title="Kategori"
                            icon={IconCategory}
                        />

                        {/* Transaksi member */}
                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Transaksi</div>

                        <NavLink
                            url={route('front.loans.index')}
                            active={url.startsWith('/loans')}
                            title="Peminjaman"
                            icon={IconCreditCardPay}
                        />

                        <NavLink
                            url={route('front.return-books.index')}
                            active={url.startsWith('/return-books')}
                            title="Pengembalian"
                            icon={IconCreditCardRefund}
                        />
                        <NavLink
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
                        <NavLink
                            url={route('admin.announcements.index')}
                            active={url.startsWith('/admin/announcements')}
                            title="Pengumuman"
                            icon={IconAlertCircle}
                        />
                    </>
                )}

                <NavLink
                    url={route('profile.edit')}
                    active={url.startsWith('/admin/profile')}
                    title="Profile"
                    icon={IconUser}
                />
                <NavLink
                    url={route('logout')}
                    method="post"
                    as="button"
                    className="w-full"
                    title="Logout"
                    icon={IconLogout}
                />
            </nav>
        </>
    );
}
