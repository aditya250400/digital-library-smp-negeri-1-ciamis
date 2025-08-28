import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconBooks } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        title: props.book.title ?? '',
        author: props.book.author ?? '',
        publication_year: props.book.publication_year ?? null,
        isbn: props.book.isbn ?? '',
        language: props.book.language ?? null,
        synopsis: props.book.synopsis ?? '',
        number_of_pages: props.book.number_of_pages ?? '',
        cover: null,
        price: props.book.price ?? 0,
        category_id: props.book.category_id ?? null,
        publisher_id: props.book.publisher_id ?? null,
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
                        icon={IconBooks}
                    />

                    <Button variant="blue" size="lg" asChild>
                        <Link href={route('admin.books.index')}>
                            <IconArrowLeft size="4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={onHandleSubmit} className="space-y-6">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    value={data.title}
                                    name="title"
                                    id="title"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan judul..."
                                />
                                {errors.title && <InputError message={errors.title} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="author">Penulis</Label>
                                <Input
                                    value={data.author}
                                    name="author"
                                    id="author"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan penulis..."
                                />
                                {errors.author && <InputError message={errors.author} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="publication_year">Tahun Terbit</Label>
                                <Select
                                    defaultValue={data.publication_year}
                                    onValueChange={(value) => setData('publication_year', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {' '}
                                            {props.page_data.publicationYears.find(
                                                (number) => number == data.publication_year,
                                            ) ?? 'Pilih Tahun Terbit'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.page_data.publicationYears.map((number, index) => (
                                            <SelectItem key={index} value={number}>
                                                {number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.publication_year && <InputError message={errors.publication_year} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="isbn">ISBN (International Standard Book Number)</Label>
                                <Input
                                    value={data.isbn}
                                    name="isbn"
                                    id="isbn"
                                    type="text"
                                    onChange={onHandleChange}
                                    placeholder="Masukan penulis..."
                                />
                                {errors.isbn && <InputError message={errors.isbn} />}
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="language">Bahasa</Label>
                                <Select
                                    defaultValue={data.language}
                                    onValueChange={(value) => setData('language', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {' '}
                                            {props.page_data.languages.find(
                                                (language) => language.value == data.language,
                                            )?.label ?? 'Pilih Bahasa'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.page_data.languages.map((language, index) => (
                                            <SelectItem key={index} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.language && <InputError message={errors.language} />}
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="synopsis">Sinopsis</Label>
                                <Textarea
                                    onChange={onHandleChange}
                                    name="synopsis"
                                    id="synopsis"
                                    value={data.synopsis}
                                    placeholder="Masukan sinopsis..."
                                ></Textarea>
                                {errors.synopsis && <InputError message={errors.synopsis} />}
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="number_of_pages">Jumlah Halaman</Label>
                                <Input
                                    value={data.number_of_pages}
                                    name="number_of_pages"
                                    id="number_of_pages"
                                    type="number"
                                    onChange={onHandleChange}
                                    placeholder="Masukan penulis..."
                                />
                                {errors.number_of_pages && <InputError message={errors.number_of_pages} />}
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
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="price">Harga</Label>
                                <Input
                                    value={data.price}
                                    name="price"
                                    id="price"
                                    type="number"
                                    onChange={onHandleChange}
                                    placeholder="Masukan harga..."
                                />
                                {errors.price && <InputError message={errors.price} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="publisher_id">Kategori</Label>
                                <Select
                                    defaultValue={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {' '}
                                            {props.page_data.categories.find(
                                                (category) => category.value == data.category_id,
                                            )?.label ?? 'Pilih Kategori'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.page_data.categories.map((category, index) => (
                                            <SelectItem key={index} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <InputError message={errors.category} />}
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="publisher_id">Penerbit</Label>
                                <Select
                                    defaultValue={data.publisher_id}
                                    onValueChange={(value) => setData('publisher_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {' '}
                                            {props.page_data.publishers.find(
                                                (publisher) => publisher.value == data.publisher_id,
                                            )?.label ?? 'Pilih Penerbit'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.page_data.publishers.map((publisher, index) => (
                                            <SelectItem key={index} value={publisher.value}>
                                                {publisher.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.publisher && <InputError message={errors.publisher} />}
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
