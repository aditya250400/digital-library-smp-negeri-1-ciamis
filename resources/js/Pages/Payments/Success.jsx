import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { IconCircleCheck } from '@tabler/icons-react';

export default function Success() {
    return (
        <>
            <Head title="Pembayaran Sukses" />
            <div className="justfify-center flex min-h-screen items-center">
                <div className="mx-auto max-w-sm">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-x-2">
                            <IconCircleCheck class="text-green-500" />
                            <div>
                                <CardTitle>Berhasil</CardTitle>
                                <CardDescription>Pembayaran Telah Sukses Diproses</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-y-6">
                            <p className="text-start text-foreground">
                                Terimakasih telah menyelesaikan pembayaran denda. Kami dengan senang hati
                                mengkonfirmasibahwa transaksi anda berhasil kami proses.
                            </p>

                            <Button asChild variant="blue">
                                <Link href={route('dashboard')}>Kembali</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
