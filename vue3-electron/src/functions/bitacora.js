import firebase from "../utils/firebase.js";
import {Timestamp } from "@firebase/firestore";

//la bitacora pueden ser 3 opciones
// materiaPrima, insumo, productoTerminado


function seleccionarColeccion(bitacora){
    if (bitacora == "materiaPrima"){
        return "BitacoraMateriasPrimas";
    }
    else if (bitacora == "insumo"){
        return "BitacoraInsumos";
    }
    else if (bitacora == "productoTerminado"){
        return "BitacoraProductosTerminados";
    }
}
async function logNew(bitacora, user, item,motivo){
    let coleccion= seleccionarColeccion(bitacora);
    let fecha = Timestamp.fromDate(new Date());
    let log = {
        marcaTiempo: fecha,
        usuario: user,
        item: item,
        motivo: motivo,
    }
    try{
        await firebase.collection(coleccion).add(log)
    }catch (error) {
        console.log(error);
    }

}

async function logDelete(bitacora, user, item, motivo){
    let coleccion= seleccionarColeccion(bitacora);
    let fecha = Timestamp.fromDate(new Date());
    let log = {
        marcaTiempo: fecha,
        usuario: user,
        item: item,
        motivo: motivo,
    }
    try{
        await firebase.collection(coleccion).add(log)
    }catch (error) {
        console.log(error);
    }

}

// motivo depende que se esta este modificando, si se modifica la cantidad de un item 
// debe ser cantidad, si es el nombre o el limite, debe ser propiedades del item
async function logModify(bitacora, user,id, itemAntes,itemDespues, motivo){
    let coleccion;
    if (bitacora == "materiaPrima"){
        coleccion = "BitacoraMateriasPrimas";
    }
    else if (bitacora == "insumo"){
        coleccion = "BitacoraInsumos";
    }
    else if (bitacora == "productoTerminado"){
        coleccion = "BitacoraProductosTerminados";
    }
    let fecha = Timestamp.fromDate(new Date());
    let log = {
        marcaTiempo: fecha,
        usuario: user,
        id:id,
        item: itemAntes,
        itemDespues: itemDespues,
        motivo: motivo,
    }
    try{
        await firebase.collection(coleccion).add(log)
    }catch (error) {
        console.log(error);
    }

}

async function logProduccion(bitacora, user,id, item, motivo){
    let coleccion;
    if (bitacora == "materiaPrima"){
        coleccion = "BitacoraMateriasPrimas";
    }
    else if (bitacora == "insumo"){
        coleccion = "BitacoraInsumos";
    }
    else if (bitacora == "productoTerminado"){
        coleccion = "BitacoraProductosTerminados";
    }
    let fecha = Timestamp.fromDate(new Date());
    let log = {
        marcaTiempo: fecha,
        usuario: user,
        id: id,
        item: item,
        motivo: motivo,
    }
    try{
        await firebase.collection(coleccion).add(log)
    }catch (error) {
        console.log(error);
    }

}
export{logNew,logDelete,logModify,logProduccion}