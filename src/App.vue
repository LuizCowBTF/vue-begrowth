<template>
  <div id="app">
    <div id="container">
      <div id="nav">
        <h2>Fotos</h2>
        <div>
          <ul>
            <li v-for="(erro, index) of errors" :key="index">
              campo <b>{{ erro.field }}</b> - {{ erro.defaultMessage }}
            </li>
          </ul>
          <form id="formulario" @submit.prevent="salvar">
            <input v-model="photo.id"
              type="text"
              id="input"
              placeholder="Albúm"
              aria-label="Albúm"
            >
            <input v-model="photo.title"
              type="text"
              id="input"
              placeholder="Título"
              aria-label="Título"
            >
            <input v-model="photo.thumbnailUrl"
              type="text"
              id="input"
              placeholder="Imagem Thumb"
              aria-placeholder="Imagem Thumb"
            >
            <button id="botaoSalvar">Salvar</button>
            <br>
            <input v-model="search"
              type="text" 
              id="pesquisa"
              placeholder="Pesquisar" 
              aria-label="Pesquisar"
            >
            <button id="botaoPesquisa">Pesquisar </button>
          </form>
        </div>
      </div>
      <div id="card">
        <table>
          <thead>
            <tr>
              <th>Album:</th>
              <th>Titulo:</th>
              <th>Imagem Thumb:</th>
              <th>Ação:</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="photo of photos" :key="photo.id">
              <td id="tdAlbum"><h3>{{ photo.id }}</h3></td>
              <td id="tdTitulo"><h4>{{ photo.title }}</h4></td>
              <td id="tdImagem">
                <img id="downloadPreview" :src="photo.thumbnailUrl" />
              </td>
              <td id="tdBotao">
                <button @click="editar(photo)" id="botaoEditar">Editar</button>
                <button @click="remover(photo)" id="botaoExcluir">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="pagination">
        <nav aria-label="Page Navigation">
          <ul>
            <li class="page-item">
              <button type="button" class="page-link" v-if="page != 1" @click="page--"> Anterior </button>
            </li>
            <li class="page-item">
              <button type="button" class="page-link" v-for="pageNumber in pages.slice(page-1, page+15)" @click="page = pageNumber" :key="pageNumber.id"> {{pageNumber}} </button>
            </li>
            <li class="page-item">
              <button type="button" class="page-link" @click="page++" v-if="page < pages.length"> Próxima </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import Photos from './services/photos'

export default {
  data(){
    return {
      photo: {
        id: '',
        title: '',
        thumbnailUrl: ''
      },
      photos: [],
      errors: [],
      search: '',
      page: 1,
      perPage: 9,
      pages: []
    }
  },
  mounted(){
    this.listar()
  },

  methods:{
    listar() {
      Photos.listar().then(resposta => {
      this.photos = resposta.data
      })
    },

    salvar() {
      if(!this.albumId){
        Photos.salvar(this.photo).then(resposta => {
          this.photos = {resposta}
          alert('Salvo com sucesso!')
          this.listar()
          this.errors = []
        }).catch(e => {
          this.errors = e.response.data.errors
        })
      }
      else
      {
        Photos.atualizar(this.photo).then(resposta => {
          this.photos = {resposta}
          alert('Atualizado com sucesso!')
          this.listar()
          this.errors = []
        }).catch(e => {
          this.errors = e.response.data.errors
        })
      }
    },

    editar(photo) {
      this.photo = photo
    },

    remover(photo) {
      if(confirm('Deseja excluir a informação?')){
        Photos.apagar(photo).then(resposta => {
          this.photos = {resposta}
          this.listar()
          this.errors = {}
        }).catch(e => {
          this.errors = e.data.errors
        })
      }
    },

    getPhotos () {
      for(let i = 0; i < 9; i++){
        this.photos.push({Album: '1',
               Titulo:'Titulo',
               suffix:'#' + i});
      }  
    },

    setPages () {
      let numberOfPages = Math.ceil(this.photos.length / this.perPage)
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index)
      }
    },
    paginate (photos) {
      let page = this.page;
      let perPage = this.perPage;
      let from = (page * perPage) - perPage;
      let to = (page * perPage);
      return  photos.slice(from, to);
    }
  },

  computed: {
    displayedPhotos () {
      return this.paginate(this.photos);
    }
  },

  watch: {
    photos () {
      this.setPages();
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
#container {
  width: auto;
}
#nav {
  border: 2px solid rgb(102, 102, 51);
  border-radius: 20px;  
  margin: 5px auto 10px auto;
  width: 90%;
  height: auto;
  background-color: rgb(184, 184, 148);
}
#card {
  border: 2px solid rgb(102, 102, 51);
  border-radius: 20px;  
  margin: 5px auto 5px auto;
  width: 90%;
  height: auto;
  background-color: rgb(184, 184, 148);
}
#formulario {
  width: 80%;
  margin: 20px auto 20px auto;
  padding: 5px;
  border-color: 5px solid rgb(255, 255, 255);
  border-radius: 8px;
  background-color: #2c3e50;
  color: rgb(255, 255, 255);
}
#input {
  width: 25%;
  height: 30px;
  font-size: 16px;
  font-weight: border;
  border: 2px solid rgb(102, 102, 51);
  border-radius: 6px;
  background-color: rgb(255, 255, 255);
  margin: 10px 5px 20px 5px;
  padding-left: 5px;
}
#botaoSalvar {
  width: 10%;
  height: 30px;
  font-size: 12px;
  font-weight: border;
  color: rgb(255, 255, 255);
  border: 2px solid rgb(102, 102, 51);
  border-radius: 6px;
  background-color:forestgreen;
  margin: 10px 5px 20px 5px;
  padding: 5px auto 5px auto;
}
#pesquisa {
  width: 80%;
  height: 30px;
  font-size: 16px;
  font-weight: border;
  border: 2px solid rgb(102, 102, 51);
  border-radius: 6px;
  background-color: rgb(255, 255, 255);
  margin: 10px 5px 20px 5px;
  padding-left: 5px;
}
#botaoPesquisa {
  width: 10%;
  height: 30px;
  font-size: 12px;
  font-weight: border;
  color: rgb(255, 255, 255);
  border: 2px solid rgb(102, 102, 51);
  border-radius: 6px;
  background-color:darkolivegreen;
  margin: 10px 5px 20px 5px;
  padding: 5px auto 5px auto;
}
table {
  width: auto;
  margin: 15px auto 15px auto;
  padding: 20px 15px 20px 15px;
}
th {
  font-size: 16px;
  border: 2px solid rgb(102, 102, 51);
  border-radius: 8px;
  background-color: rgb(184, 184, 148);
  margin: 10px 10px 30px 10px;
  padding: 5px 5px 5px 5px;
}
tr {
  margin: 10px auto 30px auto;
}
#tdAlbum {
  width: 5%;
  margin: 20px auto 20px auto;
  padding: 5px;
  border-color: 5px solid rgb(255, 255, 255);
  border-radius: 8px;
  background-color: #2c3e50;
  color: rgb(255, 255, 255);
}
#tdTitulo {
  width: 50%;
  margin: 20px auto 20px auto;
  padding: 5px;
  border-color: 5px solid rgb(255, 255, 255);
  border-radius: 8px;
  background-color: #2c3e50;
  color: rgb(255, 255, 255);
}
#tdImagem {
  width: 25%;
  margin: 20px auto 20px auto;
  padding: 5px;
  border-color: 5px solid rgb(255, 255, 255);
  border-radius: 8px;
  background-color: #2c3e50;
  color: rgb(255, 255, 255);
}
#tdBotao {
  width: 20%;
  margin: 10px auto 10px auto;
  padding: 5px;
  border-color: 5px solid rgb(255, 255, 255);
  border-radius: 8px;
  background-color: #2c3e50;
  color: rgb(255, 255, 255);
}
#botaoEditar {
  width: 40%;
  height: 30px;
  font-size: 12px;
  font-weight: border;
  color: rgb(255, 255, 255);
  border: 2px solid rgb(102, 102, 51);
  border-radius: 6px;
  background-color: blue;
  margin: 10px;
  padding: 5px auto 5px auto;
}
#botaoExcluir {
  width: 40%;
  height: 30px;
  font-size: 12px;
  font-weight: border;
  color: rgb(255, 255,255);
  border: 2px solid rgb(102, 102, 51);
  border-radius: 6px;
  background-color: red;
  margin: 10px;
  padding: 5px auto 5px auto;

}
#downloadPreview {
  border: 1px solid #FFF;
}
#pagination {
  width: auto;
  display: inline;
  margin: 30px 0px 30px 0px;
}
ul {
  list-style-type: none;
}
li {
  display: inline;
  padding: 5px;
}
button.page-link {
  display: inline-block;
  margin: 0px 2px 0px 2px;
}
button.page-link {
  background-color: #2c3e50;
  font-size: 22px;
  color: rgb(255, 255, 255);
  font-weight: bolder;
  padding: 0px 5px 0px 5px;
}
.offset {
  width: 500px !important;
  margin: 20px auto;  
}
</style>
