<template>
    <div class="card-groupomania">
        <h1><b-icon-person-plus-fill></b-icon-person-plus-fill> Proceed to registration</h1>

        <b-form @submit.prevent="submitForm" class="form">
            <b-form-group label="Nom" label-for="name">
                <b-form-input
                id="name"
                placeholder="Enter your name"
                type="text"
                autofocus
                v-model="$v.name.$model"
                :class="{ 'is-invalid' : $v.name.$error, 'is-valid' : !$v.name.$invalid }"
                ></b-form-input>
            
                <b-form-invalid-feedback>Name is required</b-form-invalid-feedback>
                <b-form-valid-feedback>The name is valid</b-form-valid-feedback>
            </b-form-group>
        
            <b-form-group label="Email" label-for="email">
                <b-form-input
                id="email"
                placeholder="Enter your email"
                type="email"
                v-model="$v.email.$model"
                :class="{ 'is-invalid' : $v.email.$error, 'is-valid' : !$v.email.$invalid }"
                ></b-form-input>

                <b-form-invalid-feedback>E-mail is required and need to be valid</b-form-invalid-feedback>
                <b-form-valid-feedback>E mail is valid</b-form-valid-feedback>
            </b-form-group>

            <b-form-group label="Password" label-for="password">
                <b-form-input
                id="password"
                placeholder="Enter your password"
                type="password"
                v-model="$v.password.$model"
                :class="{ 'is-invalid' : $v.password.$error, 'is-valid' : !$v.password.$invalid }"
                ></b-form-input>

                <b-form-invalid-feedback>Password need to have 8 or more characters with a mix of letters numbers and symbols</b-form-invalid-feedback>
                <b-form-valid-feedback>The password is valid</b-form-valid-feedback>
            </b-form-group>

            <b-alert v-if="status == 'error_create'" variant="danger" show><b-icon-exclamation-triangle></b-icon-exclamation-triangle> Adresse email déjà utilisée</b-alert>

            <b-button type="submit" variant="primary" :class="{ 'disabled' : invalidateFields }"><b-icon-person-plus-fill></b-icon-person-plus-fill>
                <span v-if="status == 'loading'"> Registering proceed...</span>
                <span v-else> Register</span>
            </b-button>
        </b-form>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { required, email, minLength } from 'vuelidate/lib/validators'
    import { hasNumber, hasLowercaseLetter, hasCapitalcaseLetter } from '../../validators/password'

    export default {
        name: 'Signup-users',

        data() {
            return {
                name: '',
                email: '',
                password: ''
            }
        },

        validations: {
            name: {
                required
            },

            email: {
                required,
                email
            },

            password: {
                required,
                minLength: minLength(8),
                hasNumber,
                hasLowercaseLetter,
                hasCapitalcaseLetter
            }
        },

        computed: {
            ...mapState({
                status: 'status'
            }),

            invalidateFields: function() {
                if (this.$v.$invalid) {
                    return true
                } else {
                    return false
                }
            }
        },

        methods: {
            login() {
                const self = this;
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password
                }).then(function() {
                    self.$router.push('/posts')
                    self.$store.dispatch('getUserInfos');
                }, function(error) {
                    console.log(error);
                });
            },

            submitForm() {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    const self = this;
                    this.$store.dispatch('createAccount', {
                        name: this.name,
                        email: this.email,
                        password: this.password
                    }).then(function() {
                        // Après l'inscription, se connecter immédiatement
                        self.login();
                    }, function(error) {
                        console.log(error);
                    })
                }
            }
        }
    }
</script>

<style></style>
