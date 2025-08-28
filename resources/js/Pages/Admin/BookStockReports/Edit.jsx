import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconStack3 } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        total: props.stock.total ?? 0,
        available: props.stock.available ?? 0,
        loan: props.stock.loan ?? 0,
        lost: props.stock.lost ?? 0,
        damage: props.stock.damage ?? 0,
        _method: props.page_setting.method,
    });

    const calculateMinimumTotal = (available, loan, lost, damage) => {
        return available + loan + lost + damage;
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        const newValue = parseInt(value, 10) || 0;

        setData((prevData) => {
            if (name == 'total') {
                const minimumTotal = calculateMinimumTotal(
                    prevData.available,
                    prevData.loan,
                    prevData.lost,
                    prevData.damage,
                );

                const validTotal = newValue >= minimumTotal ? newValue : minimumTotal;
                const totalDiff = validTotal - prevData.total;

                const newAvailable = prevData.available + totalDiff;

                return {
                    ...prevData,
                    total: validTotal,
                    available: newAvailable >= 0 ? newAvailable : 0,
                };
            }

            return {
                ...prevData,
                [name]: newValue,
            };
        });
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
            <div className="flex w-full flex-col pb-32">
                <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                    <HeaderTitle
                        title={props.page_setting.title}
                        subtitle={props.page_setting.subtitle}
                        icon={IconStack3}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.book-stock-reports.index')}>
                            <IconArrowLeft size="4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={onHandleSubmit} className="space-y-6">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="total">Total</Label>
                                <Input
                                    value={data.total}
                                    name="total"
                                    id="total"
                                    type="number"
                                    onChange={onHandleChange}
                                />
                                {errors.total && <InputError message={errors.total} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="available">Tersedia</Label>
                                <Input
                                    value={data.available}
                                    name="available"
                                    id="available"
                                    type="number"
                                    onChange={onHandleChange}
                                    disabled
                                />
                                {errors.available && <InputError message={errors.available} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="loan">Dipinjam</Label>
                                <Input
                                    value={data.loan}
                                    name="loan"
                                    id="loan"
                                    type="number"
                                    onChange={onHandleChange}
                                    disabled
                                />
                                {errors.loan && <InputError message={errors.loan} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="lost">Hilang</Label>
                                <Input
                                    value={data.lost}
                                    name="lost"
                                    id="lost"
                                    type="number"
                                    onChange={onHandleChange}
                                    disabled
                                />
                                {errors.lost && <InputError message={errors.lost} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="damage">Rusak</Label>
                                <Input
                                    value={data.damage}
                                    name="damage"
                                    id="damage"
                                    type="number"
                                    onChange={onHandleChange}
                                    disabled
                                />
                                {errors.damage && <InputError message={errors.damage} />}
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
