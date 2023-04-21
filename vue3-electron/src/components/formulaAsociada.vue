<template>
  <div class="dialog-containerFA">
    <v-card-text class="formula-titulo-text text-center text-h5"> <strong>Fórmula asociada: {{ this.itemDetails.nombrePT }}</strong></v-card-text>

    <div class="table2-container1">
      <v-container class="container-tabla1">
        <!--TABLA MATERIAS PRIMAS AL REVISAR FORMULAS-->
        <v-data-table :headers="headers1" :items="itemDetails.mp" :items-per-page="5" :search="search1"
          class="elevation-1 blue lighten-5">
          <template v-slot:top>
            <v-toolbar flat>
              <span class="formula-titulo-text"><span>Materias primas</span></span>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <!--BUSCADOR DENTRO DE TABLA-->
            <v-toolbar flat>
              <v-text-field v-model="search1" append-icon="mdi-magnify" label="Buscar materia prima" single-line
                hide-details></v-text-field>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-container>
      <v-container class="container-tabla2">
        <!--TABLA INSUMOS AL REVISAR FORMULAS-->
        <v-data-table :headers="headers2" :items="itemDetails.ins" :items-per-page="5"
          class="elevation-2 blue lighten-5" :search="search2">
          <template v-slot:top>
            <v-toolbar flat>
              <span class="formula-titulo-text"><span>Insumos</span></span>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <!--BUSCADOR DENTRO DE TABLA-->
            <v-toolbar flat>
              <v-text-field v-model="search2" append-icon="mdi-magnify" label="Buscar Insumo" single-line hide-details>
              </v-text-field>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-container>
    </div>
  </div>
</template>


<script>

export default {
  name: "ProductoTerminado",
  // VARIABLES DE ENTRADA AL COMPONENTE
  props: {
    itemDetails: {
      ins: null,
      mp: null,
      nombrePT: null,
      skuPT: null,
    },

  },
  //VARIABLES ASOCIADAS AL COMPONENTE
  data: () => ({
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
    search1: '',
    search2: '',
  }),

};
</script>

<style scoped>
.formula-titulo-text {
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  align-self: center;
  align-items: center;
}

.dialog-containerFA {
  display: flex;
  align-items: center;
  padding-top: 40px;
  flex-direction: column;
  padding-bottom: 10px;
  justify-content: flex-start;
}


.table2-container1 {
  width: 100%;
  display: flex;
  align-items: flex-start, center;
  justify-content: center;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
}
</style>