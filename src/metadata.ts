import { Track } from "./controls"
import { executeScript } from "./osascript"

export interface Metadata {
    state: "playing" | "paused" | "stopped",
    t: Track & {
		volume: number,
		elapsed: number,
		shuffle: boolean,
		artwork: boolean,
		artwork_format: boolean
    },
    isOpen: boolean
}

const metadataScript = `use AppleScript version "2.4" -- Yosemite (10.10) or later
use scripting additions
use framework "Foundation"

property NSJSONSerialization : a reference to current application's NSJSONSerialization

tell application "Music"
	set d to {isOpen:false, state:false, t:false}
	set isOpen of d to (running is true)
	
	if running then
		set state of d to player state as text
		if (player state as text) is not "stopped" then
			set t of d to {|name|:name of current track, |artist|:artist of current track, |album|:album of current track, |duration|:duration of current track, elapsed:player position, volume:sound volume, shuffle:shuffle enabled, |id|:database ID of current track, |loved|:loved of current track, artwork_format:false, |artwork|:false, composer:composer of current track, genre:genre of current track, date_added:date added of current track as «class isot» as string, track_number:track number of current track, track_count:track count of current track, disc_number:disc number of current track, disc_count:disc count of current track, year:year of current track, size:size of current track, media_kind:media kind of current track as string, played_count:played count of current track, played_date:played date of current track as «class isot» as string}
			
            try
				set artwork_format of t of d to format of artwork 1 of current track as string
				set |artwork| of t of d to my save_artwork(data of artwork 1 of current track, album of current track, format of artwork 1 of current track) as text
			end try
		end if
	end if
	
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
end save_artwork`

export async function getMetadata(): Promise<Metadata>{
    const result = await executeScript(metadataScript)
    return JSON.parse(result)
}