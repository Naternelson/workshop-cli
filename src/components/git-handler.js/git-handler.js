const {execa} = require('execa')
async function checkGitStatus() {
    try {
        const {stdout} = await execa("git", ["rev-parse", "--is-inside-work-tree"], {
            cwd: process.cwd()
        })
        return stdout === true || stdout === "true"
    } catch {
        false 
    }
}
async function initGit(options){
    await execa("git", ["init"], {cwd: process.cwd()})
    await renameMainBranch()

}

async function setUpstream(branch){
    if(!branch) branch = await getCurrentBranch()
    await execa("git", ["push", "-u", "origin", ""])
}

async function getCurrentBranch(){
    const {stdout} = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"]) 
    if(!stdout.includes("fatal")) return stdout
    return false 
}


async function renameMainBranch(name="main"){
    await execa("git", ["branch", "-M", name], {
        cwd: process.cwd()
    })
}