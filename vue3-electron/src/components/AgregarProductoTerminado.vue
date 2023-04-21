<template>
  <v-card flat>
    <div class="dialog-container1">
      <div class="agregar-producto-terminado-container10">
        <v-card-title>
          <span class="paginaprincipal-text1 text-h5"><strong>Agregar nuevo producto</strong></span>
        </v-card-title>
      </div>
      <!--CAMPO DE NOMBRE Y SKU DEL NUEVO PRODUCTO-->
      <v-form>
        <v-text-field type="text" v-model="nombre" label="Nombre producto terminado">
        </v-text-field>
        <v-text-field type="text" v-model="SKU" label="Código SKU">
        </v-text-field>
      </v-form>
      <!--TABLA DE MATERIAS PRIMAS A SELECCIONAR-->
      <div class="agregar-producto-terminado-container3">
        <v-data-table :headers="headers1" :items="mp" :items-per-page="5" :search="search1" :page.sync="actualPageEditarMateriaPrima" :sort-by.sync="sortByMaterias"
          :sort-desc="true"
          class="elevation-1 blue lighten-5">
          <template v-slot:top>
            <v-toolbar flat>
              <span class="paginaprincipal-text1 text-h5"><span>Seleccionar materias primas</span></span>
              <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
            <!--BUSCADOR EN TABLA-->
            <v-toolbar flat>
              <v-text-field v-model="search1" append-icon="mdi-magnify" label="Buscar materia prima" single-line
                hide-details></v-text-field>
            </v-toolbar>
          </template>
          <!--EDITAR CANTIDAD DENTRO DE TABLA-->
          <template v-slot:[`item.cantidad`]="{ item }">
            <v-text-field :disabled="!item.estado"  v-model.number="item.cantidad" background-color="transparent" hide-details single-line solo
              flat placeholder="Cant." type="number" min="0" oninput="validity.valid||(value='');" />
          </template>
          <!--CHECKBOX DENTRO DE TABLA-->
          <template v-slot:[`item.estado`]="{ item }">
            <v-simple-checkbox @click="activarSeleccionarMP()" v-model="item.estado"></v-simple-checkbox>
          </template>
        </v-data-table>
        <div class="space2"></div>
        <!--TABLA DE INSUMOS A SELECCIONAR-->
        <v-data-table :headers="headers2" :items="ins" :items-per-page="5" class="elevation-2 blue lighten-5"  :page.sync="actualPageEditarInsumo" :sort-by.sync="sortByInsumos" :sort-desc="true"
          :search="search2">

          <template v-slot:top>
            <v-toolbar flat>
              <span class="paginaprincipal-text1 text-h5"><span>Seleccionar insumos</span></span>
              <v-divider class="mx-3" inset vertical></v-divider>
            </v-toolbar>
            <!--BUSCADOR EN TABLA-->
            <v-toolbar flat>
              <v-text-field v-model="search2" append-icon="mdi-magnify" label="Buscar Insumo" single-line hide-details>
              </v-text-field>
            </v-toolbar>
          </template>
          <!--EDITAR CANTIDAD DENTRO DE TABLA-->
          <template v-slot:[`item.cantidad`]="{ item }">
            <v-text-field :disabled="!item.estado" v-model.number="item.cantidad" background-color="transparent" hide-details single-line solo
              flat placeholder="Cant." type="number" min="0" oninput="validity.valid||(value='');" />
          </template>
          <!--CHECKBOX DENTRO DE TABLA-->
          <template v-slot:[`item.estado`]="{ item }">
            <v-simple-checkbox @click="activarSeleccionarINS()" v-model="item.estado"></v-simple-checkbox>
          </template>
        </v-data-table>
      </div>
      <div class="space"></div>
      <!--BOTONES QUE DAN LA OPCIÓN DE CONTINUAR CON LA ACCIÓN, O VOLVER-->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" large class="mr-2" @click="evaluar()">
          Agregar producto terminado
        </v-btn>
        <v-btn color="primary" large class="mr-2" @click="$emit('cerrar');">
          Volver
        </v-btn>
      </v-card-actions>
      <div class="agregar-producto-terminado-container5">

        <!--ALERTA POR SI ES QUE CAMPO DE NOMBRE ESTÁ VACÍO-->
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

        <!--ALERTA POR SI ES QUE CAMPO DE SKU ESTÁ VACÍO-->
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

        <!--ALERTA POR SI ES QUE EL SKU INGRESADO YA HA SIDO UTILIZADO-->
        <v-dialog v-model="dialogUpdate4_2" max-width="600px">
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

        <!--ALERTA POR SI ES QUE NOMBRE INGRESADO YA HA SIDO UTILIZADO-->
        <v-dialog v-model="dialogUpdate4_3" max-width="600px">
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

        <!--ALERTA POR SI ES QUE NO SE HAN INGRESADO EN CONJUNTO ALMENOS 1 MATERIA PRIMA Y 1 INSUMO-->
        <v-dialog v-model="dialogUpdate5" max-width="600px">
          <v-card>
            <v-card-title class="popUp yellow darken-2 white--text">
              <v-icon class="mr-2" left>mdi-exclamation-thick</v-icon>
              <span class="text-h5">Advertencia</span>
            </v-card-title>
            <v-card-text class="text-h6">
              Por favor, ingrese al menos 1 materia prima e insumo asociados.
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
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
  </v-card>
</template>

<script>
//SE REALIZAN IMPORTACIONES NECESARIAS
import firebase from "../utils/firebase.js";
import { auth } from '../utils/firebase';
import { logNew } from '../functions/bitacora.js';
const db1 = firebase.collection("Insumos");
const db2 = firebase.collection("MateriasPrimas");
const db3 = firebase.collection("ProductoTerminado");
export default {
  name: "AgregarProductoTerminado",
  props: {},
  //VARIABLES ASOCIADAS AL COMPONENTE
  data: () => ({
    search1: '',
    search2: '',
    loading: false,
    mp: [],
    ins: [],
    cantidadI: null,
    SKU: '',
    sortByMaterias: "estado",
    sortByInsumos: "estado",
    actualPageEditarInsumo:1,
    actualPageEditarMateriaPrima:1,
    nombre: '',
    cantidadMP: null,
    dialogUpdate1: false,
    dialogUpdate2: false,
    dialogUpdate3: false,
    dialogUpdate4: false,
    dialogUpdate4_2: false,
    dialogUpdate4_3: false,
    dialogUpdate5: false,
    insumoU: {},
    mpU: {},
    estado: false,

    // Columnas en la tabla de materias primas
    headers1: [
      { text: "Materias Primas", align: "start", value: "nombre", class: "blue darken-1 white--text" },
      { text: 'Código', value: 'codigo', class: "blue darken-1 white--text" },
      { text: "Cantidad (mL)", value: "cantidad", class: "blue darken-1 white--text" },
      { text: "Seleccionar", value: "estado", class: "blue darken-1 white--text" },
    ],

    // Columnas en la tabla de insumos
    headers2: [
      { text: "Insumos", align: "start", value: "nombre", class: "blue darken-1 white--text" },
      { text: 'Código', value: 'codigo', class: "blue darken-1 white--text" },
      { text: "Cantidad (unidades)", value: "cantidad", class: "blue darken-1 white--text" },
      { text: "Seleccionar", value: "estado", class: "blue darken-1 white--text" },
    ],

  }),
  mounted() {
     // CADA VEZ QUE SE INICIALIZA LA VENTANA SE OBTIENEN TODAS LAS MATERIAS PRIMAS E INSUMOS
    this.getMP();
    this.getI();
    console.log(auth.currentUser);
  },
  methods: {
    
    //descripción: Se obtienen todos los insumos de la base de datos y se guardan en this.ins
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getI() {
      try {
        const snapshot = await db1.get();
        const insumos = [];
        snapshot.forEach(doc => {
          let insumoData = doc.data();
          insumoData.id = doc.id;
          // A cada unsumo guardado se agrega atributo de cantidad y estado
          insumoData.cantidad = 0;
          insumoData.estado = false;
          insumos.push(insumoData);
        })
        this.ins = insumos;

      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se cambia cantidad y página de la tabla de materias primas, dependiendo si el estado está activo
      //             y la cantidad es 0, y si se ordena por estados se pasa a la primera página
      //entradas: no hay entradas
      //salidas: no hay salidas
      activarSeleccionarMP(){
      this.mp.forEach(
        async (materia) => {
          if (materia.estado == true && materia.cantidad ==0) {
              materia.cantidad =1;
              if(this.sortByMaterias == "estado"){
                this.actualPageEditarMateriaPrima = 1;
              }
          }
        }
      );
    },
    

    //descripción: se cambia cantidad y página de la tabla de insumos, dependiendo si el estado está activo
    //             y la cantidad es 0, y si se ordena por estados se pasa a la primera página
    //entradas: no hay entradas
    //salidas: no hay salidas
    activarSeleccionarINS(){
      this.ins.forEach(
        async (insumo) => {
          if (insumo.estado == true && insumo.cantidad ==0) {
              insumo.cantidad =1;
              if(this.sortByInsumos == "estado"){
                this.actualPageEditarInsumo = 1;
              }
          }
        }
      );
    },
    
    //descripción: Se obtienen todas las materias primas de la base de datos y se guardan en this.mp
    //entradas: no hay entradas
    //salidas: no hay salidas
    async getMP() {
      try {
        const snapshot = await db2.get();
        const materias = [];
        snapshot.forEach(doc => {
          let materiasData = doc.data();
          // A cada unsumo guardado se agrega atributo de cantidad y estado
          materiasData.cantidad = 0;
          materiasData.estado = false;
          materiasData.id = doc.id;
          materias.push(materiasData);
        });
        this.mp = materias;

      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se revisa la validez de la información ingresada, actualizando la base de datos y tabla
    //entradas: no hay entradas
    //salidas: se emite evento "actualizarFormula"
    async evaluar() {
      try {
        this.loading = true;
        let query1 = await db3
        .where("nombre", "==", this.nombre)
        .get();
        let query2 = await db3
          .where("sku", "==", this.SKU)
          .get();
        // Si el campo nombre está vacío
        if (this.nombre == '')
          this.dialogUpdate3 = true;
        // Si el campo sku está vacío
        else if (this.SKU == '')
          this.dialogUpdate4 = true;
        // Si el sku ingresado se encuentra en la base de datos
        else if (query2.size != 0) {
          this.dialogUpdate4_2 = true;
        }
        // Si el nombre ingresado se encuentra en la base de datos
        else if (query1.size != 0) {
          this.dialogUpdate4_3 = true;
        }
        else {
          const datos = this.evaluarRefactoring()
          const MateriasPrimasAsociadas = datos[0];
          const InsumosAsociados = datos[1];
          let numMP = datos[2];
          let numIN = datos[3];
          const indicesMP = datos[4];
          const indicesI = datos[5];
          // Si no se seleccionaron válidamente almenos 1 insumo y 1 materia prima
          if (numMP == 0 || numIN == 0) {
            this.dialogUpdate5 = true;
          }
          else {
            // Se actualiza la base de datos de productos terminados con la nueva información
            await db3.doc().set({
              nombre: this.nombre,
              sku: this.SKU,
              MateriasPrimasAsociadas: MateriasPrimasAsociadas,
              InsumosAsociados: InsumosAsociados,
              indiceI: indicesI,
              indiceMP: indicesMP
            });
            // Se guarda en bitácora el hecho de haber editado el producto
            logNew("productoTerminado", auth.currentUser.email, {
              nombre: this.nombre,
              sku: this.SKU,
              MateriasPrimasAsociadas: MateriasPrimasAsociadas,
              InsumosAsociados: InsumosAsociados,
            },"Nuevo Producto");
            this.$emit('updateData', this.SKU);
            this.nombre = "";
            this.SKU = "";
          }
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    //descripción: se revisa si se han seleccionado materias e insumos, con una cantidad válida y con estado verdadero
    //entradas: no hay entradas
    //salidas: Materias Asociadas (MateriasPrimasAsociadas), los insumos asociados (InsumosAsociados), la cantidad de mp asociadas (numMP),
    //         la cantidad de In asociados (numIN), el id de las mp (indicesMP) y el id de los in (indicesI)
    evaluarRefactoring() {
      const MateriasPrimasAsociadas = [];
      const InsumosAsociados = [];
      let numMP = 0;
      let numIN = 0;
      const indicesMP = [];
      const indicesI = [];
      // Se buscan todas las materias primas con estado true y cantidad mayor a 0, luego se guardan en MateriasPrimasAsociadas
      let materiasListas = this.mp.filter(d => d.estado === true && d.cantidad > 0);
      materiasListas.forEach(elemento => {
        MateriasPrimasAsociadas.push({ CantMateriaPrima: elemento.cantidad, idMP: elemento.id })
        indicesMP.push(elemento.id);
        numMP++;
      })
      // Se buscan todos los insumos con estado true y cantidad mayor a 0, luego se guardan en InsumosAsociados
      let insumosListos = this.ins.filter(d => d.estado === true && d.cantidad > 0);
      insumosListos.forEach(elemento => {
        InsumosAsociados.push({ CantidadInsumo: elemento.cantidad, idI: elemento.id })
        indicesI.push(elemento.id);
        numIN++;
      })
      return [MateriasPrimasAsociadas, InsumosAsociados, numMP, numIN, indicesMP, indicesI]
    }
  }
};
</script>

<style scoped>

.agregar-producto-terminado-container3 {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  padding-right: 10px;
}

.agregar-producto-terminado-container5 {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 40px;
  justify-content: center;
}

.elevation-1 {
  margin-top: 20px;
}

.elevation-2 {
  margin-top: 20px;
}

.space {
  height: 20px;
}

.space2 {
  width: 50px;
}


.dialog-container1 {
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 20px;
}


.paginaprincipal-text1 {
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  align-self: center;
  align-items: center;
}

.agregar-producto-terminado-container10 {
  text-align: center;
}
</style>
