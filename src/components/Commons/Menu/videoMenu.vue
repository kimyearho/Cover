<template>
  <v-menu bottom left>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click.stop="menu()">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-tile v-for="(item, i) in items" :key="i">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: "videoMenu",
  data() {
    return {
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ]
    };
  },
  methods: {
    menu() {
      console.log("메뉴 => ");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>