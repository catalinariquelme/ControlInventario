<template>
  <div class="agregar-producto-pendiente-container">
    <div class="agregar-producto-pendiente-container1">
      <!--TABLA QUE LISTA TODAS LAS MATERIAS PRIMAS-->
      <v-data-table :headers="headers" :items="materiasPrimas" :search="search" sort-by="cantidad"
        class="elevation-1 blue lighten-5">
        <template v-slot:top>
          <v-toolbar flat>
            <span class="paginaprincipal-text"><span>Materias primas</span></span>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!--BOTÓN PARA CREAR MATERIA PRIMA NUEVA-->
            <v-btn color="primary" dark class="mr-4" @click="dialog = true; nombre= ''; editedItem.cantidad=null; limite=null">
              Crear materia prima
            </v-btn>
            <!--VENTANA PARA LLENAR DATOS DE NUEVA MATERIA-->
            <v-dialog v-if="dialog" v-model="dialog" max-width="800px">
              <v-card>
                <div class="dialog-container1">
                  <v-card-title>
                    <span class="text-h5"> <strong>Crear nueva materia prima</strong></span>
                  </v-card-title>
                  <v-container>
                    <v-form @submit.prevent="addMateria">
                      <!--NOMBRE-->
                      <v-text-field type="text" v-model="nombre" label="Nombre materia prima">
                      </v-text-field>
                      <!--CÓDIGO-->
                      <v-text-field type="text" v-model="codigo" label="Nombre código">
                      </v-text-field>
                      <!--CANTIDAD-->
                      <v-text-field type="number" min="0" oninput="validity.valid||(value='');" v-model.number="editedItem.cantidad" label="Cantidad (mL)">
                      </v-text-field>
                      <!--LÍMITE-->
                      <v-text-field type="number" min="0" oninput="validity.valid||(value='');" v-model.number="limite" label="Limite (mL)">
                      </v-text-field>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <!--SE DA LA OPCIÓN DE CONTINUAR LA OPERACIÓN O VOLVER-->
                        <v-btn  type="submit" color="primary" class="mr-2" @click.stop>
                        Agregar materia prima
                      </v-btn>
                      <v-btn  color="primary" class="mr-2" @click="dialog=false">
                          Volver
                        </v-btn>
                    </v-card-actions>
                    </v-form>
                  </v-container>
                </div>
              </v-card>
            </v-dialog>
            <!--ALERTA DE QUE NO ES POSIBLE ELIMINAR LA MATERIA, AL EXISTIR PRODUCTOS ASOCIADOS QUE LO UTILIZAN-->
            <v-dialog v-if="productosUtilizan" v-model="productosUtilizan" max-width="850px">
              <v-card>
                <div class="dialog-container10">
                  <div class="dialog-container11">
                    <v-card-title>
                      <span class="titulo">Lo sentimos, no es posible borrar la materia prima</span>
                    </v-card-title>
                  </div>
                  <v-container>
                    <!--TABLA QUE LISTA TODOS LOS PRODUCTOS ASOCIADOS-->
                    <v-data-table :headers="headersP" :items="pr" :items-per-page="5" :search="searchP" :page="pageNum"
                      class="elevation-1 blue lighten-5">
                      <template v-slot:top>
                        <v-toolbar flat>
                          <span class="text-h7"><span>Los siguientes productos están asociados a la materia prima:
                              {{ itemMPNombre }}</span></span>
                          <v-divider class="mx-4" inset vertical></v-divider>
                        </v-toolbar>
                        <!--BUSCADOR EN TABLA-->
                        <v-toolbar flat>
                          <v-text-field v-model="searchP" append-icon="mdi-magnify" label="Buscar Producto" single-line
                            hide-details></v-text-field>
                        </v-toolbar>
                      </template>
                    </v-data-table>
                  </v-container>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                      <v-btn  color="primary" large class="mr-2" @click.stop="productosUtilizan=false">Volver
                      </v-btn>
                  </v-card-actions>
                </div>
              </v-card>
            </v-dialog>

            <!-- VENTANA PARA EDITAR MATERIA PRIMA-->
            <v-dialog v-model="dialogUpdate" max-width="600px" @click:outside="closeJustificationEdit">
              <v-card>
                <v-container>
                  <v-card-title>
                    <span class="text-h5"><strong>Editar {{nombre}}</strong></span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <!--EDITAR NOMBRE-->
                      <v-row>
                        <v-col>
                          <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                        </v-col>
                      </v-row>
                      <!--EDITAR CÓDIGO-->
                      <v-row>
                        <v-col>
                          <v-text-field v-model="editedItem.codigo" label="Código"></v-text-field>
                        </v-col>
                      </v-row>
                      <!--EDITAR CANTIDAD-->
                      <v-row>
                        <v-col>
                          <v-text-field type="number" min="0" oninput="validity.valid||(value='');" v-model.number="editedItem.cantidad" label="Cantidad (mL)"></v-text-field>
                        </v-col>
                      <!--EDITAR LÍMITE-->
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field type="number" min="0" oninput="validity.valid||(value='');" v-model.number="editedItem.limite" label="Límite (mL)"></v-text-field>
                        </v-col>
                      </v-row>
                      <!--MOTIVO DE LA EDICIÓN-->
                      <v-row>
                        <v-col>
                                <v-combobox v-model="justificationEdit" :items="itemsEdit" label="Motivo de la modificación" color="blue darken-1"></v-combobox>
                            <v-container>
                              <v-form v-if="justificationEdit=='Otro'">
                                <v-text-field 
                                    v-model="justificationTextEdit"
                                    label="Escriba la razón de esta modificación">
                                </v-text-field>
                              </v-form>
                          </v-container>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!--SE ENTREGA LA OPCIÓN DE GUARDAR LA EDICIÓN O CANCELAR LA OPERACIÓN-->
                    <v-btn color="primary" class="mr-2" @click="save">
                      Guardar
                    </v-btn>
                    <v-btn color="primary" class="mr-2" @click="closeJustificationEdit">
                      Cancelar
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card>
            </v-dialog>
            <!--VENTANA PARA ELIMINAR UNA MATERIA-->
            <v-dialog v-model="dialogDelete" max-width="690px" @click:outside="closeJustification">
              <v-card>
                <div class="dialog-container1">
                  <v-card-title class="text-h5">¿Estas seguro que deseas eliminar esta materia prima?</v-card-title>
                      <v-card-actions>
                            <v-combobox v-model="justification" :items="items" label="Seleccione una opción" color="blue darken-1"></v-combobox>
                      </v-card-actions>
                      <v-container>
                      <v-form v-if="justification=='Otro'">
                        <v-text-field 
                        v-model="justificationText"
                          label="Escriba la razón de esta eliminación">
                        </v-text-field>
                      </v-form>
                    </v-container>
                    <v-card-actions>
                      <!--SE DA LA OPCIÓN DE ELIMINAR Y DE CANCELAR-->
                      <v-spacer></v-spacer>
                      <v-btn v-if="justification" color="primary" class="mr-2"  @click="deleteMateria">Eliminar</v-btn>
                      <v-btn color="primary" class="mr-2" @click.stop="closeJustification">Cancelar</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                </div>
              </v-card>
            </v-dialog>
            <!--VENTANA QUE AVISA QUE NO SE PUEDE ELIMINAR LA MATERIA, YA QUE DEBE HABER UNA JUSTIFICACIÓN ASOCIADA-->
            <v-dialog v-model="dialogNoDelete" max-width="690px" @click:outside="aceptarNoDelete">
              <v-card>
                <v-card-title class="popUp yellow darken-2 white--text">
                  <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                   <span class="text-h5">Acción Denegada</span>
                 </v-card-title>
                <v-container class="text-center">
                <span class="text-h5 " ><strong>Debe escribir la razón de eliminación de la Materia prima</strong></span>
              </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn color="primary" class="mr-2"  @click="aceptarNoDelete">Aceptar</v-btn>
                    <v-spacer></v-spacer>
                  
                  </v-card-actions>
              </v-card> 
            </v-dialog>
            <!--VENTANA QUE AVISA QUE NO SE PUEDE EDITAR LA MATERIA, YA QUE DEBE HABER UNA JUSTIFICACIÓN ASOCIADA-->            
            <v-dialog v-model="dialogNoEdit" max-width="690px" @click:outside="aceptarNoEdit">
              <v-card>
                <v-card-title class="popUp yellow darken-2 white--text">
                  <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                   <span class="text-h5">Acción Denegada</span>
                 </v-card-title>
                <v-container class="text-center">
                <span class="text-h5 " ><strong>Debe escribir la razón de modificación de la materia Prima!</strong></span>
              </v-container>
                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn color="primary" class="mr-2"  @click="aceptarNoEdit">Aceptar</v-btn>
                    <v-spacer></v-spacer>
                  
                  </v-card-actions>
              </v-card>
            <!--SE MUESTRA EN PANTALLA QUE CONTENIDO ESTÁ CARGANDO-->
            </v-dialog>
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
          <!--BUSCADOR EN TABLA DE MATERIAS PRIMAS-->
          </v-toolbar>
          <v-toolbar flat>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar en materias primas" single-line
              hide-details>
            </v-text-field>
          </v-toolbar>
        </template>
        <!--BOTONES PARA EDITAR Y ELIMINAR-->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editMateria(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="delete1Materia(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      <div class="agregar-producto-terminado-container5">
                  <!--ALERTA SI ES QUE CAMPO NOMBRE ESTÁ VACÍO-->
                  <v-dialog v-model="dialogUpdate3" max-width="600px">
                    <v-card>
                      <v-card-title class="popUp yellow darken-2 white--text">
                        <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                        <span class="text-h5">Ingresar Nombre</span>
                      </v-card-title>
                      <v-card-text class="notificacion text-h6">
                        Por favor, ingrese un nombre a la materia prima.
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <!--ALERTA SI ES QUE CAMPO CÓDIGO ESTÁ VACÍO-->
                  <v-dialog v-model="dialogUpdate4" max-width="600px">
                    <v-card>
                      <v-card-title class="popUp yellow darken-2 white--text">
                        <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                        <span class="text-h5">Ingresar Código</span>
                      </v-card-title>
                      <v-card-text class="notificacion text-h6">
                        Por favor, ingrese el código asociado.
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <!--ALERTA SI ES QUE CAMPO CANTIDAD ESTÁ VACÍO-->
                  <v-dialog v-model="dialogUpdate5" max-width="600px">
                    <v-card>
                      <v-card-title class="popUp yellow darken-2 white--text">
                        <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                        <span class="text-h5">Ingresar Cantidad</span>
                      </v-card-title>
                      <v-card-text class="notificacion text-h6">
                        Por favor, ingrese una cantidad de materia prima.
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <!--ALERTA SI ES QUE CAMPO LÍMITE ESTÁ VACÍO-->
                  <v-dialog v-model="dialogUpdate6" max-width="600px">
                    <v-card>
                      <v-card-title class="popUp yellow darken-2 white--text">
                        <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                        <span class="text-h5">Ingresar Límite</span>
                      </v-card-title>
                      <v-card-text class="notificacion text-h6">
                        Por favor, ingrese un límite.
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <!--ALERTA SI ES QUE NOMBRE ESTÁ OCUPADO-->
                  <v-dialog v-model="dialogUpdate7" max-width="600px">
                    <v-card>
                      <v-card-title class="popUp yellow darken-2 white--text">
                        <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
                        <span class="text-h5">Cambio de nombre</span>
                      </v-card-title>
                      <v-card-text class="notificacion text-h6">
                        El nombre ingresado ya está siendo utilizado por otra materia prima, por favor ingrese uno distinto.
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </div>
    </div>
    <div class="producto-container3"></div>
  </div>
</template>

<script>
//SE REALIZAN IMPORTACIONES NECESARIAS
import firebase from "../utils/firebase.js";
import { auth } from '../utils/firebase';
import {logNew,logDelete,logModify} from '../functions/bitacora.js';
const db = firebase.collection("MateriasPrimas");
const dbP = firebase.collection("ProductoTerminado");
export default {
  props: {},
  //VARIABLES ASOCIADAS A LA VISTA
  data: () => ({
    idN: null,
    justificationEdit: null,
    justificationTextEdit: null,
    itemsEdit: [
      'Ingreso de materia prima',
      'Salida de materia prima',
      'Cambio de limite',
      'Cambio de nombre',
      'Cambio de código',
      'Otro',
    ],
    dialogNoDelete:false,
    errors:[],
    pageNum: 1,
    search: '',
    searchP: '',
    dialog: false,
    dialogUpdate: false,
    dialogDelete: false,
    // Columnas en la tabla de materias primas
    headers: [
      { text: 'Materia Prima', align: 'start', value: 'nombre', class: "blue darken-1 white--text" },
      { text: 'Código', value: 'codigo', class: "blue darken-1 white--text" },
      { text: 'Cantidad (mL)', value: 'cantidad', class: "blue darken-1 white--text" },
      { text: 'Limite (mL)', value: 'limite', class: "blue darken-1 white--text" },
      { text: 'Acción', value: 'actions', sortable: false, class: "blue darken-1 white--text" },
    ],
    dialogJustificacion: false,
    dialogUpdate3: false,
    dialogUpdate4: false,
    dialogUpdate5: false,
    dialogUpdate6: false,
    dialogUpdate7: false,
    productosUtilizan: false,
    materiasPrimas: [],
    itemMPNombre: null,
    pr: [],
    justification: null,
    justificationText: null,
    loading: false,
    items: [
      'Materia descontinuada',
      'Otro',
    ],
    
    nombre: '',
    cantidad: null,
    codigo: '',
    dialogNoEdit: false,
    materiaPrima: {},
    validar: false,
    validar2: false,
    idTabla: null,
    limite: null,
    editedItem: {
      nombre: '',
      codigo: '',
      limite: null,
      cantidad: null
    },
    // Columnas en la tabla de productos terminados asociados
    headersP: [
      {
        text: "SKU",
        align: "start",
        value: 'sku',
        class: "blue darken-1 white--text"
      },
      { text: 'Producto', value: 'nombre', class: "blue darken-1 white--text" },
    ],
    editedIndex: -1,
    defaultItem: {
      nombre: '',
      codigo: '',
      limite: null,
      cantidad: null,
    },
  }),

  mounted() {
    // CADA VEZ QUE SE INICIALIZA LA VISTA SE OBTIENEN TODAS LAS MATERIAS PRIMAS
    this.getMaterias();
  },
  methods: {
    //descripción: se revisa que exista justificación de operaciones
    //entradas: string (justificacion) y boleano (justificacionText)
    //salidas: true si existe justificación, string vacío si es que no
    checkForm(justificacion, justificacionText){
      let errors = [];
      if (justificacionText>0) {
        return true;
      }
      
      if(justificacion=='Otro'){
          if (!justificacionText) {
            console.log("se logro")
            errors.push('La justificación es obligatoria.');
            console.log(errors)
          }
      }
      return errors;
    },
    //descripción: se cierra alerta al eliminar sin justificación
    //entradas: no hay entradas
    //salidas: no hay salidas
    aceptarNoDelete(){
      this.dialogNoDelete=false;
    },
    //descripción: se cierra alerta al editar sin justificación
    //entradas: no hay entradas
    //salidas: no hay salidas
    aceptarNoEdit(){
      this.dialogNoEdit=false
    },
    //descripción: se cierra ventana editar y se reinician valores de justificación
    //entradas: no hay entradas
    //salidas: no hay salidas
    closeJustificationEdit(){
      this.dialogUpdate=false;
      this.justificationEdit=null;
      this.justificationTextEdit=null;
    },

    //descripción: se actualiza materia prima en base de datos y se vuelve a cargar la tabla de materias
    //entradas: no hay entradas
    //salidas: no hay salidas
    async updateMateria() {
      try {

        await db.doc(this.materiaPrima.id).update({
          nombre: this.nombre,
          codigo: this.codigo,
          cantidad: this.cantidad,
          limite: this.limite
        })
        
        this.getMaterias();
        this.nombre = '';
        this.codigo = '';
        this.cantidad = null;
        this.limite = null;
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se abre ventana de edición y se guardan datos de materia a editar
    //entradas: materia que se desea editar
    //salidas: no hay salidas
    editMateria(item) {
      this.nombre = item.nombre;
      this.editedIndex = this.materiasPrimas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogUpdate = true;
    },

    //descripción: se cierra ventana eliminar producto y se reinician valores de justificación
    //entradas: no hay entradas
    //salidas: no hay salidas
    closeJustification(){
      this.dialogDelete=false;
      this.justification=null;
      this.justificationText=null;
    },

    //descripción: se revisa si materia es utilizada por algún producto, sino se guardan datos de la materia y se abre ventana de eliminación
    //entradas: materia a eliminar
    //salidas: no hay salidas
    async delete1Materia(item) {
      this.idN = item.id;
      this.itemMPNombre = item.nombre;
      let query = await dbP
        .where("indiceMP", "array-contains", item.id)
        .get();
      if (query.size != 0) {
        this.pr = [];
        query.forEach(doc => {
          this.pr.push(doc.data());
        })

        this.productosUtilizan = true;
      }
      else {
        this.idTabla = this.materiasPrimas.indexOf(item);
        this.dialogDelete = true;
      }
    },

    //descripción: se elimina materia, se guarda su justificación y se elimina la materia de la tabla
    //entradas: no hay entradas
    //salidas: no hay salidas
    async deleteMateria() {
      try {
        this.loading = true;
        this.errors=this.checkForm(this.justification, this.justificationText)
        if(this.errors.length>0){
          this.dialogNoDelete=true
          this.loading = false;
          this.errors=[]
          return;
        }
        //Se elimina materia de la base de datos
        await db.doc(this.idN).delete();
        let motivo;
        if (this.justification!='Otro'){
          motivo = this.justification;
        }else{
          motivo = this.justificationText;
        }
        // Se guarda justificación 
        logDelete("materiaPrima", auth.currentUser.email, {
            nombre: this.materiasPrimas[this.idTabla].nombre,
            codigo: this.materiasPrimas[this.idTabla].codigo,
            cantidad: this.materiasPrimas[this.idTabla].cantidad,
            limite: this.materiasPrimas[this.idTabla].limite
          },motivo);
        // Se elimina de la tabla
        this.materiasPrimas.splice(this.idTabla, 1);
        this.dialogDelete = false;
        this.justification=null;
        this.justificationText=null;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se revisa si el campo nombre, cantidad y límite están vacíos en crear
    //entradas: no hay entradas
    //salidas: no hay salidas
    async evaluar() {
      try {
        let query1 = await db
        .where("nombre", "==", this.nombre)
        .get();
        if (this.nombre == '') {
          this.dialogUpdate3 = true;
          this.validar = true;
        }
        else if (this.editedItem.cantidad == null || this.editedItem.cantidad == "") {
          this.dialogUpdate5 = true;
          this.validar = true;
        }
        else if (this.limite == null || this.limite == "") {
          this.dialogUpdate6 = true;
          this.validar = true;
        }
        else if(query1.size != 0){
          this.dialogUpdate7 = true;
          this.validar = true;
        }
        else {
          this.validar = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    
    //descripción: se revisa si el campo nombre, cantidad y límite están vacíos en editar
    //entradas: no hay entradas
    //salidas: no hay salidas
    async evaluar2() {
      try {
        console.log(this.nombre)
        console.log(this.editedItem.nombre)
        let query1 = await db
        .where("nombre", "==", this.editedItem.nombre)
        .get();
        if (this.editedItem.nombre == '') {
          this.dialogUpdate3 = true;
          console.log(this.dialogUpdate3)
          this.validar2 = true;
        }

        else if (this.editedItem.cantidad == "" || this.editedItem.cantidad == null) {
          console.log("2");
          this.dialogUpdate5 = true;
          this.validar2 = true;
        }
        else if (this.editedItem.limite == "" || this.editedItem.limite == null) {
          this.dialogUpdate6 = true;
          this.validar2 = true;
        }
        else if(this.editedItem.nombre != this.nombre && query1.size != 0 ){
          this.dialogUpdate7 = true;
          this.validar2 = true;
        }
        
        else {
          this.validar2 = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    
    //descripción: se guarda nueva materia en la base de datos y se recarga tabla de materias primas
    //entradas: no hay entradas
    //salidas: no hay salidas
    async addMateria() {
      try {
        this.loading = true;
        await this.evaluar()
        console.log(this.validar);
        // Si se cumplen condiciones, se guarda la materia en la base de datos
        if (this.nombre && this.editedItem.cantidad && this.editedItem.cantidad > 0 && !this.validar) {
          await db.add({
            nombre: this.nombre,
            codigo: this.codigo,
            cantidad: this.editedItem.cantidad,
            limite: this.limite
          })
          //Se guardan cambios en la bitácora
          logNew("materiaPrima", auth.currentUser.email, {
            nombre: this.nombre,
            codigo: this.codigo,
            cantidad: this.editedItem.cantidad,
            limite: this.limite
          },"Nueva Materia prima");
          //Se recarga tabla de materias primas
          this.getMaterias();
          this.nombre = '';
          this.codigo = '';
          this.limite = null;
          this.editedItem.cantidad = null;
          this.dialog = false;
        } else {
          console.log('Campos obligatorias');
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se actualiza materia prima dentro de la base de datos
    //entradas: nombre de la base de datos (baseDatosName) y materia a actualizar (documento)
    //salidas: no hay salidas
    async updateProductoPendiente(baseDatosName, documento) {
      try {
        await firebase.collection(baseDatosName).doc(documento.id).update({
          nombre: documento.nombre,
          codigo: documento.codigo,
          cantidad: documento.cantidad,
          limite: documento.limite
        })
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se revisa si es posible realizar la edición de una materia, en dicho caso se procede con la operación
    //entradas: no hay entradas
    //salidas: no hay salidas
    async save() {
      this.loading = true;
      await this.evaluar2();
      if (this.validar2){
        this.loading = false;
        console.log("evaluado")
      }
      else{
        this.errors=this.checkForm(this.justificationEdit, this.justificationTextEdit)
        //Si no es posible realizar la edición
        if(this.errors.length>0 || this.justificationEdit==null){
          this.dialogNoEdit=true
          this.loading = false;
          this.errors=[]
          return;
        }
        
        this.loading = true;
        if (this.editedIndex > -1) {
          //Se lleva a cabo la actualización
          this.updateProductoPendiente("MateriasPrimas", this.editedItem)
          let motivo;
          if (this.justificationEdit!='Otro'){
            motivo = this.justificationEdit;
          }else{
            motivo = this.justificationTextEdit;
          }
          //Se guardan cambios en bitácora
          logModify("materiaPrima", auth.currentUser.email,this.editedItem.id, {
              nombre: this.materiasPrimas[this.editedIndex].nombre,
              codigo: this.materiasPrimas[this.editedIndex].codigo,
              cantidad: this.materiasPrimas[this.editedIndex].cantidad,
              limite: this.materiasPrimas[this.editedIndex].limite
              },{
              nombre: this.editedItem.nombre,
              codigo: this.editedItem.codigo,
              cantidad: this.editedItem.cantidad,
              limite: this.editedItem.limite
              }, motivo);
          Object.assign(this.materiasPrimas[this.editedIndex], this.editedItem)
        } else {
          this.materiasPrimas.push(this.editedItem)
        }
        this.dialogUpdate = false
        this.justificationEdit=null;
        this.justificationTextEdit=null;
        this.loading = false;
      }
    },
   
    //descripción: se obtienen las materias primas de la base de datos y se guardan en this.materiasPrimas
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getMaterias() {
      try {
        const snapshot = await db.get();
        const materiasPrimas = [];
        snapshot.forEach(doc => {
          let materiaPrimaData = doc.data();
          materiaPrimaData.id = doc.id;
          materiasPrimas.push(materiaPrimaData);
        })
        this.materiasPrimas = materiasPrimas;

      } catch (error) {
        console.log(error);
      }
    },

  },
}
</script>

<style scoped>

.agregar-producto-pendiente-container {
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

.agregar-producto-pendiente-container1 {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
}

.paginaprincipal-text {
  color: rgba(0, 0, 0, 1);
  width: 365px;
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

.dialog-container1 {
  padding: 30px;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
}

.notificacion {
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
}

.producto-container3 {
  height: 100px;

}

.titulo {
  color: rgba(0, 0, 0, 1);
  height: auto;
  position: absolute;
  font-size: 32px;
  align-self: auto;
  text-align: left;
  font-weight: 700;
  line-height: normal;
  font-stretch: normal;
  margin-right: 0;
  margin-bottom: 0;
  text-decoration: none;
  padding-bottom: 5px;
}

.dialog-container10 {
  padding: 40px;
}
</style>