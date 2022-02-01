#! /usr/bin/env node
import {program} from 'commander'
import init from './commands/init.js'
import save from './commands/save.js'
import rename from './commands/rename.js';
import newWs from './commands/new.js';
import open , {reset} from './commands/open.js';
import remove from "./commands/delete.js"
import list from "./commands/list.js"
import {execa} from 'execa';
program 
    .command("init")
    .description("Setup environment in project for workshop")
    .option("-ng, --no-git", "do not automatically commit to git ")
    .option("-nb, --no-branch", "do not create a new branch for a workshop")
    .action(init)

program 
    .command("save")
    .description("Save current workshop to components")
    .argument('[name]', "name of this component to save as, json file will be generated to save this component in the future")
    .action(save)

program 
    .command("rename")
    .description("rename current workshop")
    .argument('<name>', "name of this component")
    .action(rename)

program 
    .command("new")
    .description("create a new component")
    .option('-f, --no-save', "don't save current workshop")
    .argument('<name>', "name of this component")
    .action(newWs)

program 
    .command("open")
    .description("pull an existing component to the workshop")
    .option('-f, --no-save', "don't save current workshop")
    .argument('<name>', "name of this component")
    .action(open)

program 
    .command("reset")
    .description("clear the workshop to default setting")
    .option('-f, --no-save', "don't save current workshop")
    .action(reset)

program 
    .command("delete")
    .description("delete a component")
    .argument('[name]', "name of this component")
    .action(remove)

program 
    .command("list")
    .description("list all saved components")
    .argument('[includes]', "filter components")
    .action(list)

program 
    .command("test")
    .action(async ()=>{
        const child = await execa("git", ["add", "."], {
            cwd: process.cwd(),
        })
        const otherChild = await execa("git", ["commit", "-m", "'Test message'"], {
            cwd: process.cwd()
        })
    })

program.parse()



