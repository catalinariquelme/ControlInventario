<template>
    <div class="principal">
    <div class="titulo">
            <span class="paginaprincipal-text pt-5">Bitácora</span>
        </div>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-row>
            <v-col>
                <div class="calendario">
                <v-container>
                    <!--LISTA DE AÑOS DESDE QUE COMENZO LA APLICACION-->
                    <v-list>
                        <v-list-group v-for="item in fechas" :key="item.title" v-model="item.active"
                            prepend-icon="mdi-calendar" no-action>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title v-text="item.title"></v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <!--CARD CON LOS MESES DE UN AÑO-->
                            <v-card class="rounded-card"> 
                                <!--PRIMERA FILA CON LOS MESES DE ENERO A ABRIL-->
                                <v-row no-gutters>
                                    <v-col v-for="(mes, index) in item.meses" v-if="index < 4" :key="index">
                                        <v-card class="pa-2" outlined tile>
                                            <div class="text-overline mb-1">
                                                {{ mes.title }}
                                            </div>
                                            <v-card-actions>
                                                <v-btn color="primary" class="mr-4" @click="seleccionarRangoMes(mes.indice,item.title)">
                                                    Ver
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>

                                </v-row>
                                <!--SEGUNDA FILA CON LOS MESES DE MAYO A AGOSTO-->
                                <v-row no-gutters>
                                    <v-col v-for="(mes, index) in item.meses" v-if="index > 3 && index < 8"
                                        :key="index">
                                        <v-card class="pa-2" outlined tile>
                                            <div class="text-overline mb-1">
                                                {{ mes.title }}
                                            </div>

                                            <v-card-actions>
                                                <v-btn color="primary" class="mr-4" @click="seleccionarRangoMes(mes.indice,item.title)">
                                                    Ver
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <!--TERCERA FILA CON LOS MESES DE SEPTIEMBRE A DICIEMBRE-->
                                <v-row no-gutters>
                                    <v-col v-for="(mes, index) in item.meses" v-if="index > 7 && index < 12"
                                        :key="index">
                                        <v-card class="pa-2" outlined tile>
                                            <div class="text-overline mb-1">
                                                {{ mes.title }}
                                            </div>
                                            <!--SELECCIONAR MES DE LA BITACORA A MOSTRAR-->
                                            <v-card-actions>
                                                <v-btn color="primary" class="mr-4" @click="seleccionarRangoMes(mes.indice,item.title)">
                                                    Ver
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>

                                </v-row>
                            </v-card>
                        </v-list-group>
                    </v-list>
                </v-container>
            </div>
            </v-col>
            <v-col>
                 <!--CARD DONDE SE MUESTRA LA BITACORA DE UN MES EN ESPECIFICO-->
                <div class="tabla">
                <v-card max-width="1500">
                     <!--TOOLBAR PARA SELECCIONAR CATEGORIA, YA SEA PRODUCTO, MATERIA PRIMA O INSUMO-->
                    <v-toolbar color="blue darken-1" dark>
                        <v-toolbar-title>{{bitacoraMes}} de {{bitacoraAnio}}</v-toolbar-title>
                        <template v-slot:extension>
                            <v-tabs v-model="tab">
                                <v-tabs-slider color="cyan accent-1"></v-tabs-slider>
                                <v-tab v-for="header in headersBitacora" :key="header.title">
                                    {{ header.text }}
                                </v-tab>
                            </v-tabs>
                        </template>
                       
                    </v-toolbar>
                     <!--ASIGNACION DE ITEMS PARA LA CATEGORIA-->
                    <v-tabs-items v-model="tab" background-color="black">
                        <v-tab-item>
                            <v-card class="overflow-auto" max-height=500 elevation="16" flat>
                                <v-treeview dense hoverable shaped open-on-click :items="bitacoraProductos"></v-treeview>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card class="overflow-auto" max-height=500 elevation="16" flat>
                                <v-treeview dense hoverable shaped open-on-click :items="bitacoraMateriasPrimas"></v-treeview>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card class="overflow-auto" max-height=500 elevation="16" flat>
                                <v-treeview dense hoverable shaped  open-on-click :items="bitacoraInsumos"></v-treeview>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import firebase from "../utils/firebase.js";
import { logNew } from '../functions/bitacora.js';
import * as XLSX from 'xlsx/xlsx.mjs';
import { connectFirestoreEmulator } from "@firebase/firestore";

export default {
    //VARIABLES ASOCIADAS A LA VISTA
    data: () => {
        return {
            //headers de la bitacora con las categorias
            headersBitacora: [
                { text: 'Productos', align: 'start', value: 'nombre', class: "blue darken-1 white--text" },
                { text: 'Materias primas', value: 'codigo', class: "blue darken-1 white--text" },
                { text: 'Insumos', value: 'cantidad', class: "blue darken-1 white--text" },
            ],
            tab: null,
            options: {weekday: "long", year: "numeric", month: "long", day: "numeric"},
            bitacoraMes: "",
            bitacoraAnio: "",
            bitacoraMateriasPrimas: [{name: "Cargando datos de bitácora Materias Primas..."}],
            bitacoraInsumos: [{name: "Cargando datos de bitácora Insumos..."}],
            bitacoraProductos: [{name: "Cargando datos de bitácora Productos..."}],
            fechas: [],
            meses: [
                { title: 'Enero' , indice: 0},
                { title: 'Febrero', indice: 1 },
                { title: 'Marzo', indice: 2 },
                { title: 'Abril', indice: 3 },
                { title: 'Mayo', indice: 4 },
                { title: 'Junio', indice: 5 },
                { title: 'Julio', indice: 6 },
                { title: 'Agosto', indice: 7 },
                { title: 'Septiembre', indice: 8 },
                { title: 'Octubre', indice: 9 },
                { title: 'Noviembre', indice: 10 },
                { title: 'Diciembre', indice: 11 },
            ]
        }
    },
    created() {
        //se obtiene fecha desde que se creo la aplicacion hasta la fecha actual y se guardan en array fechas, ademas se obtienen las bitacoras del mes actual
        let dateInicio = new Date('2022-12-17T03:24:00');
        let dateActual = new Date();
        let anioInicio = dateInicio.getFullYear();
        let anioActual = dateActual.getFullYear();
        let mesInicio = dateInicio.getMonth();
        let mesActual = dateActual.getMonth();
        this.bitacoraMes = this.meses[mesActual].title;
        this.bitacoraAnio = anioActual;
        this.obtenerBitacorasMesActual(mesActual+1,anioActual);
        //creacion de los meses y años para seleccionar en la bitacora en array "fechas"

        if ((anioActual - anioInicio) == 0) { // caso año de incio es el mismo que el actual
            let primero = { title: anioInicio, meses: [] };
            for (let i = mesInicio; i <= mesActual; i++) {
                primero.meses.push(this.meses[i]);
            }
            this.fechas.push(primero);
        } else {
            for (let i = 0; i <= (anioActual - anioInicio); i++) {
                if (i == 0) { //primer año
                    let primero = { title: anioInicio, meses: [] };
                    for (let i = mesInicio; i <= 11; i++) {
                        primero.meses.push(this.meses[i]);
                    }
                    this.fechas.push(primero);
                } else if (i == (anioActual - anioInicio)) { // ultimo año
                    let ultimo = { title: anioActual, meses: [] };
                    for (let i = 0; i <= mesActual; i++) {
                        ultimo.meses.push(this.meses[i]);
                    }
                    this.fechas.push(ultimo);
                } else {
                    this.fechas.push({
                        title: anioInicio + i,
                        meses: this.meses
                    })
                }
            }
        }
        //console.log("todas las fechas")
        //console.log(this.fechas)
    },
    methods: {
        //descripción: funcion que pasa un mes y año a formato date
        //entradas: numero (mes) y numero (anio)
        //salidas: json con fecha de incio y fecha de fin
        getStarAndEnd(mes,anio){ //mes acepta un valor entre 1 y 12
            let startString;
            let endString;
            if( mes < 9 ){
                startString = anio + '-0' + mes + '-01T00:00:00';
                endString = anio + '-0' + (mes+1) + '-01T00:00:00';
            }else if(mes == 9 ){
                startString = anio + '-0' + mes + '-01T00:00:00';
                endString = anio + '-' + (mes+1) + '-01T00:00:00';
            }else if(mes >9 && mes < 12){
                startString = anio + '-' + mes + '-01T00:00:00';
                endString = anio + '-' + (mes+1) + '-01T00:00:00';                
            }else if(mes == 12){
                startString = anio + '-' + mes + '-01T00:00:00';
                endString = (anio+1) + '-01-01T00:00:00';                 
            }
            return {start: new Date(startString), end: new Date(endString)};

        },
        //descripción: función que pasa a formato treeview un snapshot de una bitacora de insumo o materia
        //entradas: numero (mes) y numero (anio)
        //salidas: json con fecha de incio y fecha de fin
        getBitacoraInsumoOMateria(snapshot,index){
            let i = index;
            let elementos =[];
            snapshot.forEach((doc) => {
                    let elementoData = {
                        id:i,
                        name: doc.data().marcaTiempo.toDate().toLocaleString("es-CL", this.options)+ " " + doc.data().marcaTiempo.toDate().toLocaleTimeString(),
                        children: [{name: "motivo: " + doc.data().motivo},{name: "usuario: " + doc.data().usuario}]
                    };
                    i = i+1;
                    if (doc.data().item != undefined){
                        elementoData.children.push({
                            id: i,
                            name: "item",
                            children: [
                                {name: "nombre: " + doc.data().item.nombre},
                                {name: "cantidad: " + doc.data().item.cantidad},
                                {name: "limite: " + doc.data().item.limite},
                                {name: "codigo: " + doc.data().item.codigo}]})
                    }
                    i = i+1;
                    if (doc.data().itemDespues != undefined){
                        elementoData.children.push({
                            id: i,
                            name: "item Despues",
                            children: [
                                {name: "nombre: " + doc.data().itemDespues.nombre},
                                {name: "cantidad: " + doc.data().itemDespues.cantidad},
                                {name: "limite: " + doc.data().itemDespues.limite},
                                {name: "codigo: " + doc.data().itemDespues.codigo}]})
                    }
                    i = i+1;
                    elementos.push(elementoData);
                })
            return {elementos: elementos,i: i};
        },
        //descripción: función que obtiene todas las bitacoras de un mes y año
        //entradas: numero (mes) y numero (anio)
        //salidas: no hay salida
        async obtenerBitacorasMesActual(mes,anio) {
            try {
                let elementos = [];
                let rango = this.getStarAndEnd(mes,anio);
                let i = 0;
                let resultados;
                //se obtiene bitacora de materias primas 
                let snapshot = await firebase.collection("BitacoraMateriasPrimas").where('marcaTiempo', '>', rango.start).where('marcaTiempo', '<', rango.end).orderBy("marcaTiempo", "desc").get();
                //se pasa a formato de treeview
                resultados = this.getBitacoraInsumoOMateria(snapshot,i);
                if(resultados.elementos.length == 0){ // si esta vacia la bitacora
                    this.bitacoraMateriasPrimas = [{name: "No hay bitacora de Materias primas para este mes."}];
                }else{      
                this.bitacoraMateriasPrimas = resultados.elementos;
                }
                i = resultados.i;

                //i = 0;
                //se obtiene bitacora de insumos
                let snapshot2 = await firebase.collection("BitacoraInsumos").where('marcaTiempo', '>', rango.start).where('marcaTiempo', '<', rango.end).orderBy("marcaTiempo", "desc").get();
                //se pasa a formato de treeview
                resultados = this.getBitacoraInsumoOMateria(snapshot2,i);
                if(resultados.elementos.length == 0){
                    this.bitacoraInsumos = [{name: "No hay bitacora de Insumos para este mes."}];
                }else{      
                this.bitacoraInsumos = resultados.elementos;
                }
                i = resultados.i;
                //se obtiene productos terminados
                snapshot = await firebase.collection("BitacoraProductosTerminados").where('marcaTiempo', '>', rango.start).where('marcaTiempo', '<', rango.end).orderBy("marcaTiempo", "desc").get();
                //se pasa a formato de treeview
                snapshot.forEach((doc) => {
                    let elementoData = {
                        id:i,
                        name: doc.data().marcaTiempo.toDate().toLocaleString("es-CL", this.options)+ " " + doc.data().marcaTiempo.toDate().toLocaleTimeString(),
                        children: [{name: "motivo: " + doc.data().motivo},{name: "usuario: " + doc.data().usuario}]
                    };
                    
                    i=i+1;
                    let itemData;
                    let insumosTree;
                    let materiasPrimasTree;
                    let itemData2;
                    let insumosTree2;
                    let materiasPrimasTree2;
                    if (doc.data().item != undefined){
                        itemData = {
                            id: i,
                            name: "item",
                            children: [
                                {id: i+1,name: "nombre: " + doc.data().item.nombre},
                                {id: i+2,name: "sku: " + doc.data().item.sku}
                            ]
                        }
                        if (doc.data().item.cantidad != undefined){
                            itemData.children.push({name: "cantidad: " + doc.data().item.cantidad})
                        }
                        insumosTree = {
                            id: i+3,
                            name: "Insumos Asociados",
                            children: []};
                        i = i+4;
                        doc.data().item.InsumosAsociados?.forEach(async (insumo,index) =>{
                            await firebase.collection("Insumos").doc( insumo.idI).get().then((doc2) => {
                                insumosTree.children.push({
                                id: i+index,
                                name: doc2.data().nombre,
                                children: [
                                    {name: "cantidad: " + insumo.CantidadInsumo},
                                    {name: "id: " + insumo.idI}]})
                            });
                        })
                        i = i+ (doc.data().item.InsumosAsociados?.length ?? 0);
                        materiasPrimasTree = {
                            id: i,
                            name: "Materias primas asociadas",
                            children: []};
                        i = i+1;
                        doc.data().item.MateriasPrimasAsociadas?.forEach(async (materia,index) =>{
                            await firebase.collection("MateriasPrimas").doc( materia.idMP).get().then((doc2) => {
                                materiasPrimasTree.children.push({
                                id: i+index,
                                name: doc2.data().nombre,
                                children: [
                                    {name: "cantidad: " + materia.CantMateriaPrima},
                                    {name: "id: " +  materia.idMP}]})
                            });

                        })
                        i = i+ (doc.data().item.MateriasPrimasAsociadas?.length ?? 0);
                        if (doc.data().item.InsumosAsociados != undefined){
                            itemData.children.push(insumosTree)
                        }
                        if (doc.data().item.MateriasPrimasAsociadas != undefined){
                            itemData.children.push(materiasPrimasTree)
                        }
                        elementoData.children.push(itemData)
                    }
                    if (doc.data().itemDespues != undefined){
                        itemData2 = {
                            id: i,
                            name: "item Despues",
                            children: [
                                {id: i+1,name: "nombre: " + doc.data().itemDespues.nombre},
                                {id: i+2,name: "sku: " + doc.data().itemDespues.sku}
                            ]
                        }
                        insumosTree2 = {
                            id: i+3,
                            name: "Insumos Asociados",
                            children: []};
                        i = i+4;
                        doc.data().itemDespues.InsumosAsociados.forEach(async (insumo,index) =>{
                            await firebase.collection("Insumos").doc( insumo.idI).get().then((doc2) => {
                                insumosTree2.children.push({
                                id: i+index,
                                name: doc2.data().nombre,
                                children: [
                                    {name: "cantidad: " + insumo.CantidadInsumo},
                                    {name: "id: " + insumo.idI}]})
                            });
                        })
                        i = i+doc.data().itemDespues.InsumosAsociados.length;
                        materiasPrimasTree2 = {
                            id: i,
                            name: "Materias primas asociadas",
                            children: []};
                        i = i+1;
                        doc.data().itemDespues.MateriasPrimasAsociadas.forEach(async (materia,index) =>{
                            await firebase.collection("MateriasPrimas").doc( materia.idMP).get().then((doc2) => {
                                materiasPrimasTree2.children.push({
                                id: i+index,
                                name: doc2.data().nombre,
                                children: [
                                    {name: "cantidad: " + materia.CantMateriaPrima},
                                    {name: "id: " +  materia.idMP}]})
                            });
                            
                        })
                        i = i+doc.data().itemDespues.MateriasPrimasAsociadas.length;
                        itemData2.children.push(insumosTree2)
                        itemData2.children.push(materiasPrimasTree2)
                        elementoData.children.push(itemData2)
                    }
                    elementos.push(elementoData);
                })
                if(elementos.length == 0){
                    this.bitacoraProductos = [{name: "No hay bitacora de Productos para este mes."}];
                }else{      
                this.bitacoraProductos = elementos;
                }
            } catch (error) {
                console.log(error)
            }
        },
        //descripción: función que setea el mes y año actual para posteriormente descargar la bitacora de ese fecha
        //entradas: numero (mes) y numero (anio)
        //salidas: no hay salida
        seleccionarRangoMes(mes,anio){
            this.bitacoraMes = this.meses[mes].title;
            this.bitacoraAnio = anio;
            this.bitacoraMateriasPrimas= [{name: "Cargando datos de bitácora Materias Primas..."}]
            this.bitacoraInsumos= [{name: "Cargando datos de bitácora Insumos..."}]
            this.bitacoraProductos= [{name: "Cargando datos de bitácora Productos..."}]
            this.obtenerBitacorasMesActual(mes+1,anio);
        },

    }
}

</script>

<style scoped>

.titulo{
    flex: 0 0 auto;
    display: flex;
    align-self: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 5px;
    justify-content: center;
}

.paginaprincipal-text {
    color: rgba(0, 0, 0, 1);
    font-size: 32px;
    font-style: Bold;
    align-self: center;
    font-weight: 700;
}

.rounded-card {
    border-radius: 1000px;
}

.calendario{
    width: 45vw;
    padding-left: 40px;

}

.tabla{
    padding-left: 10px;
    padding-right: 40px;
    width: 50vw;
}
</style>