<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner rounded class="bg-purple-8 text-white">
      <p @click="goToPage('/')">Logo</p>
      <template v-slot:action>
        <q-btn
          v-if="hasToken"
          flat
          color="white"
          label="Graphic"
          @click="goToPage('/graphic')"
          :class="{ 'active': $route.name === 'Graphic' }"
          :disabled="$route.name === 'Graphic'"
        />
        <q-btn
          v-if="!hasToken"
          flat
          color="white"
          label="Sign in"
          @click="goToPage('/login')"
        />
        <q-btn
          v-else
          flat
          color="white"
          label="Logout"
          @click="logout"
        />
      </template>
    </q-banner>
  </div>
</template>

<script>
import {defineComponent, computed} from 'vue';
import {useRouter} from "vue-router";
import { useStore } from 'vuex';

export default defineComponent ({
  name: "Navbar",
  setup() {
    const router = useRouter()
    const store = useStore();

    const goToPage = (page) => {
      router.push(page)
    }

    const hasToken = computed(() => store.getters.token);

    const logout = () => {
      store.dispatch('logout');
      router.push('/login')
    }

    return {
      goToPage,
      logout,
      hasToken
    }
  }
})
</script>

<style lang="scss">
 .active {
   opacity: .5;
 }
</style>
