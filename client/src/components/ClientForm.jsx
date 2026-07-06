import { useMemo } from 'react'

function ClientForm({ client, onClose, onSubmit }) {
  const initialValues = useMemo(
    () => ({
      nombres: client?.nombres ?? '',
      apellidos: client?.apellidos ?? '',
      documento: client?.documento ?? '',
      telefono: client?.telefono ?? '',
      correo: client?.correo ?? '',
      direccion: client?.direccion ?? '',
      estado: client?.estado ?? true,
    }),
    [client]
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    onSubmit({
      nombres: String(formData.get('nombres') ?? '').trim(),
      apellidos: String(formData.get('apellidos') ?? '').trim(),
      documento: String(formData.get('documento') ?? '').trim(),
      telefono: String(formData.get('telefono') ?? '').trim(),
      correo: String(formData.get('correo') ?? '').trim(),
      direccion: String(formData.get('direccion') ?? '').trim(),
      estado: String(formData.get('estado') ?? 'true') === 'true',
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <p className="modal-eyebrow">
              {client ? 'Editar cliente' : 'Nuevo cliente'}
            </p>
            <h2 id="client-form-title">
              {client ? 'Actualizar cliente' : 'Agregar cliente'}
            </h2>
            <p className="modal-subtitle">
              Completa los datos para guardar el cliente.
            </p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <form className="client-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Nombres</span>
              <input
                name="nombres"
                type="text"
                placeholder="Mariana"
                required
                defaultValue={initialValues.nombres}
              />
            </label>
            <label>
              <span>Apellidos</span>
              <input
                name="apellidos"
                type="text"
                placeholder="López García"
                required
                defaultValue={initialValues.apellidos}
              />
            </label>
            <label>
              <span>Documento</span>
              <input
                name="documento"
                type="text"
                placeholder="1020304050"
                required
                defaultValue={initialValues.documento}
              />
            </label>
            <label>
              <span>Teléfono</span>
              <input
                name="telefono"
                type="tel"
                placeholder="+57 300 123 4567"
                required
                defaultValue={initialValues.telefono}
              />
            </label>
            <label>
              <span>Correo</span>
              <input
                name="correo"
                type="email"
                placeholder="correo@dominio.com"
                required
                defaultValue={initialValues.correo}
              />
            </label>
            <label className="form-span-2">
              <span>Dirección</span>
              <input
                name="direccion"
                type="text"
                placeholder="Calle 12 # 34-56"
                required
                defaultValue={initialValues.direccion}
              />
            </label>
          </div>

          <input
            name="estado"
            type="hidden"
            value={initialValues.estado ? 'true' : 'false'}
            readOnly
          />

          <footer className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              {client ? 'Actualizar cliente' : 'Guardar cliente'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default ClientForm
