<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $clientes = Cliente::query()
            ->when($request->filled('estado'), fn ($q) =>
                $q->where('estado', $request->boolean('estado'))
            )
            ->when($request->filled('buscar'), fn ($q) =>
                $q->where(function ($query) use ($request) {
                    $buscar = $request->input('buscar');

                    $query->where('nombres', 'like', '%' . $buscar . '%')
                        ->orWhere('apellidos', 'like', '%' . $buscar . '%')
                        ->orWhere('documento', 'like', '%' . $buscar . '%');
                })
            )
            ->orderBy('id')
            ->paginate($request->integer('per_page', 15));

        return response()->json($clientes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validarDatos($request);
        $cliente = Cliente::create($validated);
        return response()->json($cliente, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente)
    {
        return response()->json($cliente);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cliente $cliente)
    {
        $validated = $this->validarDatos($request, $cliente->id);
        $cliente->update($validated);
        return response()->json($cliente);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente)
    {
        $cliente -> delete();
        return response()->json(null, 204);
    }

    private function validarDatos(Request $request, ?int $ignorarId = null): array
    {
        return $request->validate([
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'documento' => 'required|string|max:20|unique:clientes,documento,' . ($ignorarId ?? 'NULL') . ',id',
            'telefono' => 'required|string|max:20',
            'correo' => 'required|email|max:120|unique:clientes,correo,' . ($ignorarId ?? 'NULL') . ',id',
            'direccion' => 'required|string|max:200',
            'estado' => 'boolean',
        ]);
    }
}
