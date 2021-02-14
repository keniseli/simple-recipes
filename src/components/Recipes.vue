<template>
  <div>
    <div v-for="(recipe, index) in recipes"
         :key="'recipe' + index"
         class="recipe-list-item">
      {{ recipe.name }}
    </div>
    <div v-if="loading">loading</div>
  </div>
</template>

<script>
import * as fb from '../firebase'

export default {
  name: 'Recipes',
  data() {
    return {
      recipes: [],
      lastLoadedDocument: {},
      loading: false
    }
  },
  methods: {
    loadInitialRecipes() {
      this.loading = true;
      fb.recipes
          .orderBy('created', 'desc')
          .limit(5)
          .get()
          .then(querySnapshot => querySnapshot.docs)
          .then(documents => {
            documents.forEach(recipe => {
              this.recipes.push(recipe.data());
              this.lastLoadedDocument = recipe;
            });
          });
      this.loading = false;
    },
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          this.loading = true;
          fb.recipes
              .orderBy('created', 'desc')
              .startAfter(this.lastLoadedDocument)
              .limit(1)
              .get()
              .then(querySnapshot => querySnapshot.docs)
              .then(documents => {
                documents.forEach(recipe => {
                  this.recipes.push(recipe.data());
                  this.lastLoadedDocument = recipe;
                });
              });
          this.loading = false;
        }
      };
    }
  },
  beforeMount() {
    console.log('before mount');
    this.loadInitialRecipes();
  },
  mounted() {
    this.scroll();
  },
  props: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recipe-list-item {
  height: 30vh;
  border: 1px solid lightgray;
}
</style>
