import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconUsersGroup } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        name: props.user.name ?? '',
        email: props.user.email ?? '',
        password: '',
        password_confirmation: '',
        avatar: null,
        gender: props.user.gender ?? null,
        date_of_birth: props.user.date_of_birth ?? '',
        address: props.user.address ?? '',
        phone: props.user.phone ?? '',
        _method: props.page_setting.method,
    });

    const fileInputAvatar = useRef(null);

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

    const onHandleReset = () => {
        reset();
        fileInputAvatar.current.value = null;
    };

    return (
        <>
            <div className="flex w-full flex-col pb-32">
                <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                    <HeaderTitle
                        title={props.page_setting.title}
                        subtitle={props.page_setting.subtitle}
                        icon={IconUsersGroup}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.users.index')}>
                            <IconArrowLeft size="4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={onHandleSubmit} className="space-y-6">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    value={data.name}
                                    name="name"
                                    id="name"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan nama..."
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    value={data.email}
                                    name="email"
                                    id="email"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan email..."
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    value={data.password}
                                    name="password"
                                    id="password"
                                    type="password"
                                    onChange={onHandleChange}
                                    placeholder="Masukan password..."
                                />
                                {errors.password && <InputError message={errors.password} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="password_confirmation">Password Confirmation</Label>
                                <Input
                                    value={data.password_confirmation}
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    type="password"
                                    onChange={onHandleChange}
                                    placeholder="Masukan konfirmasi password"
                                />
                                {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Nomor handphone</Label>
                                <Input
                                    value={data.phone}
                                    name="phone"
                                    id="phone"
                                    type="number"
                                    onChange={onHandleChange}
                                    placeholder="Masukan nomor handphone..."
                                />
                                {errors.phone && <InputError message={errors.phone} />}
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="cover">Avatar</Label>
                                <Input
                                    onChange={(e) => setData(e.target.name, e.target.files[0])}
                                    name="avatar"
                                    id="avatar"
                                    type="file"
                                    ref={fileInputAvatar}
                                    accept="image/*"
                                />
                                {errors.avatar && <InputError message={errors.avatar} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="gender">Jenis Kelamin</Label>
                                <Select defaultValue={data.gender} onValueChange={(value) => setData('gender', value)}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {' '}
                                            {props.genders.find((publisher) => publisher.value == data.gender)?.label ??
                                                'Pilih Jenis Kelamin'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.genders.map((gender, index) => (
                                            <SelectItem key={index} value={gender.value}>
                                                {gender.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.gender && <InputError message={errors.gender} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    onChange={onHandleChange}
                                    name="address"
                                    id="address"
                                    value={data.address}
                                    placeholder="Masukan alamat..."
                                ></Textarea>
                                {errors.address && <InputError message={errors.address} />}
                            </div>

                            <div className="flex justify-end gap-x-2">
                                {(data.name != '' ||
                                    data.address != '' ||
                                    data.avatar != null ||
                                    data.phone ||
                                    data.email) && (
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
