import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { IconInnerShadowBottomRight } from '@tabler/icons-react';

export default function ApplicationLogo({ url = '/', size = 'size-9', isTitle = true }) {
    return (
        <Link href={url} className="flex items-center gap-2">
            <IconInnerShadowBottomRight className={cn('text-blue-500', size)} />
            {isTitle && (
                <div className="flex flex-col">
                    <span className="font-bold leading-none text-foreground">Libraria</span>
                    <span className="text-xs font-medium text-muted-foreground">Jelajahi Ilmu, Temukan Dunia</span>
                </div>
            )}
        </Link>
    );
}
