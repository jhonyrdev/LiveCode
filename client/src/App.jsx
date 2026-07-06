import { useEffect, useMemo, useState } from 'react'
import clienteService from './services/clienteService'
import ClientForm from './components/ClientForm'
import './App.css'

function App() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadClients = async (searchValue = search) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await clienteService.listar({
        buscar: searchValue.trim() || undefined,
        per_page: 100,
      })

      const payload = response.data
      setClients(Array.isArray(payload?.data) ? payload.data : payload ?? [])
    } catch (error) {
      setErrorMessage('No se pudieron cargar los clientes.')
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const filteredClients = useMemo(() => {
    return clients
  }, [clients])

  const openCreateForm = () => {
    setSelectedClient(null)
    setIsFormOpen(false)
    requestAnimationFrame(() => setIsFormOpen(true))
  }

  const openEditForm = (client) => {
    setSelectedClient(client)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedClient(null)
  }

  const handleSubmitClient = async (values) => {
    try {
      if (selectedClient?.id) {
        await clienteService.actualizar(selectedClient.id, values)
      } else {
        await clienteService.crear(values)
      }

      closeForm()
      await loadClients()
    } catch (error) {
      setErrorMessage('No se pudo guardar el cliente.')
    }
  }

  const handleDeleteClient = async (client) => {
    const confirmed = window.confirm(
      `¿Eliminar a ${client.nombres} ${client.apellidos}?`
    )

    if (!confirmed) {
      return
    }

    try {
      await clienteService.eliminar(client.id)
      await loadClients()
    } catch (error) {
      setErrorMessage('No se pudo eliminar el cliente.')
    }
  }

  return (
    <main className="clients-page">
      <section className="clients-shell">
        <header className="clients-header">
          <div>
            <p className="eyebrow">Gestión de clientes</p>
            <h1>Clientes</h1>
            <p className="subtitle">
              Revisa, busca y prepara la administración de tus registros.
            </p>
          </div>

          <button
            type="button"
            className="add-client-button"
            onClick={openCreateForm}
          >
            Agregar cliente
          </button>
        </header>

        <section className="toolbar" aria-label="Búsqueda de clientes">
          <label className="search-field" htmlFor="client-search">
            <span>Buscar</span>
            <input
              id="client-search"
              type="search"
              placeholder="Filtrar por nombre o documento"
              value={search}
              onChange={async (event) => {
                const value = event.target.value
                setSearch(value)
                await loadClients(value)
              }}
            />
          </label>
        </section>

        {errorMessage ? <p className="page-alert">{errorMessage}</p> : null}

        <section className="table-card" aria-label="Listado de clientes">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nombre completo.</th>
                  <th>Documento.</th>
                  <th>Teléfono.</th>
                  <th>Correo.</th>
                  <th>Estado.</th>
                  <th>Acción.</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <strong>Cargando clientes...</strong>
                        <span>Consultando datos desde la API.</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="client-name">
                          {client.nombres} {client.apellidos}
                        </div>
                      </td>
                      <td>{client.documento}</td>
                      <td>{client.telefono}</td>
                      <td>{client.correo}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            client.estado ? 'is-active' : 'is-inactive'
                          }`}
                        >
                          {client.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="icon-button edit"
                            aria-label={`Editar ${client.nombres} ${client.apellidos}`}
                            title="Editar"
                            onClick={() => openEditForm(client)}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm2.92 2.83H5v-.92l8.06-8.06.92.92L5.92 20.08ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="icon-button delete"
                            aria-label={`Eliminar ${client.nombres} ${client.apellidos}`}
                            title="Eliminar"
                            onClick={() => handleDeleteClient(client)}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M9 3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V5h4a.75.75 0 0 1 0 1.5h-1.06l-.74 11.47A2.25 2.25 0 0 1 14.95 20H9.05a2.25 2.25 0 0 1-2.25-2.03L6.06 6.5H5a.75.75 0 0 1 0-1.5h4V3.75Zm1.5 0V5h2v-1.25a.25.25 0 0 0-.25-.25h-1.5a.25.25 0 0 0-.25.25ZM9.5 9.25a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-6.5Zm6.5 0a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-6.5Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <strong>No hay clientes para mostrar.</strong>
                        <span>
                          Crea un cliente nuevo o ajusta la búsqueda.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {isFormOpen ? (
        <ClientForm
          key={selectedClient?.id ?? 'new-client'}
          client={selectedClient}
          onClose={closeForm}
          onSubmit={handleSubmitClient}
        />
      ) : null}
    </main>
  )
}

export default App
