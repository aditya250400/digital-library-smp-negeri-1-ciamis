import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconBuildingCommunity } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        name: props.publisher.name ?? '',
        address: props.publisher.address ?? '',
        email: props.publisher.email ?? '',
        phone: props.publisher.phone ?? '',
        logo: null,
        _method: props.page_setting.method,
    });

    const fileInputLogo = useRef(null);

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
        fileInputLogo.current.value = null;
    };

    return (
        <>
            <div className="flex w-full flex-col pb-32">
                <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                    <HeaderTitle
                        title={props.page_setting.title}
                        subtitle={props.page_setting.subtitle}
                        icon={IconBuildingCommunity}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.publishers.index')}>
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
                                <Label htmlFor="name">Nomor handphone</Label>
                                <Input
                                    value={data.phone}
                                    name="phone"
                                    id="phone"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan nomor handphone..."
                                />
                                {errors.phone && <InputError message={errors.phone} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="cover">Logo</Label>

                                <Input
                                    onChange={(e) => setData(e.target.name, e.target.files[0])}
                                    name="logo"
                                    id="logo"
                                    type="file"
                                    ref={fileInputLogo}
                                    accept="image/*"
                                />
                                {errors.logo && <InputError message={errors.logo} />}
                            </div>

                            <div className="flex justify-end gap-x-2">
                                {(data.name != '' ||
                                    data.address != '' ||
                                    data.logo != null ||
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
