const execaMain = require('execa')

// ====================
// Initialization of Git
// ====================
// Initialze new Git Repo, with the option to set the remote origin 
// Renames the master branch to Main
// Creates a branch called DEV where all branch changes will merge to 
// If an initial branch if provided, a new branch will be setup
export async function initGit(options ={devBranch:true}){
    await execa("git", ["init"])
    await renameMainBranch()
    if(options.origin) await execa("git", ["remote", "add", "origin", options.origin])
    if(options.devBranch) await execa("git", ["checkout", "-b", "DEV"])
    await commit({push: true, message: 'Creating DEV Branch'})
    const mergeTo  = options.devBranch ? options.devBranch : "main"
    if(options.branch) await changeBranch(options.branch, mergeTo)
}

// ====================
// Branch Change
// ====================
// Automatically commit, merge back to DEV branch, and create a new branch 
export async function changeBranch(branch, mergeTo= 'DEV'){
    const oldBranch = await getCurrentBranch()
    await commit({push: true, message: `Pausing branch ${oldBranch}`})
    await execa("git", ["checkout", mergeTo])
    await execa("git", ["merge", oldBranch])
    await execa("git", ["checkout", "-b", branch])
    await commit({push: true, message: `Setting up new branch: ${branch}`})
}

// ====================
// Set Upstream orign
// ====================
export async function setUpstream(branch){
    if(!branch) branch = await getCurrentBranch()
    await execa("git", ["push", "-u", "origin", branch])
}

// ====================
// AutoCommit
// ====================
// Automatically add, commit and optionally push to remote repo
// A default message will be commited if no message is provided
export async function commit(options ={push: true}){
    if(await checkGitStatus() === false) return false 
    if(!options.message) {
        const branchName = await getCurrentBranch()
        options.message = `Update to ${branchName}`
    }
    await execa("git", ["add", "."])
    await execa("git", ["commit", "-m", options.message])
    if(options.push){
        await execa("git", ["push"])
    }

}

// ====================
// Helper functions
// ====================

//Some functions use the name of the current branch for commits and changes
async function getCurrentBranch(){
    const {stdout} = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"]) 
    if(!stdout.includes("fatal")) return stdout
    return false 
}


async function renameMainBranch(name="main"){
    await execa("git", ["branch", "-M", name])
}

async function checkGitStatus() {
    try {
        const {stdout} = await execa("git", ["rev-parse", "--is-inside-work-tree"])
        return stdout === true || stdout === "true"
    } catch {
        return false 
    }
}

// Automatically set the cwd to procss.cwd()
const execa = async (file, arguments =[], options ={})=> {
    return await execaMain.execa(file, arguments, {...options, cwd: process.cwd()} )
}