<template>
  <navbar v-if="$route.name !== 'Login'"/>
  <router-view/>
</template>
<script>
import Navbar from "@/components/Navbar";
export default {
  components: {Navbar}
}
</script>
