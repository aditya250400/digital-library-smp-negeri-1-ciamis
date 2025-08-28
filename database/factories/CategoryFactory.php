<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Fiksi', 'Non-Fiksi', 'Ilmu Pengetahuan', 'Sejarah', 'Biografi', 'Anak-Anak', 'Teknologi', 'Fantasi', 'Pengembangan Diri', 'Misteri'];
        return [
            'name' => $name = $this->faker->unique()->randomElement($categories),
            'slug' => str()->lower(str()->slug($name) . str()->random(4))
        ];
    }
}
