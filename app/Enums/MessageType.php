<?php

namespace App\Enums;

enum MessageType: string
{
    case CREATED = 'Berhasil Menambahkan';
    case UPDATED = 'Berhasil Memperbarui';
    case DELETED = 'Berhasil Menghapus';
    case ERROR = 'Terjadi Kesalahan. Silakan coba lagi nanti';

    public function message(string $entity = '', ?string $error = null): string
    {
        if ($this === MessageType::ERROR && $error) {
            return "{$this->value} {$error}";
        }

        return "{$this->value} {$entity}";
    }
}
