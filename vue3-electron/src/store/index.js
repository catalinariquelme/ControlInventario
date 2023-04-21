import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //insumos : []
  },
  getters: {
  },
  mutations: { //Aqui se definen funciones
    //setInsumos(state, value){
      //state.insumos = value;
      //console.log(state.insumos)
    //}


  },
  actions: { //Aqui se hacen las llamadas tipo sql
    /*getInsumos({commit}){
      const list = []
      app.database().ref("Insumo").on("value", data => {
        //limpiar la colección
        for(var i = list.length -1; i>=0; i--){
          list.splice(i,1);
        }
        //firebase: en donde se ocupa la data
        data.forEach(obj =>{
          let i = obj.val()
          i.id = obj.key
          list.push(i);
        })
      })
      //enviar coleccion al mutation
      commit('setInsumos',list)

    }
  */},
  modules: {
  }
})
