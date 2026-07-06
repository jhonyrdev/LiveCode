<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombres',
        'apellidos',
        'documento',
        'telefono',
        'correo',
        'direccion',
        'estado',
    ];

    /**
     * Conversión automática de tipos al leer/escribir
     */
    protected $casts = [
        'estado' => 'boolean',
    ];
}
