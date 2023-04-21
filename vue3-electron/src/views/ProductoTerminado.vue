<template>
  <div class="producto-terminado-container">
    <div class="producto-terminado-container1">
      <!--TABLA QUE LISTA TODOS LOS PRODUCTOS TERMINADOS-->
      <v-data-table :headers="headers" :items="pr" :search="search" class="elevation-1 blue lighten-5">
        <template v-slot:top>
          <v-toolbar flat>
            <span class="paginaprincipal-text"><span>Productos terminados</span></span>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!--BOTON PARA AGREGAR NUEVO PRODUCTO-->
            <v-btn type="submit" color="primary" large class="mr-4" @click="agregarPT()">
              Crear producto <br /> terminado
            </v-btn>
          </v-toolbar>
          <v-toolbar flat>
            <!--BUSCADOR PARA TABLA-->
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar en productos terminados" single-line
              hide-details>
            </v-text-field>
          </v-toolbar>
        </template>
        <!--BOTONES PARA BORRAR, MOSTRAR FÓRMULA Y DUPLICAR PRODUCTO-->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="delete1Producto(item)">
            mdi-delete
          </v-icon>
          <v-icon small class="mr-2" @click="mostrarFormula(item)">
            mdi-information
          </v-icon>
          <v-icon small class="mr-2" @click="duplicar(item)">
            mdi-content-copy
          </v-icon>
        </template>
      </v-data-table>

      <!--VENTANA EMERGENTE PARA ELIMINAR PRODUCTO SELECCIONADO-->
      <v-dialog v-model="dialogDelete" max-width="690px" @click:outside="closeJustification">
        <v-card>
          <div class="dialog-container1">
            <!--CONFIRMAR ELIMINACIÓN Y SOLICITUD DE MOTIVO-->
            <v-card-title class="text-h5">¿Estas seguro que deseas eliminar este producto?</v-card-title>

              <v-card-actions>
                    <v-combobox v-model="justification" :items="items" label="Seleccione una opción" color="blue darken-1"></v-combobox>
              </v-card-actions>
              <v-container>
              <v-form v-if="justification=='Otro'">
                <v-text-field  
                v-model="justificationText"
                  label="Escriba la razón de esta modificación">
                </v-text-field>
              </v-form>
              </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!--BOTÓN CONFIRMAR ELIMINACIÓN-->
              <v-btn v-if="justification" color="primary" class="mr-2"  @click="deleteProducto">Eliminar</v-btn>
              <v-btn color="primary" class="mr-2" @click.stop="closeJustification">Cancelar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <!--ALERTA POR NO INGRESAR MOTIVO DE ELIMINACIÓN-->
      <v-dialog v-model="dialogNoDelete" max-width="690px" @click:outside="aceptarNoDelete">
        <v-card>
          <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Acción Denegada</span>
            </v-card-title>
          <v-container>
            <span class="paginaprincipal-text1 text-h5">Debe escribir la razón de eliminación de producto terminado!</span>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="primary" class="mr-2"  @click="aceptarNoDelete">Aceptar</v-btn>
              <v-spacer></v-spacer>
            
            </v-card-actions>
        </v-card>
      </v-dialog>

      <!--VENTANA PARA AGREGAR UN NUEVO PRODUCTO, SE LLAMA A COMPONENTE-->
      <v-dialog v-if="dialogAPT" v-model="dialogAPT" max-width="1200px">
        <AgregarProductoTerminado @updateData="agregarNuevoProducto" @cerrar="dialogAPT=false"></AgregarProductoTerminado>
      </v-dialog>
      
      <!--ALERTA POR SI SE QUIERE ELIMINAR PRODUCTO EN LA ORDEN DE FABRICACIÓN-->
      <v-dialog v-model="dialogPendientes"  max-width="600px">
        <v-card>
            <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Acción Denegada</span>
            </v-card-title>
            <v-card-text class="text-h6">
              Lo sentimos, el producto se encuentra en la orden de fabricación y no puede ser eliminado
            </v-card-text>
        </v-card>
      </v-dialog>

      <!--VENTANA DONDE SE MUESTRA LA FÓRMULA DE PRODUCTO TERMINADO-->
      <v-dialog v-if="dialogFormula" v-model="dialogFormula" max-width="1000px">
        <v-card flat>
          <div class="dialog-container1">
            <v-card-text class="formula-titulo-text1 text-center text-h5">Fórmula asociada: {{ this.nombrePT }}</v-card-text>
            <div class="table2-container1">
              <v-container class="container-tabla1">
                <!--TABLA MATERIAS PRIMAS AL REVISAR FORMULAS-->
                <v-data-table :headers="headers1" :items="mp" :items-per-page="5" :search="search1"
                  class="elevation-1 blue lighten-5">
                  <template v-slot:top>
                    <v-toolbar flat>
                      <span class="formula-titulo-text1"><span>Materias primas</span></span>
                      <v-divider class="mx-4" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <!--BUSCADOR TABLA-->
                    <v-toolbar flat>
                      <v-text-field v-model="search1" append-icon="mdi-magnify" label="Buscar materia prima" single-line
                        hide-details></v-text-field>
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-container>
              <v-container class="container-tabla2">
                <!--TABLA INSUMOS AL REVISAR FORMULAS-->
                <v-data-table :headers="headers2" :items="ins" :items-per-page="5" class="elevation-2 blue lighten-5"
                  :search="search2">
                  <template v-slot:top>
                    <v-toolbar flat>
                      <span class="formula-titulo-text1"><span>Insumos</span></span>
                      <v-divider class="mx-4" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <!--BUSCADOR TABLA-->
                    <v-toolbar flat>
                      <v-text-field v-model="search2" append-icon="mdi-magnify" label="Buscar Insumo" single-line
                        hide-details>
                      </v-text-field>
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-container>
            </div>
            <!--SE DA OPCIÓN DE EDITAR FÓRMULA O VOLVER-->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn  color="primary" large class="mr-2" @click="editarFormula">Editar
              </v-btn>
              <v-btn  color="primary" large class="mr-2" @click.stop="dialogFormula=false">Volver
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>

      <!-- VENTANA PARA EDITAR LA FORMULA (SE LLAMA A COMPONENTE Y SE ENTREGA TODAS LAS MATERIAS PRIMAS (aaa), TODOS LOS INSUMOS (bbb) MATERIAS PRIMAS UTILIZADAS (mp) E INSUMOS UTLIZADOS (ins))-->
      <v-dialog v-if="dialogFormulaEditar" v-model="dialogFormulaEditar" max-width="1200px">
        <v-card>
          <div class="dialog-container1">
            <v-card-text class="formula-titulo-text1 text-center text-h5">Editar fórmula de {{ this.nombrePT }}</v-card-text>
              <!--SE ENTREGA TODAS LAS MATERIAS PRIMAS (aaa), TODOS LOS INSUMOS (bbb) MATERIAS PRIMAS UTILIZADAS (mp) E INSUMOS UTLIZADOS (ins)-->
              <!--ID DE PRODUCTO (idProducto), EL NOMBRE DEL PRODUCTO (nombreProducto) Y EL SKU DEL PRODUCTO (skuProducto)-->
              <EditarFormula :aaa="todasMP" :bbb="todasI" :fMP="mp" :fI = "ins" 
              :idProducto="idProductoSeleccionado" 
              :nombreProducto="nombreProductoSeleccionado" 
              :skuProducto="skuProductoSeleccionado" @actualizarFormula="actualizarFormula"></EditarFormula>
          </div>
        </v-card>
      </v-dialog>

      <!--VENTANA PARA DUPLICAR PRODUCTO-->
      <v-dialog v-if="dialogDuplicar" v-model="dialogDuplicar" max-width="1000px">
        <v-card>
          <div class="dialog-container1">
            <v-card-title>
              <span class="formula-titulo-text1 text-center text-h5">Duplicar Producto: {{ nombreDSH }}</span>
            </v-card-title>
            <v-container>
              <!--SE SOLICITA NUEVO NOMBRE Y SKU-->
              <v-form @submit.prevent="addMateria">
                <v-text-field type="text" v-model="nombreD"  label="Nuevo Nombre">
                </v-text-field>
                <v-text-field type="text" v-model="skuD"  label="Nuevo SKU">
                </v-text-field>
              </v-form>
              <div class="table2-container1">
                <v-container class="container-tabla1">
                  <!--TABLA PARA MOSTRAR MATERIAS PRIMAS ASOCIADAS-->
                  <v-data-table :headers="headers1" :items="mp" :items-per-page="15" :search="search1"
                    class="elevation-1 blue lighten-5">
                    <template v-slot:top>
                      <v-toolbar flat>
                        <span class="formula-titulo-text1"><span>Materias primas Asociadas</span></span>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-toolbar flat>
                        <!--BUSCADOR EN TABLA-->
                        <v-text-field v-model="search1" append-icon="mdi-magnify" label="Buscar materia prima" single-line
                          hide-details></v-text-field>
                      </v-toolbar>
                    </template>
                  </v-data-table>
                </v-container>
                <v-container class="container-tabla2">
                  <!--TABLAS PARA MOSTRAR INSUMOS ASOCIADOS-->
                  <v-data-table :headers="headers2" :items="ins" :items-per-page="15" class="elevation-2 blue lighten-5"
                    :search="search2">
                    <template v-slot:top>
                      <v-toolbar flat>
                        <span class="formula-titulo-text1"><span>Insumos Asociados</span></span>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-toolbar flat>
                        <!--BUSCADOR EN TABLA-->
                        <v-text-field v-model="search2" append-icon="mdi-magnify" label="Buscar Insumo" single-line
                          hide-details>
                        </v-text-field>
                      </v-toolbar>
                    </template>
                  </v-data-table>
                </v-container>
              </div>
              <v-card-actions>
                  <!--OPCIONES DE GUARDAR PRODUCTO DUPLICADO O CANCELAR LA ACCIÓN-->
                  <v-spacer></v-spacer>
                  <v-btn color="primary" class="mr-2" @click="crearCopia">
                    Guardar
                  </v-btn>
                  <v-btn color="primary" class="mr-2" @click="dialogDuplicar=false">
                    Cancelar
                  </v-btn>
                </v-card-actions>
            </v-container>
          </div>
        </v-card>
      </v-dialog>
      <div class="duplicar-producto-terminado-container5">
        <!--ALERTA SI CAMPO NOMBRE ESTÁ VACÍO-->
        <v-dialog v-model="dialogUpdate3" max-width="600px">
          <v-card>
            <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Ingresar Nombre</span>
            </v-card-title>
            <v-card-text class="text-h6">
              Por favor, ingrese un nombre para el producto.
            </v-card-text>
          </v-card>
        </v-dialog>
        <!--ALERTA SI CAMPO SKU ESTÁ VACÍO-->
        <v-dialog v-model="dialogUpdate4" max-width="600px">
          <v-card>
            <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Ingresar SKU</span>
            </v-card-title>
            <v-card-text class="text-h6">
              Por favor, ingrese un código SKU para el producto.
            </v-card-text>
          </v-card>
        </v-dialog>
        <!--ALERTA SI NOMBRE INGRESADO YA ESTÁ EN BASE DE DATOS-->
        <v-dialog v-model="dialogUpdate4_2" max-width="600px">
          <v-card>
            <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Advertencia</span>
            </v-card-title>
            <v-card-text class="text-h6">
              El nombre ingresado ya está siendo utilizado para otro producto.
            </v-card-text>
          </v-card>
        </v-dialog>
        <!--ALERTA SI SKU INGRESADO YA ESTÁ EN LA BASE DE DATOS-->
        <v-dialog v-model="dialogUpdate4_3" max-width="600px">
          <v-card>
            <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Advertencia</span>
            </v-card-title>
            <v-card-text class="text-h6">
              El código SKU ingresado ya está siendo utilizado para otro producto.
            </v-card-text>
          </v-card>
        </v-dialog>
        <!--SE MUESTRA EN PANTALLA QUE CONTENIDO ESTÁ CARGANDO-->
        <v-dialog v-model="loading" persistent>
        <v-overlay  position: absolute>
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary">
          </v-progress-circular>
          </div>
        </v-overlay>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
//SE REALIZAN IMPORTACIONES NECESARIAS
import { auth } from '../utils/firebase';
import {logNew,logDelete} from '../functions/bitacora.js';
import AgregarProductoTerminado from '../components/AgregarProductoTerminado.vue';
import EditarFormula from '../components/EditarFormula.vue';

import firebase from "../utils/firebase.js";
const db = firebase.collection("ProductoTerminado");
const dbMP = firebase.collection("MateriasPrimas");
const dbI = firebase.collection("Insumos");
const dbPend = firebase.collection("productosPendientes");


export default {
  name: "ProductoTerminado",
  props: {},
  components: { AgregarProductoTerminado, EditarFormula },
  //VARIABLES ASOCIADAS A LA VISTA
  data: () => ({
    errors:[],
    dialogNoDelete:false,
    justification: null,
    justificationText:null,
    items: [
        'Materia descontinuada',
        'Otro',
    ],
    loading: false,
    search: '',
    pr: [],
    // Columnas en la tabla de productos terminados
    headers: [
      {
        text: "SKU",
        align: "start",
        value: 'sku',
        class: "blue darken-1 white--text"
      },
      { text: 'Producto', value: 'nombre', class: "blue darken-1 white--text" },
      { text: 'Acción', value: 'actions', class: "blue darken-1 white--text" },
    ],
    // Columnas en la tabla de materias primas
    headers1: [

      { text: "Materia Prima", value: "NombreMateriaPrima", class: "blue darken-1 white--text" },
      { text: 'Código', align: "start", value: 'codigoMP', class: "blue darken-1 white--text" },
      { text: "Cantidad (mL)", value: "CantMateriaPrima", class: "blue darken-1 white--text" },
    ],
    // Columnas en la tabla de insumos
    headers2: [
      { text: "Insumo", align: "start", value: "NombreInsumo", class: "blue darken-1 white--text" },
      { text: 'Código', align: "start", value: 'codigoI', class: "blue darken-1 white--text" },
      { text: "Cantidad (unidades)", value: "CantidadInsumo", class: "blue darken-1 white--text" },
    ],
    nombre: '',
    sku: null,
    dialogDelete: false,
    dialogFormula: false,
    dialogFormulaEditar: false,
    dialogAPT: false,
    dialogPendientes: false,
    dialogDuplicar: false,
    dialogUpdate3: false,
    dialogUpdate4: false,
    dialogUpdate4_2: false,
    dialogUpdate4_3: false,
    idN: null,
    idTabla: null,
    search1: '',
    search2: '',
    ins: [],
    mp: [],
    todasMP: [],
    todasI: [],
    i: [],
    m: [],
    leer: 0,
    nombrePT: null,
    skuPT: null,
    idProductoSeleccionado : null,
    nombreProductoSeleccionado: null,
    skuProductoSeleccionado: null,
    itemEnCuestion: null,
    nombreD: '',
    skuD: '',
    nombreDSH: '',
    duplicado: false,
    duplicadoFormula: false,
    idTablaD: '',
  }),
 
  mounted() {
    // CADA VEZ QUE SE INICIALIZA LA VISTA SE OBTIENEN TODOS LOS PRODUCTOS
    this.getProductos();
    
  },
  methods: {
    //descripción: se revisa que exista justificación al eliminar producto
    //entradas: no hay entradas
    //salidas: true si existe justificación
    checkForm(){
      if (this.justificationText>0) {
        console.log("aa")
        return true;
      }
      this.errors = [];
      if(this.justification=='Otro'){
        console.log("Otro")
          if (!this.justificationText) {
            console.log("se logro")
            this.errors.push('La justificación es obligatoria.');
          }
      }
    },
    //descripción: se cierra alerta al eliminar sin justificación
    //entradas: no hay entradas
    //salidas: no hay salidas
    aceptarNoDelete(){
      this.dialogNoDelete=false;
    },

    //descripción: se cierra ventana eliminar producto y se reinician valores de justificación
    //entradas: no hay entradas
    //salidas: no hay salidas
    closeJustification(){
      this.dialogDelete=false;
      this.justification=null;
      this.justificationText=null;
    },

    //descripción: se agrega nuevo producto a la tabla (si es duplicado después de la versión original, sino al inicio de la tabla)
    //entradas: sku nuevo producto para buscarlo en base de datos
    //salidas: no hay salidas
    async agregarNuevoProducto(valor) {
      this.dialogAPT = false;
      let query = await db
        .where("sku", "==", valor)
        .get();
      query.forEach(doc => {
        let productoData = doc.data();
        productoData.id = doc.id;
        if(!this.duplicado)
          this.pr.unshift(productoData);
        else{
          this.pr.splice(this.idTablaD+1, 0, productoData);
          this.duplicado= false;
        }
      })
    },

    //descripción: se obtienen los productos de la base de datos y se guardan en this.pr
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getProductos() {
      try {
        const snapshot = await db.get();
        const productos = [];
        snapshot.forEach(doc => {
          let productoData = doc.data();
          productoData.id = doc.id;
          productos.push(productoData);
        })
        this.pr = productos;

      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se revisa si producto está en la orden de fabriacción, sino se guardan datos del producto y se abre ventana de eliminación
    //entradas: producto a eliminar
    //salidas: no hay salidas
    async delete1Producto(item) {
      let query = await dbPend
      .where("idPT", "==", item.id)
      .get();
      console.log(query.size)
      if(query.size != 0){
        this.dialogPendientes = true;
      }else{
      this.idN = item.id;
      this.idTabla = this.pr.indexOf(item);
      this.dialogDelete = true;
      }
    },

    //descripción: se elimina producto, se guarda su justificación y se elimina producto de la tabla de productos terminados 
    //entradas: no hay entradas
    //salidas: no hay salidas
    async deleteProducto() {
      try {
        this.loading = true;
        this.checkForm()
        if(this.errors.length>0){
          this.dialogNoDelete=true
          this.loading = false;
          return;
        }
        //Se elimina producto de la base de datos
        await db.doc(this.idN).delete();
        let motivo;
        if (this.justification!='Otro'){
          motivo = this.justification;
        }else{
          motivo = this.justificationText;
        }
        // Se guarda justificación 
        logDelete("productoTerminado", auth.currentUser.email, {
            nombre: this.pr[this.idTabla].nombre,
            MateriasPrimasAsociadas: this.pr[this.idTabla].MateriasPrimasAsociadas,
            InsumosAsociados: this.pr[this.idTabla].InsumosAsociados,
          },motivo);
        // Se elimina de la tabla
        this.pr.splice(this.idTabla, 1);
        this.dialogDelete = false;
        this.justification=null;
        this.justificationText=null;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se guardan datos de producto para mostrar en la ventana de fórmula
    //entradas: producto al cuál se quiere ver la fórmula
    //salidas: no hay salidas
    mostrarFormula(item) {
      this.idProductoSeleccionado = item.id;
      this.nombreProductoSeleccionado = item.nombre;
      this.skuProductoSeleccionado = item.sku;
      this.idTabla = this.pr.indexOf(item);
      this.duplicadoFormula = false;
      this.mostrarFormula2(item);
    },

    //descripción: se prepara ventana mostrar fórmula revisando las materias e insumos asociados
    //entradas: producto al cuál se quiere ver la fórmula
    //salidas: no hay salidas
    async mostrarFormula2(item) {
      this.dialogFormulaEditar = false;
      this.mp = [];
      this.ins = [];
      this.nombrePT = item.nombre;
      this.skuPT = item.sku;
      // Se guardan materias asociadas al producto
      await item.MateriasPrimasAsociadas.forEach( async elemento => {
        let query1 = await dbMP.doc(elemento.idMP).get();
        let mAsociada = {
          NombreMateriaPrima: query1.data().nombre,
          codigoMP: query1.data().codigo,
          CantMateriaPrima: elemento.CantMateriaPrima,
          id: elemento.idMP
        }
        this.mp.push(mAsociada)
        
      });
      // Se guardan insumos asociados al producto
      await item.InsumosAsociados.forEach(async elemento => {
        let query2 = await dbI.doc(elemento.idI).get();
        let iAsociada = {
          NombreInsumo: query2.data().nombre,
          codigoI: query2.data().codigo,
          CantidadInsumo: elemento.CantidadInsumo,
          id: elemento.idI
        }
        this.ins.push(iAsociada)
      });
      this.nombreProductoSeleccionado = item.nombre;
      this.skuProductoSeleccionado = item.sku;
      this.loading= false;
      // Si no se va a duplicar, se abre ventana de fórmula asociada
      if (!this.duplicadoFormula)
      this.dialogFormula = true;
    },

    //descripción: se abre ventana para crear producto terminado
    //entradas: no hay entradas
    //salidas: no hay salidas
    agregarPT() {
      this.dialogAPT = true;
    },

    //descripción: se abre ventana editar fórmula
    //entradas: no hay entradas
    //salidas: no hay salidas
    async editarFormula(){
        this.loading = true;
        // Se cargan todas las materias y todos los insumos de la base de datos hasta ahora
        await this.getMaterias();
        await this.getInsumos();
        this.loading = false;
        this.dialogFormula = false;
        this.dialogFormulaEditar = true;
        
    },
    //descripción: se obtienen las materias primas de la base de datos y se guardan en this.todasMP
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getMaterias() {
      try {
        let snapshot = await dbMP.get();
        let materias = [];
        snapshot.forEach(doc => {
          let materiasData = doc.data();
          materiasData.id = doc.id;
          // A cada materia guardada se agrega atributo de cantidad y estado
          materiasData.cantidadMP = 0;
          materiasData.estado = false;
          materias.push(materiasData);
        })
        this.todasMP = materias;
        console.log(this.todasMP)

      } catch (error) {
        console.log(error);
      }
    },
    //descripción: se obtienen los insumos de la base de datos y se guardan en this.todasI
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getInsumos() {
      try {
        let snapshot = await dbI.get();
        let insumos = [];
        snapshot.forEach(doc => {
          let insumoData = doc.data();
          insumoData.id = doc.id;
          // A cada insumo guardado se agrega atributo de cantidad y estado
          insumoData.cantidadI = 0;
          insumoData.estado = false;
          insumos.push(insumoData);
        })
        this.todasI = insumos;

      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se actualiza el producto editado en la tabla de todos los productos, además de mostrar la ventana de fórmula asociada con datos actualizados
    //entradas: no hay entradas
    //salidas: no hay salidas
    async actualizarFormula(){
      this.loading = true;
      let query1 = await db.doc(this.idProductoSeleccionado).get();
      console.log(this.idProductoSeleccionado)
      this.dialogFormulaEditar = false;
      this.pr[this.idTabla].MateriasPrimasAsociadas = query1.data().MateriasPrimasAsociadas;
      this.pr[this.idTabla].InsumosAsociados = query1.data().InsumosAsociados;
      this.pr[this.idTabla].indiceMP = query1.data().indiceMP;
      this.pr[this.idTabla].indiceI = query1.data().indiceI;
      this.pr[this.idTabla].nombre = query1.data().nombre;
      this.pr[this.idTabla].sku = query1.data().sku;
      this.mostrarFormula2(query1.data());
    },

    //descripción: se guardan datos del producto para que sea duplicado, además se abre la ventana de duplicación
    //entradas: producto a duplicar
    //salidas: no hay salidas
    duplicar(item){
        this.dialogDuplicar = true;
        this.nombreDSH = item.nombre;
        this.mpAsociadasD = item.MateriasPrimasAsociadas;
        this.iAsociadasD = item.InsumosAsociados;
        this.indicesID = item.indiceI;
        this.indicesMPD = item.indiceMP;
        this.skuD = item.sku;
        this.nombreD = item.nombre;
        this.idTablaD = this.pr.indexOf(item);
        this.duplicadoFormula = true;
        this.mostrarFormula2(item);
    },

    //descripción: se crea la copia del producto terminado, revisando si la información ingresada es correcta, 
    //             actualizando la base de datos, y guardando la acción en la bitácora y 
    //entradas: no hay entradas
    //salidas: no hay salidas
    async crearCopia(){
        this.loading=true;
        let query2 = await db
        .where("nombre", "==", this.nombreD)
        .get();
        let query3 = await db
        .where("sku", "==", this.skuD)
        .get();
        //Si campo nombre está vacío
        if (this.nombreD == '')
          this.dialogUpdate3 = true;
        //Si campo sku está vacío
        else if (this.skuD == '')
          this.dialogUpdate4 = true;
        //Si ya existe el nombre en la base de datos
        else if (query2.size != 0) {
          this.dialogUpdate4_2 = true;
        }
        //Si ya existe el sku en la base de datos
        else if (query3.size != 0) {
          this.dialogUpdate4_3 = true;
        }
        else {
            //Se actualiza la base de datos de productos
            await db.doc().set({
              nombre: this.nombreD,
              sku: this.skuD,
              MateriasPrimasAsociadas: this.mpAsociadasD,
              InsumosAsociados: this.iAsociadasD,
              indiceI: this.indicesID,
              indiceMP: this.indicesMPD
            });
            logNew("productoTerminado", auth.currentUser.email, {
              nombre: this.nombreD,
              sku: this.skuD,
              MateriasPrimasAsociadas: this.mpAsociadasD,
              InsumosAsociados:  this.iAsociadasD,
            },"Duplicación de Producto");
            this.duplicado = true;
            this.agregarNuevoProducto(this.skuD);
            this.loading=false;
            this.dialogDuplicar = false;
        }
        this.duplicadoFormula = false;
        this.loading=false;
      }
  },
};
</script>

<style scoped>

.paginaprincipal-text1 {
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  align-self: center;
  align-items: center;
}
.producto-terminado-container {
  width: 100%;
  display: flex;
  overflow: auto;
  min-height: 100vh;
  transition: 0.3s;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 40px;
}

.producto-terminado-container1 {
  flex: 1;
  display: flex;
  align-self: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}




.paginaprincipal-text {
  color: rgba(0, 0, 0, 1);
  width: 900px;
  height: auto;
  position: absolute;
  font-size: 32px;
  align-self: auto;
  font-style: Bold;
  text-align: left;
  font-weight: 700;
  line-height: normal;
  font-stretch: normal;
  margin-right: 0;
  margin-bottom: 0;
  text-decoration: none;
}



.formula-titulo-text1 {
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  align-self: center;
  align-items: center;
}

.dialog-container1 {
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 40px;
  padding-right: 40px;
  
}


.table2-container1 {
  width: 100%;
  display: flex;
  align-items:  flex-start;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
}

.duplicar-producto-terminado-container5 {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 100px;
  justify-content: center;
}
</style>

