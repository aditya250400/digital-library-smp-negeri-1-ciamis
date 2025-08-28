import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset, status } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
                <div className="flex flex-col px-6 py-4">
                    <ApplicationLogo size="12" />
                    <div className="flex flex-col items-center justify-center py-12 lg:py-12">
                        <div className="mx-auto flex w-full flex-col gap-6 lg:w-1/2">
                            <div className="grid gap-2 text-center">
                                <h1 className="text-3xl font-bold">Reset Password</h1>
                                <p className="text-balance text-muted-foreground">
                                    Gunakan password yang aman dan mudah anda ingat
                                </p>
                            </div>
                            {/* form */}
                            <form onSubmit={onHandleSubmit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <div>
                                            <Label htmlFor="email">Email</Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                            />

                                            {errors.email && <InputError message={errors.email} />}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password"></Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />

                                        {errors.password && <InputError message={errors.password} />}
                                    </div>

                                    <div className="grid gap-4">
                                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>

                                        <Input
                                            type="password"
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />

                                        {errors.password_confirmation && (
                                            <InputError message={errors.password_confirmation} />
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        variant="blue"
                                        size="xl"
                                        disabled={processing}
                                    >
                                        Reset Password
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="hidden bg-muted lg:block">
                    <img
                        src="/images/login.webp"
                        alt="login"
                        className="h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
                    />
                </div>
            </div>
        </>
    );
}

ResetPassword.layout = (page) => <GuestLayout children={page} title="Reset Password" />;
