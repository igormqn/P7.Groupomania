<template>
    <div class="card-groupomania">
        <h1><b-icon-exclamation-triangle></b-icon-exclamation-triangle> Erreur 404... Page not found</h1>
        <p>Page not found. Return to home page</p>
        <router-link :to="{ name: 'allPosts' }">
            <b-button variant="primary"><b-icon-house-door-fill></b-icon-house-door-fill>  Home</b-button>
        </router-link>
    </div>
</template>

<script>
    export default {}
</script>

<style></style>