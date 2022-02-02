#! /usr/bin/env node
import {program} from 'commander'
import init from "./components/commands/init/init"

program 
    .command("init")
    .description("Setup environment in project for workshop")
    .option("-ng, --no-git", "do not automatically commit to git ")
    .option("-nb, --no-git-branch", "do not create a new branch for a workshop")
    .action(init)
