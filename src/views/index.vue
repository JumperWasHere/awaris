<script>
export default {
  mounted() {
    if (this.isAuthenticated) {
      this.$router.push({ name: "dashboard" });
    } else {
      this.$router.push({ name: "login" });
    }
  },
};
</script>

<template>
  <div></div>
</template>