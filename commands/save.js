import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'
import { setupComponents } from './init.js'
import {  getName, rename } from './package-helper.js'
import inquirer from 'inquirer'

// ====================
// Main function
// ====================
export default async function save(name){
    const target =  path.resolve(process.cwd(), "./src")
    let compName = name || await getName(target)
    while (!compName || compName === "null" || compName === "undefined" || compName.trim() === "") {
        const question = {
            type: 'input',
            name: 'name',
            message: 'Current component needs a name to save, what is the name?'
        }
        const response = await inquirer.prompt([question])
        compName = response.name
    }
    await copyComponent(compName, target)
}

// ====================
// Setup Component Folder
// ====================
async function setupComponent(name, root){
    await setupComponents({target: root})
    const target = path.resolve(root, `./components/${name}`)
    try{
        await fs.access(target)
    }catch(err){
        await fs.mkdir(target)
        console.log(`${chalk.blue.bold(target)} generated`)
    }
}

// ====================
// Copying functions
// ====================
async function copyComponent(name, root){
    const target = path.resolve(root, `./components/${name}`)
    await fs.rm(target, { recursive: true, force: true })
    await setupComponent(name, root)
    await rename(name, root)
    await copyUnits(name, root)
    await copyTests(name, root)
    await copyPackage(name, root)
}

async function copyPackage(name, root){
    const target = path.resolve(root, `./components/${name}/package.json`)
    const fp = path.resolve(root, "./workshop/package.json")
    try{
        await fs.access(fp, fs.constants.R_OK)
        await fs.copyFile(fp, target)
        // await fs.copy(fp, target)
        await fs.access(target)
        console.log(`${chalk.blue.bold(name)} package.json file transfered to /components/${name}`)
    } catch (err) {
        console.log(chalk.red.bold(err))
        console.log(`Workshop ${name} package.json failed to transfer`)
        process.exit(1)
    }
}

async function copyTests(name, root){
    const testDir = path.resolve(root, "./workshop/tests")
    const target = path.resolve(root, `./components/${name}`)
    try{
        await fs.access(testDir, fs.constants.R_OK)
        await fs.access(target, fs.constants.R_OK)
        await fs.copy(testDir, target)
        await fs.access(target, fs.constants.R_OK)
        console.log(`${chalk.blue.bold(name)} tests transfered to /components/${name}`)
    } catch (err){
        console.log(chalk.red.bold(err))
        console.log(`Workshop ${name} tests failed to transfer`)
        process.exit(1)
    }
}

async function copyUnits(name, root){
    const testDir = path.resolve(root, "./workshop/units")
    const target = path.resolve(root, `./components/${name}`)
    try{
        await fs.access(testDir, fs.constants.R_OK)
        await fs.access(target, fs.constants.R_OK)
        await fs.copy(testDir, target)
        await fs.access(target, fs.constants.R_OK)
        console.log(`${chalk.blue.bold(name)} units transfered to /components/${name}`)
    } catch (err){
        console.log(chalk.red.bold(err))
        console.log(`Workshop ${name} units failed to transfer`)
        process.exit(1)
    }
}

