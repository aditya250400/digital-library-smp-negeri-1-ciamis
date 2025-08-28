import HeaderTitle from '@/Components/HeaderTitle';
import { AlertDescription } from '@/Components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import PaginationTable from '@/Components/ui/PaginationTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { UseFilter } from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { AlertDialogCancel, AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { IconArrowsDownUp, IconPencil, IconPlus, IconRefresh, IconTrash, IconVersions } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Index(props) {
    const { data: roles, meta } = props.roles;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            field: field,
            direction: params.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('admin.roles.index'),
        values: params,
        only: ['roles'],
    });
    return (
        <>
            <div className="flex w-full flex-col pb-32">
                <div className="item-start mb-8 flex flex-col justify-between gap-y-4 lg:flex-row lg:items-center">
                    <HeaderTitle
                        title={props.page_setting.title}
                        subtitle={props.page_setting.subtitle}
                        icon={IconVersions}
                    />
                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.roles.create')}>
                            <IconPlus size="4" />
                            Tambah
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
                            <Input
                                className="w-full sm:w-1/4"
                                placeholder="Search..."
                                value={params?.search}
                                onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                            />
                            <Select value={params?.load} onValueChange={(e) => setParams({ ...params, load: e })}>
                                <SelectTrigger className="w-full sm:w-24">
                                    <SelectValue placeholder="Load" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50, 75, 100].map((number, index) => (
                                        <SelectItem key={index} value={number}>
                                            {number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="red" onClick={() => setParams(props.state)} size="xl">
                                <IconRefresh className="size-4" />
                                Bersihkan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0 py-0 [&-td]:whitespace-nowrap [&_td]:px-6 [&_th]:px-6">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('id')}
                                        >
                                            #
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4 text-muted-foreground" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('name')}
                                        >
                                            Name
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4 text-muted-foreground" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('guard_name')}
                                        >
                                            Guard
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4 text-muted-foreground" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('created_at')}
                                        >
                                            Dibuat Pada
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4 text-muted-foreground" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>{role.guard_name}</TableCell>
                                        <TableCell>{role.created_at}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant="slate" size="sm" asChild>
                                                    <Link href={route('admin.roles.edit', [role])}>
                                                        <IconPencil size="4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="red" size="sm">
                                                            <IconTrash size="4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Apakah anda benar-benar yakin?
                                                            </AlertDialogTitle>
                                                            <AlertDescription>
                                                                Tindakan ini tidak dapat dibatalkan. Tindakan ini akan
                                                                menghapus Peran ini dan semua data yang memiliki Peran
                                                                ini secara permanen!
                                                            </AlertDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    router.delete(
                                                                        route('admin.roles.destroy', [role]),
                                                                        {
                                                                            preserveScroll: true,
                                                                            preserveState: true,
                                                                            onSuccess: (success) => {
                                                                                const flash = flashMessage(success);
                                                                                if (flash)
                                                                                    toast[flash.type](flash.message);
                                                                            },
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex w-full flex-col items-center justify-between border-t py-2 lg:flex-row">
                        <p className="mb-2 text-sm text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-meidum text-blue-500">
                                {meta.to ?? 0} dari {meta.total} Peran
                            </span>
                        </p>
                        <div className="overflow-x-auto">
                            {meta.has_pages && <PaginationTable meta={meta} links={meta.links} />}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout children={page} title={page.props.page_setting.title} />;
