<template>
  <form @submit.prevent="onSubmit" class="login q-pa-md">
    <h3>Login page</h3>
    <div
      class="q-gutter-md"
      style="max-width: 600px;
      margin-bottom: 15px"
    >
      <q-input
        v-model="text"
        label="Login"
      />
    </div>
    <q-btn
      color="purple"
      label="Sign in"
      type="submit"
      style="margin-bottom: 15px"
    />
    <a
      class="login__link"
      href=""
      @click.prevent="$router.push('/')"
    >
      To home page
    </a>
  </form>
</template>

<script>
import {defineComponent, ref} from 'vue';
import { useStore } from 'vuex';
import {useRouter} from "vue-router";

export default defineComponent ({
  name: "Login",
  setup() {
    const text = ref('')
    const store = useStore();
    const router = useRouter()

    const onSubmit = () => {
      if(text.value) {
        store.dispatch('login');
        router.push('/graphic')
      }
    }

    return {
      text,
      onSubmit
    }
  }
})
</script>

<style scoped lang="scss">
  .login{
    max-width: 600px;
    margin: auto;

    &__link {
      display: block;
      text-decoration: none;
      color: #000;
    }
  }
</style>
