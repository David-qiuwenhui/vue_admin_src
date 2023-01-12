<template>
    <div>
        <Card></Card>
        <Sale></Sale>
        <Observe></Observe>
    </div>
</template>

<script>
import Card from "./card/Card.vue";
import Sale from "./sale/Sale.vue";
import Observe from "./observe/Observe.vue";
export default {
    name: "AppDashboard",
    components: { Card, Sale, Observe },
    mounted() {
        this.$store.dispatch("getData");
    },
};
</script>

<style></style>
