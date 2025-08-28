<?php

namespace Database\Seeders;

use App\Models\DueDateSetting;
use App\Models\RouteAccess;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        User::factory()->create([
            'name' => $name = 'Luffytaro',
            'username' => usernameGenerator($name),
            'email' => 'luffy@gmail.com'
        ])->assignRole(Role::create(['name' => 'admin']));

        User::factory()->create([
            'name' => $name = 'Zorojuro',
            'username' => usernameGenerator($name),
            'email' => 'zoro@gmail.com'
        ])->assignRole(Role::create(['name' => 'operator']));

        User::factory()->create([
            'name' => $name = 'Onami',
            'username' => usernameGenerator($name),
            'email' => 'nami@gmail.com'
        ])->assignRole(Role::create(['name' => 'member']));

        DueDateSetting::create([
            'due_date' => Carbon::now()->addMonths(6)->toDateString(),
        ]);


        $this->call(CategorySeeder::class);
        $this->call(PublisherSeeder::class);
        $this->call(RouteAccess::class);
    }
}
