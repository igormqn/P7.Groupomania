<template>
    <div class="card-groupomania">
        <h1><b-icon-trash-fill></b-icon-trash-fill> Delete the account</h1>
        <p>Do you really want ? This action is not reversible...</p>
        <b-button variant="danger" @click="deleteUser()"><b-icon-trash-fill></b-icon-trash-fill> Delete</b-button>
    </div>
</template>

<script>
    export default {
        name: 'Delete-users',

        mounted: function() {
            this.$store.dispatch('getUserInfos');
        },

        methods: {
            deleteUser() {
                const self = this;
                this.$store.dispatch('deleteUser')
                    .then(function() {
                        self.$store.dispatch('logout');
                        self.$router.push('/');
                    }, function(error) {
                        console.log(error);
                    });
            }
        }
    }
</script>

<style></style>
