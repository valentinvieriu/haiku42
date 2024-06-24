<template>
    <div>
        <h1>An error has occured</h1>
        <p>{{ errorMessage }}</p>
        <p>Error Type: {{ errorType }}</p>
    </div>
</template>

<script>
export default {
    props: {
        errorMessage: {
            type: String,
            required: true
        },
        errorType: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
/* Add your custom styles here */
</style>