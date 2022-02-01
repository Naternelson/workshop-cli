import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
export default async function list(includes){
    const target = path.resolve(process.cwd(), "./src/components")
    let dirs = await fs.readdir(target)
    if(includes && includes !== ""){
        dirs = dirs.filter(w => w.includes(includes))
    }
    console.log(chalk.cyan("Components:"))
    dirs.forEach(d => {
        console.log(`\t${chalk.green.bold(d)}`)
    })
}