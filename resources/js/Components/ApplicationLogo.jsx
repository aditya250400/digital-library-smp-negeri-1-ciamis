import { Link } from '@inertiajs/react';

export default function ApplicationLogo({ url = '/', size = 'size-9', isTitle = true }) {
    return (
        <Link href={url} className="flex items-center gap-2">
            <img src="/images/logo.png" className="w-8" />
            {isTitle && (
                <div className="flex flex-col">
                    <span className="text-sm font-bold leading-none text-foreground">
                        SMP Negeri 1 | Sukamantri Ciamis
                    </span>
                    <span className="line-clamp-1 text-xs font-medium text-muted-foreground">
                        Jl. Raya Barat No.218, Cibeureum, Kec. Sukamantri, Kabupaten Ciamis, Jawa Barat 46264
                    </span>
                </div>
            )}
        </Link>
    );
}
