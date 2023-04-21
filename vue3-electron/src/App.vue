<template>
  <v-app>
    <v-app-bar
      app
      dark
    >
    <!--BARRA DE NAVEGACIÓN-->
    <v-tabs  fixed-tabs>
        <v-tab
        v-for="(item,index) in rutas" :key="index"
        target="_blank"
        text
        @click="insertarRuta(item.ruta)"
        >
        <span class="mr-2">{{item.nombre}}</span>
        </v-tab>
      </v-tabs>
      <div v-if="validar()">
        <v-btn color="red"  @click="salir">
          <v-icon>mdi-account-arrow-left-outline</v-icon>Salir</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
    <!--ALERTA POR SI ES QUE SE PIERDE LA CONEXIÓN A INTERNET, LA CUAL INHABILITA LA APLICACIÓN-->
    <v-dialog v-model="isOnLine" max-width="600px" persistent>
        <v-card>
            <v-card-title class="popUp red darken-2 white--text">
              <v-icon class="mr-2" left>mdi-alert</v-icon>
              <span class="text-h5">Advertencia</span>
            </v-card-title>
            
            <v-card-text class="text-h6">
              Se ha perdido la conexión a Internet. Por favor conectese a una red para utilizar la aplicación.
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Login from './components/Login.vue'
import {auth} from './utils/firebase'
import router from './router'
export default {
  name: 'App',
  components:{Login},
  /*setup(){
    //console.log(useAuth())
      //const {isAuthenticated, user} =useAuth();
      const usuario = auth.currentUser;
      const ingreso=ref(true);
      console.log(usuario)
      if (!usuario){
        ingreso.value=false
      }
      console.log(ingreso.value)
      const salir = async()=> {
        try {
          await auth.signOut();
          router.push('/Login');
          //ingreso.value=false;
        } catch (error) {
          console.log(error)
        }
      }
      return { ingreso, salir};
    
  },*/
  data: () => ({
    // Rutas que conforman barra de navegación
    rutas:[
      {nombre: 'Página principal', ruta:'/'},
      {nombre: 'Insumos', ruta:'/insumo'},
      {nombre: 'Materias primas', ruta:'/materiaprima'},
      {nombre: 'Producto terminado', ruta:'/productoTerminado'},
      {nombre: 'Bitácora', ruta:'/registro'},
      //{nombre: 'Resumen de ventas', ruta: '/resumenVentas'}
    ],
    ingreso: false,
    isOnLine: !navigator.onLine,
  }),
  mounted() {
       //Cada vez que se inicia la aplicación, se recarga y se crean eventos para revisar conexión a internet
        this.recargar('/') 
        window.addEventListener('online', ()=>{this.isOnLine=false});
        window.addEventListener('offline', ()=>{this.isOnLine=true}); 
  },
  methods: {
    //descripción: Se agrega ruta a router
    //entradas: ruta de la aplicación
    //salidas: no hay salidas
    recargar(ruta) {
        return router.push(ruta);
    },

    //descripción: Se cierra sesión
    //entradas: rno hay entradas
    //salidas: no hay salidas
    async salir () {
      try {
        await auth.signOut();
        this.ingreso=false;
        router.push('/Login');
      } catch (error) {
        console.log(error)
      }
    },

    //descripción: Se comprueba que usuario haya ingresado a la aplicación
    //entradas: no hay entradas
    //salidas: booleano de que si se está engresado a no
    validar(){
        const usuario = auth.currentUser;
        //console.log(usuario)
        if (usuario!=null){
          this.ingreso=true;
        }
        return this.ingreso;
    },

    //descripción: Se agrega ruta a router
    //entradas: ruta de la aplicación
    //salidas: no hay salidas
    insertarRuta(ruta){
      router.push(ruta);
    }
  },
  //Antes de cerrar la aplicación
  beforeDestroy() {
        window.addEventListener('online', ()=>{this.isOnLine=false});
        window.addEventListener('offline', ()=>{this.isOnLine=true}); 
    }
};
</script>
