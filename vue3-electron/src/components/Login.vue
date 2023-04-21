<template>
    <v-window v-model="step">
        <v-window-item :value="1">
            <!--VISTA INICIO DE SECIÓN-->
            <div class="login">
                <v-col cols="12" md="8">
                    <!--FORMULARIO INICIO DE SESIÓN-->
                    <div class="formulario">
                        <v-card-text class="mt-12">
                            <h1 class="text-center display-2 blue--text text--darken-1 pb-8">Iniciar sesión</h1>
                            <v-form>
                                <v-text-field label="Correo electrónico" v-model="inicioSesion.email" type="text"
                                    color="blue darken-1" :error-messages="emailInicioErrors" required
                                    @input="$v.inicioSesion.email.$touch()" @blur="$v.inicioSesion.email.$touch()" />

                                <v-text-field id="password" label="Contraseña" v-model="inicioSesion.password"
                                    type="password" color="blue darken-1" :error-messages="passwordInicioErrors"
                                    required @input="$v.inicioSesion.password.$touch()"
                                    @blur="$v.inicioSesion.password.$touch()" />
                            </v-form>
                        </v-card-text>
                        <div class="text-center mt-3">
                            <v-btn type="submit" rounded color="blue darken-1" dark @click="iniciarSesion()">Iniciar
                                sesión</v-btn>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="4" class="blue darken-1">
                    <!--BOTÓN CAMBIO DE VISTA A REGISTRO-->
                    <div class="opcion">
                        <v-card-text class="white--text mt-12">
                            <h1 class="text-center display-1 pb-3">¿No tienes cuenta?</h1>
                            <h5 class="text-center">Registra tus datos</h5>
                        </v-card-text>
                        <div class="text-center">
                            <v-btn rounded outlined dark @click="step++">Registrate</v-btn>
                        </div>
                    </div>
                </v-col>

            </div>
        </v-window-item>
        <v-window-item :value="2">
            <!--VISTA REGISTRO DE CUENTA-->
            <div class="login">
                <v-col cols="12" md="4" class="blue darken-1">
                    <!--BOTÓN CAMBIO DE VISTA A INICIO DE SESIÓN-->
                    <div class="opcion">
                        <v-card-text class="white--text mt-12">
                            <h1 class="text-center display-1 pbb-1">¿Ya tienes cuenta?</h1>
                        </v-card-text>
                        <div class="text-center">
                            <v-btn rounded outlined dark @click="step--">Iniciar sesión</v-btn>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12" md="8">
                    <!--FORMULARIO REGISTRO DE SESIÓN-->
                    <div class="formulario">
                        <v-card-text class="mt-12">
                            <h1 class="text-center display-2 blue--text text--darken-1 pb-8">Registra tu cuenta</h1>
                            <v-form>
                                <v-text-field :error-messages="nombreErrors" label="Nombre" required
                                    @input="$v.nombre.$touch()" @blur="$v.nombre.$touch()" v-model="nombre" type="text"
                                    color="blue darken-1" />
                                <v-text-field :error-messages="apellidoErrors" label="Apellido" required
                                    @input="$v.apellido.$touch()" @blur="$v.apellido.$touch()" v-model="apellido"
                                    type="text" color="blue darken-1" />
                                <v-text-field :error-messages="rutErrors" label="rut" required @input="$v.rut.$touch()"
                                    @blur="$v.rut.$touch()" v-model="rut" type="text" color="blue darken-1" />
                                <v-text-field :error-messages="correoErrors" v-model="email" type="text" label="E-mail"
                                    required @input="$v.email.$touch()" @blur="$v.email.$touch()"
                                    color="blue darken-1" />

                                <v-text-field :error-messages="passwordErrors" v-model="password" label="Contraseña"
                                    required @input="$v.password.$touch()" @blur="$v.password.$touch()" type="password"
                                    color="blue darken-1" />
                            </v-form>
                        </v-card-text>
                        <div class="text-center mt-4">
                            <v-btn type="submit" rounded color="blue darken-1" dark
                                @click="registro()">Registrate</v-btn>
                        </div>
                    </div>
                </v-col>
            </div>
        </v-window-item>
    </v-window>



</template>
  
<script>
//SE REALIZAN IMPORTACIONES NECESARIAS
import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'
import ChileanRutify from 'chilean-rutify';
import { auth } from '../utils/firebase';
import firebase from "../utils/firebase.js";
import router from '@/router';
const dbU = firebase.collection("Usuarios");
export default {
    //VARIABLES ASOCIADAS A LA VISTA
    name: 'Login',
    data: () => ({
        inicioSesion: {
            email: '',
            password: ''
        },
        nombre: '',
        apellido: '',
        rut: '',
        email: '',
        password: '',
        acceder: true,
        step: 1,

    }),
    mixins: [validationMixin],
    validations: {
        nombre: { required },
        apellido: { required },
        rut: { required },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        inicioSesion: {
            email: { required, email },
            password: { required, minLength: minLength(6) },
        }

    },
    computed: {
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        emailInicioErrors() {
            const errors = []
            if (!this.$v.inicioSesion.email.$dirty) return errors
            !this.$v.inicioSesion.email.email && errors.push('Correo no valido')
            !this.$v.inicioSesion.email.required && errors.push('Correo es requerido')
            return errors
        },
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        passwordInicioErrors() {
            const errors = []
            if (!this.$v.inicioSesion.password.$dirty) return errors
            !this.$v.inicioSesion.password.required && errors.push('Password es requerido')
            !this.$v.inicioSesion.password.minLength && errors.push('Recuerde que el largo de su contraseña debe contener como minimo 6 caracteres')
            return errors
        },
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        nombreErrors() {
            const errors = []

            if (!this.$v.nombre.$dirty) return errors
            !this.$v.nombre.required && errors.push('Nombre es requerido.')
            return errors
        },
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        apellidoErrors() {
            const errors = []
            if (!this.$v.apellido.$dirty) return errors
            !this.$v.apellido.required && errors.push('apellido es requerido')
            return errors
        },
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        rutErrors() {
            const errors = []
            if (!this.$v.rut.$dirty) return errors
            !ChileanRutify.validRut(this.$v.rut.$model) && errors.push('rut no es valido')
            !this.$v.rut.required && errors.push('rut es requerido')
            return errors
        },
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        correoErrors() {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.email && errors.push('Correo no valido')
            !this.$v.email.required && errors.push('Correo es requerido')
            return errors
        },
        //descripción: verifica que los campos
        //entradas: no hay entradas
        //salidas: const (errors)
        passwordErrors() {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.required && errors.push('Password es requerido')
            !this.$v.password.minLength && errors.push('El largo de su contraseña debe como minimo 6 caracteres')
            return errors
        },
    },

    mounted() {
        //this.recargar('/')
    },
    created() {
        this.recargar('/')
    },
    methods: {
        recargar(ruta) {
            return router.push(ruta);
        },
        //descripción: realiza el inicio de sesión
        //entradas: no hay entradas
        //salidas: no hay salidas
        async iniciarSesion() {
            try {
                if (!this.checkFieldsInicio()) {
                    return;
                }
                try {
                    //Login
                    const usuario = await auth.signInWithEmailAndPassword(this.inicioSesion.email, this.inicioSesion.password);
                    await router.push('/');

                    this.inicioSesion.email = '';
                    this.inicioSesion.password = '';
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
                console.log(error)
            }
        },
        //descripción: realiza el registro del usuario
        //entradas: no hay entradas
        //salidas: no hay salidas
        async registro() {
            try {
                if (!this.checkFields()) {
                    return;
                }
                try {
                    //Registrar
                    const usuario = await auth.createUserWithEmailAndPassword(this.email, this.password);
                    await dbU.add({
                        Nombre: this.nombre,
                        Apellido: this.apellido,
                        Rut: this.rut,
                        Email: this.email
                    })
                    await router.push('/');
                    alert("Se ha registrado con exito.")
                    this.nombre = '';
                    this.apellido = '';
                    this.rut = '';
                    this.email = '';
                    this.password = '';
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
                console.log(error)
            }
        },
        //descripción: verifica que los campos se encuentren llenados de manera correcta
        //entradas: no hay entradas
        //salidas: booleano
        checkFieldsInicio() {
            if (this.emailInicioErrors.length > 0) {
                alert("Debes ingresar el correo correctamente");
                return false;

            }
            if (this.passwordInicioErrors.length > 0) {
                alert("Debes ingresar contraseña correctamente");
                return false;
            }
            if (this.inicioSesion.email == '' || this.inicioSesion.password == '') {
                alert("Faltan parametros por añadir");
                return false;
            }
            return true;
        },
        //descripción: verifica que los campos se encuentren llenados de manera correcta
        //entradas: no hay entradas
        //salidas: booleano
        checkFields() {
            if (this.nombreErrors.length > 0) {
                alert("Debes agregar el nombre!");
                return false;

            }
            if (this.apellidoErrors.length > 0) {
                alert("Debes agregar el apellido!");
                return false;

            }
            if (this.rutErrors.length > 0) {
                alert("Debes agregar el rut correctamente");
                return false;

            }
            if (this.correoErrors.length > 0) {
                alert("Debes agregar el email correcto!");
                return false;

            }
            if (this.passwordErrors.length > 0) {
                alert("Debes agregar una contraseña con un largo mayor a 6");
                return false;

            }
            if (this.nombre == '' || this.apellido == '' || this.rut == '' && this.email == '' || this.password == '') {
                alert("Faltan parametros por añadir");
                return false;
            }
            return true;
        },
    },

}
</script>

<style scoped>
.login {
    width: 100%;
    display: flex;
    overflow: auto;
    height: 100vh;
    flex-direction: row;

}

.formulario {
    padding-right: 250px;
    padding-left: 250px;
    padding-top: 100px;
}

.opcion {
    padding-top: 200px;
}
</style>
