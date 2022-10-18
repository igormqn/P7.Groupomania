<template>
    <div class="card-groupomania">
        <h1 class="Login-title"><b-icon-box-arrow-in-right></b-icon-box-arrow-in-right> Login</h1>

        <b-form @submit.prevent="submitForm" class="form">
            <b-form-group>
                <b-form-input
                placeholder="Email"
                type="email"
                autofocus
                v-model="$v.email.$model"
                :class="{ 'is-invalid' : $v.email.$error, 'is-valid' : !$v.email.$invalid }"
                ></b-form-input>

                <b-form-invalid-feedback>The email required need to be a valid adress</b-form-invalid-feedback>
                <b-form-valid-feedback>Email is valid</b-form-valid-feedback>
            </b-form-group>

            <b-form-group>
                <b-form-input
                placeholder="Password"
                type="password"
                v-model="$v.password.$model"
                :class="{ 'is-invalid' : $v.password.$error, 'is-valid' : !$v.password.$invalid }"
                ></b-form-input>

                <b-form-invalid-feedback>Password need to have 8 or more characters with a mix of letters numbers and symbols</b-form-invalid-feedback>
                <b-form-valid-feedback>Password is valid</b-form-valid-feedback>
            </b-form-group>

            <b-alert v-if="status == 'error_login'" variant="danger" show><b-icon-exclamation-triangle></b-icon-exclamation-triangle> Adresse email et/ou mot de passe invalide</b-alert>

            <b-button type="submit" :class="btn-login"><b-icon-box-arrow-in-right></b-icon-box-arrow-in-right>
                <span v-if="status == 'loading'"> Connection proceed...</span>
                <span v-else> Login</span>
            </b-button>
        </b-form>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { required, email, minLength } from 'vuelidate/lib/validators'
    import { hasNumber, hasLowercaseLetter, hasCapitalcaseLetter } from '../../validators/password'

    export default {
        name: 'Login-users',

        mounted: function() {
            if (this.$store.state.user.userId != -1) {
                this.$router.push('/posts');
                return;
            }
        },

        data() {
            return {
                email: '',
                password: ''
            }
        },

        validations: {
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
            submitForm() {
                this.$v.$touch();

                if (!this.$v.$invalid) {
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
                }
            }
        }
    }
</script>

<style></style>
