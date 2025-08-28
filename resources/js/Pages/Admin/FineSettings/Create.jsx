import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { IconSettingsExclamation } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Create(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        late_fee_per_day: props.fine_setting?.late_fee_per_day ?? 0,
        damage_fee_percentage: props.fine_setting?.damage_fee_percentage ?? 0,
        lost_fee_percentage: props.fine_setting?.lost_fee_percentage ?? 0,
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
                        icon={IconSettingsExclamation}
                    />
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={onHandleSubmit} className="space-y-6">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="late_fee_per_day">Denda Keterlambatan</Label>
                                <Input
                                    value={data.late_fee_per_day}
                                    name="late_fee_per_day"
                                    id="late_fee_per_day"
                                    type="number"
                                    onChange={onHandleChange}
                                />
                                {errors.late_fee_per_day && <InputError message={errors.late_fee_per_day} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="damage_fee_percentage">Denda Rusak (%)</Label>
                                <Input
                                    value={data.damage_fee_percentage}
                                    name="damage_fee_percentage"
                                    id="damage_fee_percentage"
                                    type="number"
                                    onChange={onHandleChange}
                                />
                                {errors.damage_fee_percentage && <InputError message={errors.damage_fee_percentage} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="lost_fee_percentage">Denda Hilang (%)</Label>
                                <Input
                                    value={data.lost_fee_percentage}
                                    name="lost_fee_percentage"
                                    id="lost_fee_percentage"
                                    type="number"
                                    onChange={onHandleChange}
                                />
                                {errors.lost_fee_percentage && <InputError message={errors.lost_fee_percentage} />}
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

Create.layout = (page) => <AppLayout children={page} title={page.props.page_setting.title} />;
