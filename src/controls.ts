import { executeScript } from "./osascript";

export interface Track {
    artist: string,
    album: string,
    name: string,
    id: number,
    duration: number,
    loved: boolean,
    composer: string,
    genre: string,
    date_added: string,
    track_number: number,
    track_count: number,
    disc_number: number,
    disc_count: number,
    year: number,
    size: number,
    media_kind: string,
    played_count: number,
    played_date: string,
    artwork?: boolean,
    artwork_format?: boolean
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
    const text = await executeScript(`use AppleScript version "2.4" -- Yosemite (10.10) or later
use scripting additions
use framework "Foundation"

property NSJSONSerialization : a reference to current application's NSJSONSerialization

tell application "Music"
    set t to file track id ${id}
    set d to {artwork_format: false, |artwork|: false, |id|:id of t, |name|:name of t, |artist|:artist of t, |album|:album of t, |duration|:duration of t, |loved|:loved of t, |composer|:composer of t, |genre|:genre of t, |date_added|:date added of t as «class isot» as string, |track_number|:track number of t, |track_count|:track count of t, |disc_number|:disc number of t, |disc_count|:disc count of t, |year|:year of t, |size|:size of t, |media_kind|:media kind of t as string, |played_count|:played count of t, |played_date|:played date of t as «class isot» as string}

    try
        set artwork_format of d to format of artwork 1 of t as string
        set |artwork| of d to my save_artwork(data of artwork 1 of t, album of t, format of artwork 1 of t) as text
    end try

    set ca to current application
    
    set j to NSJSONSerialization's dataWithJSONObject:d options:0 |error|:(missing value)
    set s to (ca's NSString's alloc()'s initWithData:j encoding:(ca's NSUTF8StringEncoding)) as text
    get s
end tell

on save_artwork(d, album, format)
    set format_parts to words of (format as string)
    set hash to (do shell script "echo '" & album & "' | openssl sha1")
    
    set a to "/tmp/" & hash & "." & (text 1 of format_parts)
    set targetFile to POSIX path of a
    
    try
        set f to open for access targetFile with write permission
        set eof f to 0
        write d to f
        close access f
    on error
        close access f
    end try
    
    return targetFile
end save_artwork`);
    return JSON.parse(text);
}

export async function get_next_track(forward = 1): Promise<Track> {
    const text = await executeScript(`use AppleScript version "2.4" -- Yosemite (10.10) or later
use scripting additions
use framework "Foundation"

property NSJSONSerialization : a reference to current application's NSJSONSerialization

tell application "Music"
    set current to current track
    set t to track 1 of (tracks of current playlist whose index is equal to index of current + ${forward})
    set d to {artwork_format: false, |artwork|: false, |id|:id of t, |name|:name of t, |artist|:artist of t, |album|:album of t, |duration|:duration of t, |loved|:loved of t, |composer|:composer of t, |genre|:genre of t, |date_added|:date added of t as «class isot» as string, |track_number|:track number of t, |track_count|:track count of t, |disc_number|:disc number of t, |disc_count|:disc count of t, |year|:year of t, |size|:size of t, |media_kind|:media kind of t as string, |played_count|:played count of t, |played_date|:played date of t as «class isot» as string}

    try
        set artwork_format of d to format of artwork 1 of t as string
        set |artwork| of d to my save_artwork(data of artwork 1 of t, album of t, format of artwork 1 of t) as text
    end try

	set ca to current application
	
	set j to NSJSONSerialization's dataWithJSONObject:d options:0 |error|:(missing value)
	set s to (ca's NSString's alloc()'s initWithData:j encoding:(ca's NSUTF8StringEncoding)) as text
	get s
end tell

on save_artwork(d, album, format)
	set format_parts to words of (format as string)
    set hash to (do shell script "echo '" & album & "' | openssl sha1")
	
	set a to "/tmp/" & hash & "." & (text 1 of format_parts)
	set targetFile to POSIX path of a
	
	try
		set f to open for access targetFile with write permission
		set eof f to 0
		write d to f
		close access f
	on error
		close access f
	end try
	
	return targetFile
end save_artwork
`);
    return JSON.parse(text);

}