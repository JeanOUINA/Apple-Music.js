import { executeScript } from "./osascript";

export interface Track {
    artist: string,
    album: string,
    name: string,
    id: number,
    duration: number,
    loved: boolean
}

export function launch(){
    return executeScript(`tell application "Music" to launch`);
}
export function activate(){
    return executeScript(`tell application "Music" to activate`);
}
export function pause(){
    return executeScript(`tell application "Music" to pause`);
}
export function play(){
    return executeScript(`tell application "Music" to play`);
}
export function skip(){
    return executeScript(`tell application "Music" to play next track`);
}
export function back(){
    return executeScript(`tell application "Music" to play previous track`);
}
export function love(id:number, loved:boolean){
    return executeScript(`tell application "Music"
    set t to track 1 of (tracks whose id is equal to 3909)
    set loved of t to ${loved}
end`);
}
export async function get_library_tracks(): Promise<Track[]>{
    const text = await executeScript(`const music = Application("Music")

JSON.stringify(music.playlists()[0].tracks().map(track => {
    return {
        artist: track.artist(),
        album: track.album(),
        name: track.name(),
        id: track.id(),
        duration: track.duration(),
        loved: track.loved()
    }
}))`, ["-l", "JavaScript"]);
    return JSON.parse(text);
}
export async function get_track(id:number): Promise<Track>{
    const text = await executeScript(`const music = Application("Music")

const track = music.tracks.byId(${id})
JSON.stringify({
    artist: track.artist(),
    album: track.album(),
    name: track.name(),
    id: track.id(),
    duration: track.duration(),
    loved: track.loved()
})`, ["-l", "JavaScript"]);
    return JSON.parse(text);
}