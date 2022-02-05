// ====================
// Imports 
// ====================
// const PackageHandler = require("../package-handler/package-handler.js")
// const path = require("path")
// const fs = require("fs-extra")
// const inquirer = require("inquirer")
// const Listr = require("listr")
// const {initGit} = require("../git-handler/git-handler.js")
// const {featureChange} = require("../git-handler/feature-change.js")
// const {componentChange} = require("../git-handler/component-change.js")

import PackageHandler from "../package-handler/package-handler"
import path from 'path'
import fs from "fs-extra"
import inquirer from 'inquirer'
import Listr from 'listr'
import {initGit} from "../git-handler/git-handler"
import {featureChange} from "../git-handler/feature-change"
import {componentChange} from "../git-handler/component-change"

export async function init(options={}){
    const defaultOpts = {
        git: true, 
        gitBranch: true,
        feature: 'new-feature'
    }
    const responses = options.default ? defaultOpts : await promptMissingQuestions(options)
    await setupPackageFile(responses)
    const tasks = new Listr([
        {
            title: "Setting up directories", 
            task: setupDirs
        },
        {
            title: "Updating package.json",
            task: async () => {
                await setupPackageFile(responses)
            }
        },
        {
            title: `Setting up feature: ${responses.feature}`,
            enabled: () =>  responses.feature &&  responses.feature !== "",
            task: async () => {
                await featureChange(responses.feature)
            }
        },
        {
            title: `Setting up component: ${responses.feature}`,
            enabled: () => responses.component && responses.component !== "",
            task: async () => {
                await componentChange(responses.component)
            } 
        },
        {
            title: 'Initalizing Git',
            enabled: () => responses.git,
            task: async () =>{
                await initGit({...responses, devBranch: true})
            } 
        },
    ])
    await tasks.run()
}

async function promptMissingQuestions(options){
    const questions = []
    const {git, gitBranch, origin, feature, component} = options
    questions.push({name: 'git', type: 'confirm', message: "Initalize Git?", when: () =>  git !== undefined})
    questions.push({name: 'origin', message: "What is the remote origin of this git --ignore if not applicable", when: (answers) => answers.git && origin === undefined})
    questions.push({name: 'gitBranch', type: 'confirm', message: 'Auto setup git branches on feature change?', when: (answers) =>  answers.git && gitBranch === undefined})
    questions.push({name: 'feature', message: 'Name of first feature', when: (answers) =>  answers.git && feature === undefined})
    questions.push({name: 'component', message: 'Name of first component', when: (answers) =>  answers.git && component === undefined && answers.feature !== ""})
    const answers =  await inquirer.prompt(questions)
    return {...options, ...answers}
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

export  async function setupDirs(){
    const root = process.cwd()
    const mkPath = (...dir) => path.resolve(root, ...dir)
    const arr = [mkPath("./src/components"), mkPath("./src/features")]
    const src = mkPath("./src")
    await mkdir(src)
    await Promise.all(arr.map(async dir => {await mkdir(dir)}))
    await fs.access(src)
}

async function mkdir(dir){
    try{
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir)
    }

}