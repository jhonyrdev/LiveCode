import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? '/api',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
})

const clienteService = {
	listar(params = {}) {
		return api.get('/clientes', { params })
	},

	obtener(id) {
		return api.get(`/clientes/${id}`)
	},

	crear(data) {
		return api.post('/clientes', data)
	},

	actualizar(id, data) {
		return api.put(`/clientes/${id}`, data)
	},

	eliminar(id) {
		return api.delete(`/clientes/${id}`)
	},
}

export default clienteService
