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
import { IconArrowLeft, IconCategory } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Create(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        name: '',
        description: '',
        cover: null,
        _method: props.page_setting.method,
    });

    const fileInputCover = useRef(null);

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
        fileInputCover.current.value = null;
    };

    return (
        <>
            <div className="flex w-full flex-col pb-32">
                <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                    <HeaderTitle
                        title={props.page_setting.title}
                        subtitle={props.page_setting.subtitle}
                        icon={IconCategory}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.categories.index')}>
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
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    onChange={onHandleChange}
                                    name="description"
                                    id="description"
                                    value={data.description}
                                    placeholder="Masukan deskripsi"
                                ></Textarea>
                                {errors.description && <InputError message={errors.description} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="cover">Cover</Label>

                                <Input
                                    onChange={(e) => setData(e.target.name, e.target.files[0])}
                                    name="cover"
                                    id="cover"
                                    type="file"
                                    ref={fileInputCover}
                                    accept="image/*"
                                />
                                {errors.cover && <InputError message={errors.cover} />}
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

Create.layout = (page) => <AppLayout children={page} title={page.props.page_setting.title} />;
