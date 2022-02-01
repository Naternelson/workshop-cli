import init from "./init.js";
import reName from "./rename.js";
import save from "./save.js";


export default async function newWorkshop(name, options){
    if(options.save) await save()
    await init({})
    await reName(name)
}