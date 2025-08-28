import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCircleKey } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        name: props.role.name ?? '',
        guard_name: props.role.guard_name ?? 'web',
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
                        icon={IconCircleKey}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.roles.index')}>
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
                                <Label htmlFor="name">Guard</Label>
                                <Select
                                    defaultValue={data.guard_name}
                                    onValueChange={(value) => setData('guard_name', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {['web', 'api'].find((guard) => guard === data.guard_name) ?? 'Pilih Guard'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['web', 'api'].map((guard, index) => (
                                            <SelectItem key={index} value={guard}>
                                                {guard.charAt(0).toUpperCase() + guard.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.guard_name && <InputError message={errors.guard_name} />}
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
