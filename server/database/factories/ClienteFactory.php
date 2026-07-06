<?php

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cliente>
 */
class ClienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombres' => fake()->firstName(),
            'apellidos' => fake()->lastName(),
            'documento' => fake()->numerify('########'),
            'telefono' => fake()->numerify('9########'),
            'correo' => fake()->unique()->safeEmail(),
            'direccion' => fake()->address(),
            'estado' => fake()->boolean(90),
        ];
    }
}
