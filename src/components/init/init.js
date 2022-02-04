// ====================
// Imports 
// ====================
const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
const fs = require("fs-extra")
const inquirer = require("inquirer")
const Listr = require("listr")

module.exports =  async function init(options){
    await setupDirs()
    await setupPackageFile(options)
    const responses = await promptMissingQuestions(options)
    const tasks = new Listr([
        {
            title: 'Initalizing Git',
            enabled: () => responses.git,
            task: () => 
        }
    ])
}

async function promptMissingQuestions(options){
    const questions = []
    const keys = ["git", "gitBranch", "feature", "component"]
    const {git, gitBranch, feature, component} = options
    if(!git) questions.push(promptCreator({name: 'git', type: 'confirm', message: "Initalize Git?"}))
    if(!gitBranch) questions.push(promptCreator({name: 'gitBranch', type: 'confirm', message: 'Auto setup git branches on feature change?'}))
    if(!feature) questions.push(promptCreator({name: 'feature', message: 'Name of first feature'}))
    if(!component) questions.push(promptCreator({name: 'component', message: 'Name of first component'}))
    return await askQuestions(questions)
}

function promptCreator(params){
    let {type, name, message, defaultValue, choices, validate, filter, pageSize, prefix, askAnswered, loop, suffix} = params
    switch(type){
        case "list":
            if(!choices) return 
            break 
        case undefined: 
            type = "input"
            break 
    }
    if(!name || !message) return null 
    return {type, name, message, defaultValue, choices, validate, filter, pageSize, prefix, askAnswered, loop, suffix}

}

async function askQuestions(...questions){
    const allowedKeys = ["type", "name", "message", "default", "choices", "validate", "filter", "pageSize", "prefix", "askAnswered", "loop"]
    const filterdQs = questions.reduce((newQuestions, question) => {
        const thisQuestion = {}
        for(let key in question){
            if(allowedKeys.includes(key))thisQuestion[key] = question[key]
        }
        newQuestions.push(thisQuestion)
        return newQuestions
    }, [])
    return  await inquirer(filterdQs)
}


async function setupPackageFile(options){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    const data = await pkg.getData()
    const {git, gitBranch} = options
    const workshopObj = {git, ['git-branch']: gitBranch}
    data.workshop = data.workshop ? {...data.workshop, ...workshopObj} : workshopObj
    pkg.data = data 
    await pkg.save()
}

async function setupDirs(){
    const root = process.cwd()
    const mkPath = (...dir) => path.resolve(root, ...dir)
    const arr = [mkPath("./src/components"), mkPath("./src/features")]

    await mkdir(mkPath("./src"))
    await Promise.all(arr.map(async dir => {await mkdir(dir)}))
}

async function mkdir(dir){
    try{
        await fs.access(dir)
    } catch {
        console.log(dir)
        await fs.mkdir(dir)
    }

}