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
    set t to track 1 of (tracks whose id is equal to ${id})
    set loved of t to ${loved}
end`);
}
export async function get_library_tracks(): Promise<Track[]>{
    const text = await executeScript(`const music = Application("Music")

JSON.stringify(music.tracks().map(track => {
    return {
        artist: track.artist(),
        album: track.album(),
        name: track.name(),
        id: track.id(),
        duration: track.duration(),
        loved: track.loved(),
        composer: track.composer(),
        genre: track.genre(),
        date_added: track.dateAdded(),
        track_number: track.trackNumber(),
        track_count: track.trackCount(),
        disc_number: track.discNumber(),
        disc_count: track.discCount(),
        year: track.year(),
        size: track.size(),
        media_kind: track.mediaKind(),
        played_count: track.playedCount(),
        played_date: track.playedDate()
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
    loved: track.loved(),
    composer: track.composer(),
    genre: track.genre(),
    date_added: track.dateAdded(),
    track_number: track.trackNumber(),
    track_count: track.trackCount(),
    disc_number: track.discNumber(),
    disc_count: track.discCount(),
    year: track.year(),
    size: track.size(),
    media_kind: track.mediaKind(),
    played_count: track.playedCount(),
    played_date: track.playedDate()
})`, ["-l", "JavaScript"]);
    return JSON.parse(text);
}