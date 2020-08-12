import HelloWorld from "./components/HelloWorld";

const install = function (Vue) {
    Vue.component(HelloWorld.name, HelloWorld)
}

if (window != undefined && window.Vue != undefined) {
    install(window.Vue)
}
