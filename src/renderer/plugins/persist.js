import VuexPersistence from 'vuex-persist'
export default ({ store }) => {
  new VuexPersistence({
   reducer: (state) => ({
    // keychain: state.keychain,
    theme : state.theme
  }),
    /* your options */
 }).plugin(store);
}