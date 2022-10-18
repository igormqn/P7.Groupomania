<template>
    <div class="card-groupomania">
        <h1><b-icon-trash-fill></b-icon-trash-fill> Delete users</h1>
        <p>Do you really want to delete the user</p>
        <b-button variant="danger" @click="deleteUser()"><b-icon-trash-fill></b-icon-trash-fill> Delete</b-button>
    </div>
</template>

<script>
    export default {
        name: 'Delete-admin',

        mounted: function() {
            this.$store.dispatch('getUserInfos');
            this.$store.dispatch('getUserInfosByAdmin', this.$route.params.id);

            if (!this.$store.state.userInfos.isAdmin) {
                this.$router.push('/');
                return;
            }
        },

        methods: {
            deleteUser() {
                const self = this;
                this.$store.dispatch('deleteUserByAdmin')
                    .then(function() {
                        self.$router.push('/admin/users');
                    }, function(error) {
                        console.log(error);
                    });
            }
        }
    }
</script>

<style></style>
