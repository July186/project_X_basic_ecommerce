const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");

//menyimpan data
localStorage.setItem("usename", "agus");

//mengambil data
let nama = localStorage.getItem("username");

//hapis
localStorage.clear();
console.log(nama);
