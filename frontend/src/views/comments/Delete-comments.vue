<template>
    <div class="card-groupomania">
        <h1><b-icon-trash-fill></b-icon-trash-fill> Delete Comment</h1>
        <p>Do you really want delete this comment</p>
        <b-button @click="deleteComment()" variant="danger"><b-icon-trash-fill></b-icon-trash-fill> Delete</b-button>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'Delete-comments',

        mounted: function() {
            this.$store.dispatch('getOneComment', {
                postId: this.$route.params.postId,
                id: this.$route.params.id
            });

            this.$store.dispatch('getUserInfos');
        },

        computed: {
            ...mapState({
                comment: 'comment',
                userInfos: 'userInfos'
            }),
        },

        methods: {
            deleteComment() {
                const self = this;
                this.$store.dispatch('deleteComment', {
                    postId: this.comment.postId,
                    id: this.comment.id,
                })
                .then(function() {
                    self.$router.push(`/post/${self.comment.postId}`);
                }, function(error) {
                    console.log(error);
                });
            }
        }
    }
</script>

<style></style>
