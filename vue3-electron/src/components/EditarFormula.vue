<template>
    <v-card flat>
      <div class="dialog-container1">
        <!--EDICIÓN DE NOMBRE Y SKU DE PRODUCTO-->
        <v-container>
            <v-form>
              <v-text-field type="text" v-model="nombreProducto2" label="Nombre producto terminado">
              </v-text-field>
              <v-text-field type="text" v-model="skuProducto2" label="Código SKU">
              </v-text-field>
            </v-form>
          </v-container>
        <div class="agregar-producto-terminado-container3">
          <v-container>
          <!--TABLA DE MATERIAS PRIMAS-->
          <v-data-table :headers="headers1" :items="mp" :items-per-page.sync="itemsPerPageMaterias" :page.sync="actualPageEditarMateriaPrima" :search="search1" :sort-by.sync="sortByMaterias"
          :sort-desc="true"
            class="elevation-1 blue lighten-5">
            <template v-slot:top>
              <v-toolbar flat>
                <span class="paginaprincipal-text1"><span>Seleccionar materias primas</span></span>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>
              <!--BUSCADOR EN TABLA-->
              <v-toolbar flat>
                <v-text-field v-model="search1" append-icon="mdi-magnify" label="Buscar materia prima" single-line
                  hide-details></v-text-field>
              </v-toolbar>
            </template>
            <!--EDITAR CANTIDAD DENTRO DE TABLA-->
            <template v-slot:[`item.cantidadMP`]="{ item }">
              <v-text-field :disabled="!item.estado" v-model.number="item.cantidadMP" background-color="transparent" hide-details single-line solo
                flat placeholder="Cant." type="number" min="0" oninput="validity.valid||(value='');" />
            </template>
            <!--CHECKBOX DENTRO DE TABLA-->
            <template v-slot:[`item.estado`]="{ item }">
              <v-simple-checkbox @click="activarSeleccionarMP()" v-model="item.estado"></v-simple-checkbox>
            </template>
          </v-data-table>
          </v-container>
          <div class="space2"></div>
          <v-container>
          <!--TABLA DE INSUMOS-->
          <v-data-table :headers="headers2" :items="ins" :items-per-page.sync="itemsPerPageInsumos" :page.sync="actualPageEditarInsumo" class="elevation-2 blue lighten-5"
            :search="search2" :sort-by.sync="sortByInsumos" :sort-desc="true">
            <template v-slot:top>
              <v-toolbar flat>
                <span class="paginaprincipal-text1"><span>Seleccionar insumos</span></span>
                <v-divider class="mx-3" inset vertical></v-divider>
              </v-toolbar>
              <!--BUSCADOR EN TABLA-->
              <v-toolbar flat>
                <v-text-field v-model="search2" append-icon="mdi-magnify" label="Buscar Insumo" single-line hide-details>
                </v-text-field>
              </v-toolbar>
            </template>
            <!--EDITAR CANTIDAD DENTRO DE TABLA-->
            <template v-slot:[`item.cantidadI`]="{ item }">
              <v-text-field :disabled="!item.estado" v-model.number="item.cantidadI" background-color="transparent" hide-details single-line solo
                flat placeholder="Cant." type="number" min="0" oninput="validity.valid||(value='');" />
            </template>
            <!--CHECKBOX DENTRO DE TABLA-->
            <template v-slot:[`item.estado`]="{ item }">
              <v-simple-checkbox @click="activarSeleccionarINS()" v-model="item.estado"></v-simple-checkbox>
            </template>
          </v-data-table>
          </v-container>
          
        <div>
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
        <!--SE DA LA OPCIÓN DE CANCELAR O ACEPTAR Y PROSEGUIR CON LOS CAMBIOS DE LA EDICIÓN-->
        <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary" large class="mr-4"  @click="evaluar">Aceptar
              </v-btn>
              <v-btn type="submit" color="primary" large class="mr-4" @click="$emit('actualizarFormula')">Cancelar
              </v-btn>
      </v-card-actions>
      </div>
    </v-card>
  </template>
  
  <script>
  //SE REALIZAN IMPORTACIONES NECESARIAS
  import firebase from "../utils/firebase.js";
  import { auth } from '../utils/firebase';
  import {logModify} from '../functions/bitacora.js';
  const db1 = firebase.collection("Insumos");
  const db2 = firebase.collection("MateriasPrimas");
  const db3 = firebase.collection("ProductoTerminado");
  const db4 = firebase.collection("productosPendientes");
  const db5 = firebase.collection("productosFinalizados");
  export default {
    name: "AgregarProductoTerminado",
    // VARIABLES DE ENTRADA AL COMPONENTE
    props: {aaa: [], bbb: [], fMP: [], fI:[], idProducto: '', nombreProducto: '', skuProducto: ''},
    //VARIABLES ASOCIADAS AL COMPONENTE
    data: () => ({
      actualPageEditarInsumo:1,
      actualPageEditarMateriaPrima:1,
      itemsPerPageInsumos:5,
      itemsPerPageMaterias:5,
      loading: false,
      sortByMaterias: "estado",
      sortByInsumos: "estado",
      search1: '',
      search2: '',
      mp: [],
      ins: [],
      cantidadI: null,
      SKU: '',
      nombre: '',
      cantidadMP: null,
      dialogUpdate3: false,
      dialogUpdate4: false,
      dialogUpdate4_2: false,
      dialogUpdate4_3: false,
      dialogUpdate5: false,
      nombreProducto2: '',
      skuProducto2: '',
      insumoU: {},
      mpU: {},
      estado: false,
      // Columnas en la tabla de materias primas
      headers1: [
        { text: "Materias Primas", align: "start", value: "nombre", class: "blue darken-1 white--text" },
        { text: 'Código', value: 'codigo', class: "blue darken-1 white--text" },
        { text: "Cantidad (mL)", value: "cantidadMP", class: "blue darken-1 white--text" },
        { text: "Seleccionar", value: "estado", class: "blue darken-1 white--text" },
      ],
      // Columnas en la tabla de insumos
      headers2: [
        { text: "Insumos", align: "start", value: "nombre", class: "blue darken-1 white--text" },
        { text: 'Código', value: 'codigo', class: "blue darken-1 white--text" },
        { text: "Cantidad (unidades)", value: "cantidadI", class: "blue darken-1 white--text" },
        { text: "Seleccionar", value: "estado", class: "blue darken-1 white--text" },
      ],
  
    }),
    mounted() {
      // CADA VEZ QUE SE INICIALIZA LA VENTANA SE ACTUALIZAN LOS ELEMENTOS EN LA TABLA SI ES QUE SON PARTE DE LA FÓRMULA ASOCIADA AL PRODUCTO
      this.llenarFormula();
    },
    methods: {
      //descripción: se actualizan contenido de las tablas para que insumos y materias asociadas aparezcan con cantidad definida y estado positivo
      //entradas: no hay entradas
      //salidas: no hay salidas
      llenarFormula(){
        try {
          this.nombreProducto2 = this.nombreProducto;
          this.skuProducto2 = this.skuProducto;
          this.mp = JSON.parse(JSON.stringify(this.aaa)); 
          this.ins = JSON.parse(JSON.stringify(this.bbb)); 
          // Por cada materia asociada se identifica en la tabla de todas las materias, cambiando la cantidad y el estado
          this.fMP.forEach(elemento => {
            let materiaModificar = this.mp.find(d => d.id === elemento.id);
            materiaModificar.cantidadMP = elemento.CantMateriaPrima; 
            materiaModificar.estado = true;
          });
          // Por cada insumo asociado se identifica en la tabla de todos los insumos, cambiando la cantidad y el estado
          this.fI.forEach(elemento => {
            let insumoModificar = this.ins.find(d => d.id === elemento.id);
            insumoModificar.cantidadI = elemento.CantidadInsumo;
            insumoModificar.estado = true;
          });
          //Se cambia cantidad de items por página
          this.itemsPerPageInsumos = (Math.trunc(this.ins.filter(d => d.estado ===true).length/5)+1)*5;
          this.itemsPerPageMaterias = (Math.trunc(this.mp.filter(d => d.estado ===true).length/5)+1)*5;

        } catch (e) {
          console.error(e);
        }
      },

      //descripción: se cambia cantidad y página de la tabla de materias primas, dependiendo si el estado está activo
      //             y la cantidad es 0, y si se ordena por estados se pasa a la primera página
      //entradas: no hay entradas
      //salidas: no hay salidas
      activarSeleccionarMP(){
      this.mp.forEach(
        async (materia) => {
          if (materia.estado == true && materia.cantidadMP ==0) {
              materia.cantidadMP =1;
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
          if (insumo.estado == true && insumo.cantidadI ==0) {
              insumo.cantidadI =1;
              if(this.sortByInsumos == "estado"){
                this.actualPageEditarInsumo = 1;
              }
          }
        }
      );
    },
      
    //descripción: se revisa la validez de la información ingresada, actualizando la base de datos y las demás tablas que contengan info sobre el producto
    //entradas: no hay entradas
    //salidas: se emite evento "actualizarFormula"
    async evaluar() {
      try {
          this.loading = true;
          let query1 = await db3
        .where("nombre", "==", this.nombreProducto2)
        .get();
        let query2 = await db3
          .where("sku", "==", this.skuProducto2)
          .get();
        // Si el campo nombre está vacío
        if (this.nombreProducto2 == '')
          this.dialogUpdate3 = true;
        // Si el campo sku está vacío
        else if (this.skuProducto2 == '')
          this.dialogUpdate4 = true;
        // Si el sku ingresado se encuentra en la base de datos
        else if (query2.size != 0 && this.skuProducto2 != this.skuProducto ) {
          this.dialogUpdate4_2 = true;
        }
        // Si el nombre ingresado se encuentra en la base de datos
        else if (query1.size !=0 && this.nombreProducto2 != this.nombreProducto) {
          this.dialogUpdate4_3 = true;
        }
        else{
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

            let productoActual= '';
            let idPF1 = [];
            let idPF2 = [];
            // Se busca el producto antes de la edición
            await db3.doc(this.idProducto).get().then((doc) => {
            productoActual = doc.data();
            });

            // Se busca el id del producto modificado en la tabla de productos pendientes de la página principal
            // y se guarda en idPF1
             let aa = await db4
            .where("idPT", "==", this.idProducto)
            .get()
            
            aa.forEach(doc => {
              idPF1.push(doc.id)
            });

            // Se busca el id del producto modificado en la tabla de productos finalizados de la página principal
            // y se guarda en idPF2
            let bb = await db5
            .where("idPT", "==", this.idProducto)
            .get()
            
            bb.forEach(doc => {
              idPF2.push(doc.id)
            });

            // Se actualiza la base de datos de productos terminados con la nueva información
            await db3.doc(this.idProducto).update({
            MateriasPrimasAsociadas: MateriasPrimasAsociadas,
            InsumosAsociados: InsumosAsociados,
            indiceI: indicesI,
            indiceMP: indicesMP,
            nombre: this.nombreProducto2,
            sku: this.skuProducto2
           })
           // Si el producto modificado está en la tabla de pendientes, se modifica dentro de la misma
           if(idPF1.length == 1){
              await db4.doc(idPF1[0]).update({
                MateriasPrimasAsociadas: MateriasPrimasAsociadas,
                InsumosAsociados: InsumosAsociados,
                indiceI: indicesI,
                indiceMP: indicesMP,
                nombre: this.nombreProducto2,
                sku: this.skuProducto2
                })
            }
            else{
              idPF1 = [];
            }

            // Si el producto modificado está en la tabla de finalizados, se modifica dentro de la misma
            if (idPF2.length == 1){
              await db5.doc(idPF2[0]).update({
                MateriasPrimasAsociadas: MateriasPrimasAsociadas,
                InsumosAsociados: InsumosAsociados,
                indiceI: indicesI,
                indiceMP: indicesMP,
                nombre: this.nombreProducto2,
                sku: this.skuProducto2
              })
            }
            else{
              idPF2 = [];
            }

          // Si se cambió el nombre o el sku, se lleva a cabo un guardado en bitácora
          if(this.nombreProducto2 != this.nombreProducto || this.skuProducto2 != this.skuProducto){
            logModify("productoTerminado", auth.currentUser.email, this.idProducto,productoActual,{
            nombre: this.nombreProducto2,
            sku: this.skuProducto2,
            MateriasPrimasAsociadas: productoActual.MateriasPrimasAsociadas,
            InsumosAsociados: productoActual.InsumosAsociados,
          },"Cambio de Nombre y/o SKU.");
          productoActual.sku = this.skuProducto2;
          productoActual.nombre = this.nombreProducto2;
          }
          
          // Se guarda en bitácora el hecho de haber editado el producto
           logModify("productoTerminado", auth.currentUser.email, this.idProducto,productoActual,{
            nombre: this.nombreProducto2,
            sku: this.skuProducto2,
            MateriasPrimasAsociadas: MateriasPrimasAsociadas,
            InsumosAsociados: InsumosAsociados,
          },"Edición de formula.");
            this.loading = false;
            this.$emit('actualizarFormula');
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
    evaluarRefactoring(){
      const MateriasPrimasAsociadas = [];
      const InsumosAsociados = [];
      let numMP = 0;
      let numIN = 0;
      const indicesMP = [];
      const indicesI = [];
      // Se buscan todas las materias primas con estado true y cantidad mayor a 0, luego se guardan en MateriasPrimasAsociadas
      let materiasListas = this.mp.filter(d => d.estado === true && d.cantidadMP > 0);
      materiasListas.forEach(elemento =>{
          MateriasPrimasAsociadas.push({ CantMateriaPrima: elemento.cantidadMP, idMP: elemento.id})
          indicesMP.push(elemento.id);
          numMP++;
      })
      // Se buscan todos los insumos con estado true y cantidad mayor a 0, luego se guardan en InsumosAsociados
      let insumosListos = this.ins.filter(d => d.estado === true && d.cantidadI > 0);
      insumosListos.forEach(elemento =>{
          InsumosAsociados.push({ CantidadInsumo: elemento.cantidadI, idI: elemento.id })
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
  
  .elevation-1 {
    margin-top: 20px;
  }
  
  .elevation-2 {
    margin-top: 20px;
  }
  
  
  .space2 {
    width: 50px;
  }
  
  

  
  
  .dialog-container1 {
    padding-left: 40px;
    padding-right: 40px;
  }
  
  .paginaprincipal-text1 {
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    text-align: center;
    align-self: center;
    align-items: center;
  }
  
  </style>
  