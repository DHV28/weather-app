import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// FontAwesome setup — register the component globally so any .vue file can use it
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil, faMagnifyingGlass, faUser, faArrowLeft, faTrash, faRotate, faChevronRight, faCircleXmark, faPlus } from '@fortawesome/free-solid-svg-icons'

// Add only the icons we use (tree-shaking keeps the bundle small)
library.add(faPencil, faMagnifyingGlass, faUser, faArrowLeft, faTrash, faRotate, faChevronRight, faCircleXmark, faPlus)

createApp(App)
  .use(router)
  .component('FontAwesomeIcon', FontAwesomeIcon) // registers <FontAwesomeIcon> everywhere
  .mount('#app')
