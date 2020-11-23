import { http } from './config'

export default {
    listar:() => {
        return http.get('photos')
    },

    salvar:(photo) => {
        return http.post('photo', photo)
    },

    atualizar:(photo) => {
        return http.put('photo', photo)
    },

    apagar:(photo) => {
        return http.delete(photo, { data: photo })
    }
}