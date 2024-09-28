const build_controller =  require("./controllers/build_controller");

setInterval(() => {
    console.log(build_controller.get_zip_URL());
}, 3000);