// ====================
// Imports 
// ====================
const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
const fs = require("fs-extra")
const inquirer = require("inquirer")
const Listr = require("listr")
const {initGit} = require("../git-handler/git-handler.js")

module.exports =  async function init(options){
    const responses = await promptMissingQuestions(options)
    await setupPackageFile(responses)
    const tasks = new Listr([
        {
            title: "Setting up directories", 
            task: async () => {
                await setupDirs()
            }
        },
        {
            title: "Updating package.json",
            task: async () => {
                await setupPackageFile(responses)
            }
        },
        {
            title: 'Initalizing Git',
            enabled: () => responses.git,
            task: async () =>{
                await initGit({...responses, devBranch: true})
            } 
        },
        {
            title: `Setting up feature: ${responses.feature}`,
            enabled: () =>  responses.feature &&  responses.feature !== "",
            task: async () => {
                await newFeature(responses.feature)
            }
        },
        {
            title: `Setting up component: ${responses.feature}`,
            enabled: () => responses.component && responses.component !== "",
            task: async () => {
                await newComponent(responses.component)
            } 
        }
    ])
}

async function promptMissingQuestions(options){
    const questions = []
    const {git, gitBranch, origin, feature, component} = options
    questions.push({name: 'git', type: 'confirm', message: "Initalize Git?", when: () =>  git !== undefined})
    questions.push({name: 'origin', message: "What is the remote origin of this git --ignore if not applicable", when: (answers) => answers.git && origin === undefined})
    questions.push({name: 'gitBranch', type: 'confirm', message: 'Auto setup git branches on feature change?', when: (answers) =>  answers.git && gitBranch === undefined})
    questions.push({name: 'feature', message: 'Name of first feature', when: (answers) =>  answers.git && feature === undefined})
    questions.push({name: 'component', message: 'Name of first component', when: (answers) =>  answers.git && component === undefined && answers.feature !== ""})
    const answers =  await askQuestions(questions)
    return {...options, ...answers}
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

export async function setupDirs(){
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
        await fs.mkdir(dir)
    }

}