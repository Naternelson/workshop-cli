import { getName } from "../commands/package-helper";
import path from 'path'

//filepath should list component name and filename
//eg "/component/index.js"

export default async function wsRequire(filepath, exports){
    const currentName = await getName()
    
}