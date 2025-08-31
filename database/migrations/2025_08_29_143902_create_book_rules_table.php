<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('base_book_id');
            $table->unsignedBigInteger('related_book_id');
            $table->decimal('support', 5, 2);
            $table->decimal('confidence', 5, 2);
            $table->decimal('lift', 5, 2);
            $table->timestamps();

            $table->foreign('base_book_id')->references('id')->on('books')->onDelete('cascade');
            $table->foreign('related_book_id')->references('id')->on('books')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_rules');
    }
};
