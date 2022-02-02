import {execa} from 'execa'
export async function updateGit(message){
    
}

export async function getBranch(){
    return await execa("git", [])
}