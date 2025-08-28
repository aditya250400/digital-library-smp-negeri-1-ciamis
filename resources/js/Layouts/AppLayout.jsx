import ApplicationLogo from '@/components/ApplicationLogo';
import Banner from '@/Components/Banner';
import ThemeSwitcher from '@/Components/ThemeSwitcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';
import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from './Partials/Sidebar';
import SidebarResponsive from './Partials/SidebarResponsive';

export default function AppLayout({ title, children }) {
    const { url } = usePage();

    const { user } = usePage().props.auth;

    const announcement = usePage().props.announcement;

    return (
        <>
            <Head title={title} />
            <Toaster position="top-center" richColors />

            <div className="flex min-h-screen w-full">
                <div className="hidden w-1/5 border-r lg:block">
                    <div className="flex h-full min-h-screen flex-col gap-2">
                        <div className="flex h-14 border-b px-4 lg:h-[60px] lg:px-6">
                            <ApplicationLogo />
                            <ThemeSwitcher />
                        </div>
                        {/* sidebar */}
                        <div className="flex-1">
                            <Sidebar url={url} user={user} />
                        </div>
                        {/* sidebar end */}
                    </div>
                </div>

                <div className="flex w-full flex-col lg:w-4/5">
                    <header className="flex h-12 items-center justify-between gap-4 border-b px-4 lg:h-[60px] lg:justify-end lg:px-6">
                        {/* sidebar responseive  */}
                        <SidebarResponsive url={url} user={user} />
                        {/* dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex gap-x-2">
                                    <span>Hi, {user.name}</span>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link className="w-full hover:cursor-pointer" href={route('profile.edit')}>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="w-full hover:cursor-pointer"
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* dropdown end */}
                        {/* sidebar responseive end */}
                    </header>

                    <main className="w-full">
                        <div className="relative">
                            {/* background */}
                            <div
                                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                                aria-hidden="true"
                            >
                                <div
                                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-100 to-orange-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                                    style={{
                                        clipPath:
                                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                    }}
                                />
                            </div>
                            <div className="gap-4 p-4 lg:gap-6">
                                {children}

                                {announcement && announcement.is_active == 1 && (
                                    <Banner message={announcement.message} url={announcement.url} />
                                )}
                            </div>
                            {/* background end */}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
