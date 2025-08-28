import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        message: props.announcement.message ?? '',
        url: props.announcement.url ?? '',
        is_active: props.announcement.is_active ?? false,
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
                        icon={IconAlertCircle}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.announcements.index')}>
                            <IconArrowLeft size="4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={onHandleSubmit} className="space-y-6">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="message">Pesan</Label>
                                <Input
                                    value={data.message}
                                    name="message"
                                    id="message"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan pesan..."
                                />
                                {errors.message && <InputError message={errors.message} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    value={data.url}
                                    name="url"
                                    id="url"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan url..."
                                />
                                {errors.url && <InputError url={errors.url} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <div className="grid leading-none gap-1/5">
                                        <Label htmlFor="is_active">Apakah Aktif</Label>
                                    </div>
                                </div>
                                {errors.is_active && <InputError is_active={errors.message} />}
                            </div>

                            <div className="flex justify-end gap-x-2">
                                <Button onClick={onHandleReset} type="button" variant="ghost" size="lg">
                                    Reset
                                </Button>
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
