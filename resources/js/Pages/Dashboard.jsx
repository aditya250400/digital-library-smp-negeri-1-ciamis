import CardStat from '@/Components/CardStat';
import ChartCustom from '@/Components/ChartCustom';
import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import AppLayout from '@/Layouts/AppLayout';
import { formatToRupiah } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    IconArrowUpRight,
    IconBooks,
    IconCreditCardPay,
    IconCreditCardRefund,
    IconDashboard,
    IconMoneybag,
    IconUsersGroup,
} from '@tabler/icons-react';

export default function Dashboard(props) {
    const { user } = props.auth;

    return (
        <div className="flex flex-col w-full pb-32 space-y-4">
            <div className="flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting.title}
                    subtitle={props.page_setting.subtitle}
                    icon={IconDashboard}
                />
            </div>
            {user.role.some((role) => ['admin', 'operator'].includes(role)) && (
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <CardStat
                        data={{
                            title: 'Total Buku',
                            icon: IconBooks,
                            background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{props.page_data.total_books}</div>
                    </CardStat>
                    <CardStat
                        data={{
                            title: 'Total Pengguna',
                            icon: IconUsersGroup,
                            background: 'text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{props.page_data.total_users}</div>
                    </CardStat>
                    <CardStat
                        data={{
                            title: 'Peminjaman',
                            icon: IconCreditCardPay,
                            background: 'text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{props.page_data.total_loans}</div>
                    </CardStat>
                    <CardStat
                        data={{
                            title: 'Pengembalian',
                            icon: IconCreditCardRefund,
                            background: 'text-white bg-gradient-to-r from-slate-400 via-slate-500 to-slate-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{props.page_data.total_returns}</div>
                    </CardStat>
                </div>
            )}

            <ChartCustom chartData={props.page_data.transactionChart} />
            {user.role.some((role) => ['member'].includes(role)) && (
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    <CardStat
                        data={{
                            title: 'Total Peminjaman Saya',
                            icon: IconCreditCardPay,
                            background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{props.page_data.total_loans}</div>
                    </CardStat>
                    <CardStat
                        data={{
                            title: 'Total Pengembalian Saya',
                            icon: IconCreditCardRefund,
                            background: 'text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{props.page_data.total_returns}</div>
                    </CardStat>
                    <CardStat
                        data={{
                            title: 'Total Denda Saya',
                            icon: IconMoneybag,
                            background: 'text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-500',
                            iconClassName: 'text-white',
                        }}
                    >
                        <div className="text-2xl font-bold">{formatToRupiah(props.page_data.total_fines)}</div>
                    </CardStat>
                </div>
            )}

            <div className="flex flex-col justify-between w-full gap-2 lg:flex-row">
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <div className="flex flex-col justify-between gap-y-4 lg:flex-row lg:items-center">
                            <div className="flex flex-col gap-y-2">
                                <CardTitle>
                                    {' '}
                                    {user.role.some((role) => ['member'].includes(role))
                                        ? ' Transaksi Peminjaman Saya'
                                        : 'Transaksi Peminjaman'}
                                </CardTitle>
                                <CardDescription>Anda dapat melihat 5 transaksi terakhir peminjaman</CardDescription>
                            </div>
                            <Button variant="blue" asChild>
                                {user.role.some((role) => ['admin', 'operator'].includes(role)) ? (
                                    <Link href={route('admin.loans.index')}>
                                        Lihat Semua
                                        <IconArrowUpRight className="size-4" />
                                    </Link>
                                ) : (
                                    <Link href="#">
                                        Lihat Semua
                                        <IconArrowUpRight className="size-4" />
                                    </Link>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 [&_td]:whitespace-nowrap [&_td]:px-6 [&_th]:px-6">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Kode Peminjaman</TableHead>
                                    <TableHead>Buku</TableHead>
                                    {user.role.some((role) => ['member'].includes(role)) ? (
                                        ''
                                    ) : (
                                        <TableHead>Member</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {props.page_data.loans.map((loan, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{loan.loan_code}</TableCell>
                                        <TableCell>{loan.book.title}</TableCell>
                                        {user.role.some((role) => ['member'].includes(role)) ? (
                                            ''
                                        ) : (
                                            <TableCell>{loan.user.name}</TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="w-full lg:w-1/2">
                    <CardHeader>
                        <div className="flex flex-col justify-between gap-y-4 lg:flex-row lg:items-center">
                            <div className="flex flex-col gap-y-2">
                                <CardTitle>
                                    {user.role.some((role) => ['member'].includes(role))
                                        ? ' Transaksi Pengembalian Saya'
                                        : 'Transaksi Pengembalian'}
                                </CardTitle>
                                <CardDescription>Anda dapat melihat 5 transaksi terakhir pengembalian</CardDescription>
                            </div>
                            <Button variant="blue" asChild>
                                {user.role.some((role) => ['admin', 'operator'].includes(role)) ? (
                                    <Link href={route('admin.return-books.index')}>
                                        Lihat Semua
                                        <IconArrowUpRight className="size-4" />
                                    </Link>
                                ) : (
                                    <Link href="#">
                                        Lihat Semua
                                        <IconArrowUpRight className="size-4" />
                                    </Link>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 [&_td]:whitespace-nowrap [&_td]:px-6 [&_th]:px-6">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Kode Pengembalian</TableHead>
                                    <TableHead>Buku</TableHead>
                                    {user.role.some((role) => ['member'].includes(role)) ? (
                                        ''
                                    ) : (
                                        <TableHead>Member</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {props.page_data.return_books.map((return_book, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{return_book.return_book_code}</TableCell>
                                        <TableCell>{return_book.book.title}</TableCell>
                                        {user.role.some((role) => ['member'].includes(role)) ? (
                                            ''
                                        ) : (
                                            <TableCell>{return_book.user.name}</TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <AppLayout children={page} title="Dashboard" />;
