import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { MultiSelect } from '@/Components/MultiSelect';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconLayoutKanban } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const [selectedRoles, setSelectedRoles] = useState(Array.from(new Set(props.user.roles.map((role) => role.id))));

    const { data, setData, reset, post, processing, errors } = useForm({
        email: props.user.email ?? '',
        roles: selectedRoles,
        _method: props.page_setting.method,
    });

    const onHandleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    const handleRoleChange = (selected) => {
        setSelectedRoles(selected);
        setData('roles', selected);
    };

    const onHandleReset = () => {
        reset();
    };

    return (
        <>
            <div className="flex flex-col w-full pb-32">
                <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
                    <HeaderTitle
                        title={props.page_setting.title}
                        subtitle={props.page_setting.subtitle}
                        icon={IconLayoutKanban}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.assign-users.index')}>
                            <IconArrowLeft size="4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={onHandleSubmit} className="space-y-6">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="email">Pengguna</Label>
                                <Input
                                    value={data.email}
                                    name="email"
                                    id="email"
                                    type="text"
                                    disabled
                                    onChange={onHandleChange}
                                    placeholder="Masukan nama..."
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="roles">Peran</Label>
                                <MultiSelect
                                    options={props.roles}
                                    onValueChange={handleRoleChange}
                                    defaultValue={selectedRoles}
                                    placeholder="Pilih Peran"
                                    variant="inverted"
                                />
                                {errors.roles && <InputError message={errors.roles} />}
                            </div>

                            <div className="flex justify-end gap-x-2">
                                {(data.name != '' || data.description != '' || data.cover != null) && (
                                    <Button onClick={onHandleReset} type="button" variant="ghost" size="lg">
                                        Reset
                                    </Button>
                                )}
                                <Button disabled={processing} type="submit" variant="blue" size="lg">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_setting.title} />;
