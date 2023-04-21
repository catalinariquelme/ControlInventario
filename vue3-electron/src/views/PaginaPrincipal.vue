<template>
  <div class="pagina-principal-container">
    <div class="pagina-principal-container1">
      <!--DIALOGO QUE MUESTRA LOS DETALLES DE UNA FORMULA-->
      <v-dialog v-model="dialogFormula" max-width="1000px">
        <v-card>
          <v-container>
            <div class="table2-container1">
              <formulaAsociada :itemDetails="itemDetails"></formulaAsociada>
            </div>
            <div class="container-volver">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-2" @click="okDialogFormula">Volver
                </v-btn>
              </v-card-actions>
            </div>
          </v-container>
        </v-card>
      </v-dialog>
      <!--DIALOGO PARA AÑADIR PRODUCTOS A LA LISTA DE PRODUCTOS PENDIENTES-->
      <v-dialog v-model="dialogAddProductoPendiente" max-width="800px">
        <v-card>
          <div class="agregar-producto-pendiente-container2">
            <span class="agregar-producto-pendiente-text">
              Agregar orden de fabricación
            </span>
          </div>
          <template>
            <!--TABLA CON LISTA DE PRODUCTOS-->
            <div>
              <div class="agregar-producto-pendiente-container4">
                <v-data-table :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"  :headers="headers1" :items="productoPendientes" :items-per-page="5" :search="search"
                  item-key="sku " class="elevation-1 blue lighten-5" checkbox-color="blue darken-3">
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
                      </v-text-field>
                    </v-toolbar>
                  </template>
                  <template v-slot:[`item.cantidad`]="{ item }">
                    <v-text-field :disabled="!item.estado"  v-model.number="item.cantidad" background-color="transparent" hide-details single-line
                      solo flat placeholder="Cantidad" type="number" min="0" oninput="validity.valid||(value='');" />
                  </template>
                  <template v-slot:[`item.estado`]="{ item }">
                    <v-simple-checkbox @click="activarSeleccionar" v-model="item.estado"></v-simple-checkbox>
                  </template>
                </v-data-table>
              </div>
            </div>
          </template>
          <!--BOTON PARA SUBIR UN EXCEL CON LOS PRODUCTOS A AGREGAR-->
          <div class="agregar-producto-pendiente-container3">
            <div class="agregar-producto-pendiente-container5">
              <v-file-input show-size type="file" id="file_upload" label="Insertar archivo" accept=".xlsx"></v-file-input>
              <v-btn  color="blue-grey" class="ma-2 white--text"
                @click="upload">
                Guardar cambios<v-icon right dark>
                  mdi-cloud-upload
                </v-icon>
              </v-btn>
            </div>
            <v-btn color="primary" dark class="mb-2" large @click="cerrarVentanaAddProductoPendiente">
              Agregar orden de fabricación
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <div class="pagina-principal-container2">
        <!--BOTON PARA IR A DIALOGO DE AÑADIR PRODUCTOS PENDIENTES-->
        <v-btn color="purple darken-1" dark class="mb-2" elevation="2" x-large
          @click="abrirVentanaAddProductoPendiente">
          Agregar orden de fabricación
        </v-btn>
        <!--TABLA CON LISTA DE PRODUCTOS PENDIENTES-->
        <v-container class="container-tabla1">
          <v-data-table no-data-text="No hay ordenes de fabricación" :headers="headersPendientes" :items-per-page="5" :items="productosPendientes" :search="search1"
            class="elevation-1 blue lighten-5">
            <!--SE SETEA TITULO Y BOTON DE PARTE DE ARRIBA DE LA TABLA-->
            <template v-slot:top>
              <v-toolbar flat>
                <span class="agregar-producto-pendiente-text"><span>Orden de fabricación</span></span>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" @click="enviarAFinalizados()">
                  Finalizar
                </v-btn>
                <!--DIALOGO DE EDITAR UN PRODUCTO-->
                <v-dialog v-model="dialog" max-width="500px">
                  <v-card>
                    <v-card-title>
                      <span class="text-h5"><strong>{{ formTitle }}</strong></span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field type="number" v-model.number="editedItem.cantidad" label="Cantidad">
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" dark class="mb-2"   @click="save">
                        Guardar
                      </v-btn>
                      <v-btn color="primary" dark class="mb-2"   @click="close">
                        Cancelar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!--DIALOGO DE ELIMINAR UN PRODUCTO-->
                <v-dialog v-model="dialogDelete" max-width="740px">
                  <v-card>
                    <div class="dialog-container1">
                      <v-card-title class="text-h5">¿Estás seguro que deseas eliminar el producto pendiente?
                      </v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" class="mr-2"  @click="deleteItemConfirm">Continuar</v-btn>
                        <v-btn color="primary" class="mr-2"  @click="closeDelete">Cancelar</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </div>
                  </v-card>
                </v-dialog>
              </v-toolbar>
              <!--BARRA DE BUSQUEDA DENTRO DE TABLA ORDEN DE FABRICACION-->
              <v-toolbar flat>
                <v-text-field v-model="search1" append-icon="mdi-magnify" label="Buscar en orden de fabricación"
                  single-line hide-details>
                </v-text-field>
              </v-toolbar>
            </template>
            <!--COLUMNA DE SELECCCION DE PRODUCTOS-->
            <template v-slot:[`item.estado`]="{ item }">
              <v-simple-checkbox v-model="item.estado" @mousedown="contarSeleccionados(item.estado)"></v-simple-checkbox>
            </template>
            <!--OPCIONES DE EDITAR, ELIMINAR Y MOSTRAR FORMULA PARA CADA PRODUCTO-->
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                mdi-delete
              </v-icon>
              <v-icon small @click="mostrarFormula(item)">
                mdi-information
              </v-icon>
            </template>

          </v-data-table>
        </v-container>

        <!--TABLA DE PRODUCTOS FINALIZADOS-->
        <v-container class="container-tabla1">
          <v-data-table no-data-text="No hay productos completados" :headers="headersFinalizados" :items-per-page="5" :items="productosFinalizados"
            sort-by="Producto" class="elevation-1 blue lighten-5">
            <template v-slot:top>
              <v-toolbar flat>
                <span class="agregar-producto-pendiente-text"><span>Productos completados</span></span>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" @click="deleteCollectionFinalizados">
                  limpiar
                </v-btn>
                
                
                <!--DIALOGO EN CASO DE NO SELECCIONAR PRODUCTO-->
                <v-dialog v-model="dialogNoneSelect" max-width="440px">
                  <v-card>
                    <v-card-title class="popUp yellow darken-2 white--text">
                      <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                      <span class="text-h5">Advertencia</span>
                    </v-card-title>
                    <v-card-text class="text-h6">
                      Debe seleccionar al menos un producto.
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" class="mr-2"  @click="okNoneSelect">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!--DIALOGO AVISO SUPERACIÓN STOCK-->
                <v-dialog v-model="dialogSuperaStock" max-width="600px">
                  <v-card>
                    <v-card-title class="popUp yellow darken-2 white--text">
                      <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                      <span class="text-h5">Advertencia</span>
                    </v-card-title>
                    <v-card-text class="text-h6">
                      Los siguientes productos no deben superar el stock para ser
                      Finalizados:<br /><br />
                      <ul v-for="(item) in textDialogSuperaStock">
                        {{ item.nombre }}
                      </ul>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" class="mr-2"  @click="okSuperaStock">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!--DIALOGO ALERTA-->
                <v-dialog v-model="dialogDetailsAlert" max-width="600px">
                  <v-card>
                    <v-card-title class="popUp yellow darken-2 white--text">
                      <v-icon class="mr-2" left>mdi-information-outline</v-icon>
                      <span class="text-h5">Detalles</span>
                    </v-card-title>
                    <v-card-text class="text-h6">
                      {{dialogDetailsAlertContent}} para los productos:<br /><br />
                      <ul v-for="(item) in traspasoAlerta">
                        {{ item }}
                      </ul>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" class="mr-2"  @click="dialogDetailsAlert=false">OK</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-container>
      </div>
      <div class="pagina-principal-container5">
        <div class="pagina-principal-container6">
          <!--DASHBOARD AVISOS-->
          <span class="pagina-principal-text06 pt-4">Avisos</span>
          <v-list color="rgb(255, 0, 0, 0)">
            <!--LISTA CON AVISOS-->
            <v-list-item v-for="(alerta, i) in alertas" :key="i">
              <v-alert class="alertas" elevation="2" light :type=alerta.type>
                <v-row dense>
                  <v-col cols="10"  id="texto">
                    {{ alerta.text1 }}<strong>{{ alerta.nombre }}</strong>{{ alerta.text2 }}
                  </v-col>
                  <v-col cols="2" >
                    <v-btn icon color="white"  @click="infoAlerta(alerta.productos,alerta.text1,alerta.nombre,alerta.text2)">
                      <v-icon>mdi-dots-vertical</v-icon> 
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col id="texto-uno">
                    consumo: {{ alerta.consumo }}
                  </v-col>
                  <v-col id="texto-dos">
                    stock: {{ alerta.cantidad }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col id="texto">
                    <v-progress-linear :value=alerta.porcentaje color="blue darken-1"></v-progress-linear>
                  </v-col>
                </v-row>
              </v-alert>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importaciones necesarias
import formulaAsociada from '../components/formulaAsociada.vue';
import firebase from "../utils/firebase.js";
import { auth } from '../utils/firebase';
import { logModify, logProduccion } from '../functions/bitacora.js';
const db = firebase.collection("ProductoTerminado");
const dbMP = firebase.collection("MateriasPrimas");
const dbI = firebase.collection("Insumos");


import * as XLSX from 'xlsx/xlsx.mjs';
export default {
  //VARIABLES ASOCIADAS A LA VISTA
  name: "pruebaCrud",
  components: { formulaAsociada },
  props: {},
  data: () => {
    return {
      traspasoAlerta: [],
      dialogDetailsAlertContent:"",
      search: '',
      search1: '',
      productoPendientes: [],
      alertas: [],
      materiasDeProductosPendientes: [],
      insumosDeProductosPendientes: [],
      dialogDetailsAlert: false,
      // Columnas en la tabla de productos terminados dentro de orden de fabricación
      headers1: [
        {
          text: "SKU",
          align: "start",
          sortable: false,
          value: "sku",
          class: "blue darken-1 white--text"
        },
        { text: "Producto terminado", value: "nombre", class: "blue darken-1 white--text" },
        { text: "Cantidad (Unidades)", value: "cantidad", class: "blue darken-1 white--text" },
        { text: "Seleccionar", value: "estado", class: "blue darken-1 white--text" },
      ],
      DbProductosPendientes: "productosPendientes",
      DbProductosFinalizados: "productosFinalizados",
      DbInsumos: "Insumos",
      DbMateriasPrimas: "MateriasPrimas",
      textDialogSuperaStock: [],
      productosPendientes: [],
      productosFinalizados: [],
      Nombre: "",
      Cantidad: 0,
      contadorSelected: 0,
      sortBy: 'sku',
      sortDesc: false,
      dialog: false,
      dialogDelete: false,
      dialogNoneSelect: false,
      dialogAddProductoPendiente: false,
      dialogSuperaStock: false,
      dialogFormula: false,
      // Columnas en la tabla de productos pendientes
      headersPendientes: [
        { text: "Producto terminado", value: "nombre", class: "blue darken-1 white--text" },
        { text: "SKU", value: "sku", class: "blue darken-1 white--text" },
        { text: "Cantidad (Unidades)", value: "cantidad", class: "blue darken-1 white--text" },
        { text: 'Acción', value: 'actions', sortable: false, class: "blue darken-1 white--text" },
        { text: 'Seleccionar', value: 'estado', sortable: false, class: "blue darken-1 white--text" },
      ],
      // Columnas en la tabla de productos finalizados
      headersFinalizados: [
        { text: "Producto terminado", value: "nombre", class: "blue darken-1 white--text" },
        { text: "SKU", value: "sku", class: "blue darken-1 white--text" },
        { text: "Cantidad (Unidades)", value: "cantidad", class: "blue darken-1 white--text" },
      ],
      editedIndex: -1,
      editedItem: {
        id: '',
        nombre: '',
        cantidad: null,
        sku: '',
        estado: null,
      },
      defaultItem: {
        id: '',
        nombre: '',
        cantidad: null,
        sku: '',
        estado: null,
      },
      itemDetails: {
        ins: null,
        mp: null,
        nombrePT: null,
        skuPT: null,
      },
    };
  },
  computed: {
    formTitle() {
      return 'Modificar cantidad'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    dialogNone(val) {
      val || this.okNoneSelect()
    },
    dialogAddProductoPendiente(val) {
      val || this.okNoneSelect()
    },
    dialogSuperaStock(val) {
      val || this.okSuperaStock()
    },
  },
  created() {
    //se obtienen todos los productos pendientes y finalizados de la base de datos
    this.getAllPP(this.DbProductosPendientes, this.productosPendientes);
    this.getAllPF(this.DbProductosFinalizados, this.productosFinalizados);
  },
  methods: {

    //descripción: se genera información de la alerta
    //entradas:  nombreProduct (todos los productos asociados a la alerta), text1 ("materia" o "insumo"), nombre(nombre de materia o de insumo), text2 (string)
    //salidas: no hay salidas
    infoAlerta(nombresProduct,text1, nombre, text2){
      console.log(this.alertas)
      this.dialogDetailsAlertContent = text1 + nombre + text2;
      this.traspasoAlerta= nombresProduct;
      this.dialogDetailsAlert = true;

    },

    //descripción: se cierra alerta de que se supera stock
    //entradas:  no hay entradas
    //salidas: no hay salidas
    okSuperaStock() {
      this.dialogSuperaStock = false
    },
    
    //descripción: se guarda un insumo de la base de datos en this.insumoAux
    //entradas:  baseDatosName (nombre de base de datos) documentoId (id de insumo a buscar)
    //salidas: no hay salidas
    async getInsumo(baseDatosName, documentoId) {
      try {
        await firebase.collection(baseDatosName).doc(documentoId).get().then((doc) => {
          this.insumoAux = doc.data();
        });
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se realiza el descuento tentativo del stock de materias primas e insumos asociados a productos pendientes
    //entradas:  no hay entradas
    //salidas: no hay salidas
    descuentoTentativo() {
      this.materiasDeProductosPendientes = [];
      this.insumosDeProductosPendientes = [];
      //Por cada producto pendiente
      this.productosPendientes.forEach(producto => {
        //Por cada insumo asociado a pendientes
        producto.InsumosAsociados.forEach(insumo => {
          const index = this.insumosDeProductosPendientes.findIndex(item => { return item.idI == insumo.idI });
          // Si se encuentra el id del insumo asociado
          if (index > -1) {
            const arregloIds = this.insumosDeProductosPendientes[index].idProductos;
            const arregloNombres = this.insumosDeProductosPendientes[index].nombreProductos;
            arregloIds.push(producto.id);
            arregloNombres.push(producto.nombre);
            //Se modifica la cantidad de ese insumo
            Object.assign(this.insumosDeProductosPendientes[index],
              {
                idProductos: arregloIds,
                nombreProductos: arregloNombres,
                consumo: this.insumosDeProductosPendientes[index].consumo + producto.cantidad * insumo.CantidadInsumo,
              })
          // Sino, se guarda directamente 
          } else {
            this.insumosDeProductosPendientes.push({
              idProductos: [producto.id],
              nombreProductos: [producto.nombre],
              nombre: insumo.NombreInsumo,
              idI: insumo.idI,
              consumo: producto.cantidad * insumo.CantidadInsumo,
            })
          }
        })
        //Por cada materia prima asociada a pendientes
        producto.MateriasPrimasAsociadas.forEach(materia => {
          const index = this.materiasDeProductosPendientes.findIndex(item => { return item.idMP == materia.idMP });
          console.log({ index: index, materia: materia.NombreMateriaPrima, id: producto.id })
          // Si se encuentra el id de la materia prima asociada
          if (index > -1) {
            const arregloIds = this.materiasDeProductosPendientes[index].idProductos;
            const arregloNombres = this.materiasDeProductosPendientes[index].nombreProductos;
            arregloIds.push(producto.id);
            arregloNombres.push(producto.nombre);
            //Se modifica la cantidad de esa materia prima
            Object.assign(this.materiasDeProductosPendientes[index],
              {
                idProductos: arregloIds,
                nombreProductos: arregloNombres,
                consumo: this.materiasDeProductosPendientes[index].consumo + producto.cantidad * materia.CantMateriaPrima,
              })
          // Sino, se guarda directamente 
          } else {
            this.materiasDeProductosPendientes.push({
              idProductos: [producto.id],
              nombreProductos: [producto.nombre],
              nombre: materia.NombreMateriaPrima,
              idMP: materia.idMP,
              consumo: producto.cantidad * materia.CantMateriaPrima,
            })
          }
        })
      })
      console.log(this.insumosDeProductosPendientes)
      console.log(this.materiasDeProductosPendientes)
    },


    //descripción: se agregan avisos en el dashboard en casos que se supere el stock
    //entradas: no hay entradas
    //salidas: no hay salidas
    agregarAlertas() {
      this.productosPendientes.forEach(productoID => {
          productoID.bloqueado = false;
      });
      this.alertas = [];
      //se recorre lista de insumos de todos los productos pendientes
      this.insumosDeProductosPendientes.forEach(async insumo => {
        let insumoAux;
        await firebase.collection(this.DbInsumos).doc(insumo.idI).get().then((doc) => {
          insumoAux = doc.data();
          insumoAux.id = doc.id;
        });
        //En caos que el gasto supere el stock
        if ((insumoAux.cantidad - insumo.consumo) < 0) { 
          this.alertas.push({
            nombre: insumoAux.nombre,
            text1: " Se superó el stock del insumo ",
            text2: "",
            type: "error",
            id: insumoAux.id,
            cantidad: insumoAux.cantidad,
            consumo: insumo.consumo,
            productos: insumo.nombreProductos,
            porcentaje: 100,
          })
          insumo.idProductos.forEach(productoId => {
            const index = this.productosPendientes.findIndex(item => { return item.id == productoId });
            Object.assign(this.productosPendientes[index],
              {
                bloqueado: true,
              })
          })
        //En caso que el gasto de los productos supere el stock de los productos
        } else if ((insumoAux.cantidad - insumo.consumo) == 0) {
          this.alertas.push({
            nombre: insumoAux.nombre,
            text1: " El stock del insumo ",
            text2: " esta en 0",
            type: "warning",
            id: insumoAux.id,
            cantidad: insumoAux.cantidad,
            consumo: insumo.consumo,
            productos: insumo.nombreProductos,
            porcentaje: 100,
          })
        }
        //Se supera el limite
        else if ((insumoAux.cantidad - insumo.consumo) <= insumoAux.limite) {
          this.alertas.push({
            nombre: insumoAux.nombre,
            text1: " La cantidad del insumo ",
            text2: " es muy baja",
            type: "warning",
            id: insumoAux.id,
            cantidad: insumoAux.cantidad,
            consumo: insumo.consumo,
            productos: insumo.nombreProductos,
            porcentaje: (insumo.consumo % insumoAux.limite/insumoAux.limite)*100,
          })
        }
      })
      //se recorre lista de materias primas de todos los productos pendientes
      this.materiasDeProductosPendientes.forEach(async materia => {
        let materiaAux;
        await firebase.collection(this.DbMateriasPrimas).doc(materia.idMP).get().then((doc) => {
          materiaAux = doc.data();
          materiaAux.id = doc.id;
        });
        //El gasto del material supera el stock
        if ((materiaAux.cantidad - materia.consumo) < 0) {
          this.alertas.push({
            nombre: materiaAux.nombre,
            text1: " Se superó el stock de la materia prima ",
            text2: "",
            type: "error",
            id: materiaAux.id,
            cantidad: materiaAux.cantidad,
            consumo: materia.consumo,
            productos: materia.nombreProductos,
            porcentaje: 100,
          })
          materia.idProductos.forEach(productoId => {
            const index = this.productosPendientes.findIndex(item => { return item.id == productoId });
            Object.assign(this.productosPendientes[index],
              {
                bloqueado: true,
              })
          })
          //El gasto supera el stock
        } else if ((materiaAux.cantidad - materia.consumo) == 0) { 
          this.alertas.push({
            nombre: materiaAux.nombre,
            text1: " El stock de la materia prima ",
            text2: " esta en 0",
            type: "warning",
            id: materiaAux.id,
            cantidad: materiaAux.cantidad,
            consumo: materia.consumo,
            productos: materia.nombreProductos,
            porcentaje: 100,
          })
        }
        //El gasto supera el limite
        else if ((materiaAux.cantidad - materia.consumo) <= materiaAux.limite) {
          this.alertas.push({
            nombre: materiaAux.nombre,
            text1: " La cantidad de materia prima ",
            text2: " es muy baja",
            type: "warning",
            id: materiaAux.id,
            cantidad: materiaAux.cantidad,
            consumo: materia.consumo,
            productos: materia.nombreProductos,
            porcentaje: (materia.consumo % materiaAux.limite/materiaAux.limite)*100,
          })
        }
      })
      console.log(this.productosPendientes);
    },

    //descripción: se obtienen los productos pendientes, se realizan descuentos tentativos y se agregan alertas
    //entradas: baseDatosName (el nombre de la base de datos), elementos (en donde guardar productos pendientes)
    //salidas: no hay salidas
    async getAllPP(baseDatosName, elementos) {
      try {
        const snapshot = await firebase.collection(baseDatosName).get();
        snapshot.forEach(doc => {
          let elementoData = doc.data();
          elementoData.id = doc.id;
          elementos.push(elementoData);
        })
        this.descuentoTentativo();
        this.agregarAlertas();
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se obtienen los productos finalizados de la base de datos
    //entradas:  baseDatosName (el nombre de la base de datos), elementos (en donde guardar productos finalizados)
    //salidas: no hay salidas
    async getAllPF(baseDatosName, elementos) {

      try {
        const snapshot = await firebase.collection(baseDatosName).get();
        snapshot.forEach(doc => {
          let elementoData = doc.data();
          elementoData.id = doc.id;
          elementos.push(elementoData);
        })
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: Se obtienen todos los productos terminados de la base de datos y se guardan en this.productoPendientes
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getProductoTerminados() {
      try {
        const snapshot = await db.get();
        const productoPendientes = [];
        snapshot.forEach(doc => {
          let productoPendienteData = doc.data();
          // A cada producto guardado se guarda una cantidad 0, su id, su estado, y si está bloqueado
          productoPendienteData.cantidad = 0;
          productoPendienteData.idPT = doc.id;
          productoPendienteData.estado = false;
          productoPendienteData.bloqueado = false;
          productoPendientes.push(productoPendienteData);
        })
        this.productoPendientes = productoPendientes;
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se actualiza un documento de una base de datos
    //entradas:  baseDatosName (el nombre de la base de datos), documento (que hay que editar)
    //salidas: no hay salidas
    async updateProductoPendiente(baseDatosName, documento) {
      try {
        console.log(documento.id)
        console.log(documento.cantidad)
        await firebase.collection(baseDatosName).doc(documento.id).update({
          cantidad: documento.cantidad,
        })
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se elimina un documento de una base de datos
    //entradas:  baseDatosName (el nombre de la base de datos), documento (que hay que eliminar)
    //salidas: no hay salidas
    async deleteProductoPendiente(baseDatosName, documento) {
      try {
        await firebase.collection(baseDatosName).doc(documento.id).delete();
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se guardan valores de producto a editar y se abre ventana de edicióm 
    //entradas:  un item (producto)
    //salidas: no hay salidas    
    editItem(item) {
      this.editedIndex = this.productosPendientes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    //descripción: se guardan valores de producto a eliminar y se abre ventana de eliminación 
    //entradas:  un item (producto)
    //salidas: no hay salidas
    deleteItem(item) {
      this.editedIndex = this.productosPendientes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    //descripción: se elimina producto de base de datos y de tabla asociada, y se recalculan alertas 
    //entradas:  no hay entradas
    //salidas: no hay salidas
    deleteItemConfirm() {
      // Se elimina de la base de datos
      this.deleteProductoPendiente(this.DbProductosPendientes, this.editedItem)

      if ( this.productosPendientes[this.editedIndex].estado){
        this.contadorSelected = this.contadorSelected-1;
      }
      // Se elimina de tabla
      this.productosPendientes.splice(this.editedIndex, 1)
      // Se agregan alertas actualizadas
      this.descuentoTentativo();
      this.agregarAlertas();
      // Se cierra ventana de eliminación
      this.closeDelete()
    },
    //descripción: funcion muestra la formula de un producto en la lista de pendientes
    //entradas:  producto(item)
    //salidas: no hay salidas
    async mostrarFormula(item) {
      this.dialogFormula = true;
      this.itemDetails.nombrePT = item.nombre;
      this.itemDetails.skuPT = item.sku;
      this.itemDetails.mp = [];
      this.itemDetails.ins = [];
      item.MateriasPrimasAsociadas.forEach(async elemento => {
        let query1 = await dbMP.doc(elemento.idMP).get();
        let mAsociada = {
          NombreMateriaPrima: query1.data().nombre,
          codigoMP: query1.data().codigo,
          CantMateriaPrima: elemento.CantMateriaPrima,
        }
        this.itemDetails.mp.push(mAsociada)
      });
      item.InsumosAsociados.forEach(async elemento => {
        let query2 = await dbI.doc(elemento.idI).get();
        let iAsociada = {
          NombreInsumo: query2.data().nombre,
          codigoI: query2.data().codigo,
          CantidadInsumo: elemento.CantidadInsumo,
        }
        this.itemDetails.ins.push(iAsociada)
      });
    },
    //descripción: funcion que cierra el dialogo de editar un producto
    //entradas:  no hay entrada
    //salidas: no hay salidas
    close() {

      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    //descripción: se cierra ventana de eliminación de producto 
    //entradas:  no hay entradas
    //salidas: no hay salidas
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    //descripción: funcion guarda una modifacion de la cantidad de un producto en la lista de productos pendientes
    //entradas:  no hay entrada
    //salidas: no hay salidas
    save() {
      if (this.editedItem.cantidad == "")
      this.editedItem.cantidad = 1;
      if (this.editedIndex > -1) {
        this.updateProductoPendiente(this.DbProductosPendientes, this.editedItem)
        Object.assign(this.productosPendientes[this.editedIndex], this.editedItem)
      } else {
        this.productosPendientes.push(this.editedItem)
      }
      this.descuentoTentativo();
      this.agregarAlertas();
      this.close()
    },

    //descripción: se muestra el item recibido 
    //entradas:  un item (producto)
    //salidas: no hay salidas
    seleccionarItem(item) {
      //this.productosPendientes.indexOf(item)
      console.log(item)
    },

    //descripción: funcion que setea que si en producto se supera el stock, se debe mostrar el diálogo asociado
    //entradas:  no hay entrada
    //salidas: no hay salidas
    superaStockFuncion() {
      this.textDialogSuperaStock = [];
      this.productosPendientes.forEach(producto => {
        if (producto.estado && producto.bloqueado) {
          this.dialogSuperaStock = true;
          this.textDialogSuperaStock.push(producto);
        }
      })
    },
    //descripción: funcion que envia productos pendientes que han sido seleccionados a finalizados
    //entradas:  no hay entrada
    //salidas: no hay salidas
    enviarAFinalizados() {
      this.superaStockFuncion() // dialoga que un producto supera el stock
      if (this.contadorSelected == 0) { // dia
        this.dialogNoneSelect = true;
      }
      else {
        this.productosPendientes.forEach(
          async (producto) => {
            if (producto.estado && !producto.bloqueado) { // si el producto esta seleccionado y no esta bloqueado
              try {
                // se borra el producto de la tabla de productos pendientes
                await firebase.collection(this.DbProductosPendientes).doc(producto.id).delete();
                //se registra la produccion de un producto
                logProduccion("productoTerminado", auth.currentUser.email,producto.id, {
                  nombre: producto.nombre,
                  sku: producto.sku,
                  cantidad: producto.cantidad,
                }, "fabricacion de producto")
                this.contadorSelected=this.contadorSelected-1;

                // si el producto no se encuentra en la lista de finalizados se agrega directamente
                if(!this.productosFinalizados.some(e => e.idPT === producto.idPT)){
                  await firebase.collection(this.DbProductosFinalizados).add(producto);
                  this.productosFinalizados.push(producto);
                }

                // si el producto se encuentra en lista de finalizados se modifica su cantidad
                else{
                  let idListaFinalizados;
                  let query = await firebase.collection(this.DbProductosFinalizados)
                                .where("nombre", "==", producto.nombre)
                                .get();

                  query.forEach(doc => {
                      idListaFinalizados = doc.id;
                      })
                  let nuevaCantidad = this.productosFinalizados.find(e => e.idPT === producto.idPT).cantidad + producto.cantidad;
                  await firebase.collection(this.DbProductosFinalizados).doc(idListaFinalizados).update({
                  cantidad: nuevaCantidad,
                })
                let indexTablaPF = this.productosFinalizados.findIndex(obj => obj.nombre == producto.nombre);
                this.productosFinalizados[indexTablaPF].cantidad = nuevaCantidad; 
                }
                
                this.editedIndex = this.productosPendientes.indexOf(producto)
                this.productosPendientes.splice(this.editedIndex, 1)
                this.descuentoDefinitivo(producto);
                this.$nextTick(() => {
                  this.editedItem = Object.assign({}, this.defaultItem)
                  this.editedIndex = -1
                })
              } catch (error) {
                console.log(error);
              }
            }
          }
        );
        this.descuentoTentativo();
        this.agregarAlertas();
      }
    },
    //descripción: funcion que realiza el descuento en la base de datos de las materias e insumos de un producto fabricado
    //entradas: producto con materias primas e insumos (producto)
    //salidas: no hay salidas
    descuentoDefinitivo(producto) {
      // se recorre los insumos asociados y se actualiza su cantidad en la base de datos 
      producto.InsumosAsociados.forEach(async insumo => {
        let insumoAux;
        await firebase.collection(this.DbInsumos).doc(insumo.idI).get().then((doc) => {
          insumoAux = doc.data();
          insumoAux.id = doc.id;
        });
        await firebase.collection(this.DbInsumos).doc(insumo.idI).update({
          cantidad: insumoAux.cantidad - producto.cantidad * insumo.CantidadInsumo,
        })
        //se regista el consumo realizado del insumo
        logModify("insumo", auth.currentUser.email,insumo.idI, {
          nombre: insumoAux.nombre,
          codigo: insumoAux.codigo,
          cantidad: insumoAux.cantidad,
          limite: insumoAux.limite
        }, {
          nombre: insumoAux.nombre,
          codigo: insumoAux.codigo,
          cantidad: insumoAux.cantidad - producto.cantidad * insumo.CantidadInsumo,
          limite: insumoAux.limite
        }, "Producción de: " + producto.nombre + " sku: " + producto.sku);

      })
      // se recorre las materias primas asociadas y se actualiza su cantidad en la base de datos 
      producto.MateriasPrimasAsociadas.forEach(async materia => {
        let materiaAux;
        await firebase.collection(this.DbMateriasPrimas).doc(materia.idMP).get().then((doc) => {
          materiaAux = doc.data();
          materiaAux.id = doc.id;
        });
        await firebase.collection(this.DbMateriasPrimas).doc(materia.idMP).update({
          cantidad: materiaAux.cantidad - producto.cantidad * materia.CantMateriaPrima,
        })
        //se regista el consumo realizado de la materia prima
        logModify("materiaPrima", auth.currentUser.email,materia.idMP, {
          nombre: materiaAux.nombre,
          codigo: materiaAux.codigo,
          cantidad: materiaAux.cantidad,
          limite: materiaAux.limite
        }, {
          nombre: materiaAux.nombre,
          codigo: materiaAux.codigo,
          cantidad: materiaAux.cantidad - producto.cantidad * materia.CantMateriaPrima,
          limite: materiaAux.limite
        }, "Producción de: " + producto.nombre + " sku: " + producto.sku);

      })
    },
    //descripción: Si no hay nada seleccionada se cierra dialogo
    //entradas: No hay entradas
    //salidas: no hay salidas
    okNoneSelect() {
      console.log("aprete una vez el check")
      this.dialogNoneSelect = false
    },
    //descripción: Se cierra dialogo de la formula
    //entradas: No hay entradas
    //salidas: no hay salidas
    okDialogFormula() {
      this.dialogFormula = false
    },
    //descripción: Se cuentan los productos seleccionados
    //entradas: Estado de producto de seleccionable (true o false)
    //salidas: no hay salidas
    contarSeleccionados(estado) {
      if (estado) {
        this.contadorSelected = this.contadorSelected - 1;
      } else {
        this.contadorSelected = this.contadorSelected + 1;
      }
    },
    //descripción: Se obtienen los productos de la base de datos y abre el dialogo
    //entradas: No hay entradas
    //salidas: no hay salidas
    abrirVentanaAddProductoPendiente() {
      this.getProductoTerminados()
      this.dialogAddProductoPendiente = true;
    },
    //descripción: Se activa casilla de cantidad 
    //entradas: No hay entradas
    //salidas: no hay salidas
    activarSeleccionar(){
      this.productoPendientes.forEach(
        (producto) => {
          if (producto.estado == true && producto.cantidad ==0) {
              console.log("se activa")
              producto.cantidad =1;
          }

        }
      );
    },
    //descripción: Se agrega productos a la orden de pedidos
    //entradas: No hay entradas
    //salidas: no hay salidas
    async cerrarVentanaAddProductoPendiente() {
      this.productoPendientes.forEach(
        async (producto) => {
          if (producto.estado && producto.cantidad > 0 ) {
            try {
              producto.estado = false;
              if(!this.productosPendientes.some(e => e.idPT === producto.idPT))
                await firebase.collection(this.DbProductosPendientes).add(producto)
              else{
                let idListaPendientes = this.productosPendientes.find(e => e.idPT === producto.idPT).id;
                let nuevaCantidad = this.productosPendientes.find(e => e.idPT === producto.idPT).cantidad + producto.cantidad;
                await firebase.collection(this.DbProductosPendientes).doc(idListaPendientes).update({
                cantidad: nuevaCantidad,
               })
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      );
      this.productosPendientes = [];
      this.getAllPP(this.DbProductosPendientes, this.productosPendientes);
      this.dialogAddProductoPendiente = false;
    },
    //descripción: se eliminan los datos de la coleccion productos finalizados
    //entradas: No hay entradas
    //salidas: no hay salidas
    async deleteCollectionFinalizados() {
      // Get a new write batch
      try {
        const snapshot = await firebase.collection(this.DbProductosFinalizados).get()
        snapshot.forEach(elemento => {
          firebase.collection(this.DbProductosFinalizados).doc(elemento.id).delete()
        })
        this.productosFinalizados = []
      } catch (error) {
        console.log(error);
      }
    },
    //descripción: Se cargan los datos en la tabla
    //entradas: No hay entradas
    //salidas: no hay salidas
    upload() {
      let files = document.getElementById('file_upload').files;
      if (files.length == 0) {
        alert("Please choose any file...");
        return;
      }
      let filename = files[0].name;
      let extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
      if (extension == '.XLS' || extension == '.XLSX') {
        //this.activarCarga()
        this.excelFileToJSON(files[0]);
        this.sortBy = "estado";
        this.sortDesc = true;
        //this.desactivarCarga()
        console.log('sali de cargar')
      } else {
        alert("Please select a valid excel file.");
      }
    },
    //descripción: Función encapsulada por upload para cargar los datos de un excel en una tabla
    //entradas: El archivo que será leido
    //salidas: no hay salidas
    excelFileToJSON(file) {
      try {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        let self = this;
        reader.onload = function (e) {

          let data = e.target.result;
          let workbook = XLSX.read(data, {
            type: 'binary'
          });
          self.productosNoAgregados = '';
          workbook.SheetNames.forEach(function (sheetName) {
            let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            roa.forEach(element => {
              const index = self.productoPendientes.findIndex(item => { return item.sku == element.SKU });
              if (index != -1) {
                //console.log(element)
                self.productoPendientes[index].cantidad = self.productoPendientes[index].cantidad + element.CANTIDAD
                self.productoPendientes[index].estado = true
              } else {
                self.productosNoAgregados = self.productosNoAgregados + '[' + element.NOMBRE + ' ' + element.SKU + '] en [' + sheetName + '] no fue agregado.\n'
              }
            })

          });
          if (self.productosNoAgregados != '') {
            alert(self.productosNoAgregados)
          }
        }
      } catch (e) {
        console.error(e);
      }

    },
  }
}
</script>


<style scoped>
.pagina-principal-container {
  width: 100%;
  display: flex;
  overflow: auto;
  min-height: 100vh;
  align-items: flex-start;
  flex-direction: row;
  justify-content: flex-start;
}

.pagina-principal-container1 {
  width: 100%;
  height: var(--dl-size-size-maxwidth);
  display: flex;
  position: relative;
  align-self: stretch;
  align-items: stretch;
  padding-top: 0px;
  flex-direction: row;
  padding-bottom: 0px;
  justify-content: space-between;
}

.pagina-principal-container2 {
  flex: 1;
  display: flex;
  align-self: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: 30px;
  justify-content: flex-start;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 30px;
}

.pagina-principal-container5 {
  width: 427px;
  height: auto;
  display: flex;
  align-self: stretch;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #E0F1FD;
}

.pagina-principal-container6 {
  width: 421px;
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 0px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: column;
  justify-content: flex-start;
}

.pagina-principal-text06 {
  color: rgb(0, 111, 255);
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
}

.agregar-producto-pendiente-container4 {
  padding-left: 60px;
  padding-right: 60px;
}

.agregar-producto-pendiente-text {
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
}

.agregar-producto-pendiente-container2 {
  display: flex;
  align-items: center;
  padding-top: 40px;
  flex-direction: column;
  padding-bottom: 40px;
  justify-content: flex-start;
}

.agregar-producto-pendiente-container3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 30px;
  justify-content: center;
}

.agregar-producto-pendiente-container5 {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 400px;
}

.alertas {
  display: flex;
  width: 100%;
  justify-content: flex-start;

}

.dialog-container1 {
  padding: 30px;
  text-align: center;
  flex-direction: column;
  align-items: center;
}

#texto-uno {
  float: left;
  line-height: 25px;
  color: rgb(0, 0, 0);
}

#texto-dos {
  float: right;
  line-height: 25px;
  color: rgb(0, 0, 0);
}

#texto {
  color: rgb(0, 0, 0);
}

.container-volver{
  padding-left: 10px;
  padding-right: 30px;
  padding-bottom: 40px;

}


</style>
