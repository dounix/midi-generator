const { Scale } = require("tonal");
const MidiWriter = require('midi-writer-js');
const fs = require('fs');
const yargs = require('yargs');
const hideBin = require('yargs/helpers').hideBin;

// get command line arguments
const argv = yargs(hideBin(process.argv)).argv

// get current date
const date = new Date();
const dateStr = date.toISOString()

// corresponds to how many notes can potentially sit on top of each other, potentially representing a chord
const noteSpread = argv.note_spread || 1;

// set phrase count
const phraseCount = argv.phrase_count || 1;
console.log(`phrase count: ${phraseCount}`)

// set phrase length
const phraseNotesCount = argv.phrase_notes_count || 32;
console.log(`phrase notes count: ${phraseNotesCount}`)

// set note lengths
const noteLengths = [(argv.note_lengths || "16")].map(l => `${l}`)
console.log(`note lengths: ${noteLengths}`)

// set octave range
const minOctave = argv.min_octave || 1;
console.log(`min octave: ${minOctave}`)
const maxOctave = argv.max_octave || 5;
console.log(`max octave: ${maxOctave}`)

// set key and mode
const key = argv.key || "C";
const mode = argv.mode || "major";

// set scale
const scale = `${key} ${mode}`
console.log(`scale: ${scale}`)

// get range of notes in a scale
const range = Scale.rangeOf(scale);

// get a range of notes of the scale
const keyRange = range(`${key}${minOctave}`, `${key}${maxOctave}`)
console.log(`key range: ${keyRange}`)

// set file name
const fileName = argv.file_name || `${key}-${mode}-midi-file-${dateStr}.mid`
// set output path
let outputPath = argv.output_path || './'

// function that returns random slice from an array with a min and max length
const randomSlice = (arr, min = 1, max = noteSpread) => {
    const len = Math.floor(Math.random() * (max - min + 1)) + min;
    const start = Math.floor(Math.random() * (arr.length - len + 1));
    return arr.slice(start, start + len);
};

// function that returns a random note from a range
const randomNote = (range) => {
    const note = randomSlice(range);
    return note;
};

// initialize a new midi track
const track = new MidiWriter.Track();

// generate a beat
function generateBeat() {
    let beat = []
    for (let i = 0; i < phraseNotesCount; i++) {
        beat.push(randomNote(keyRange))
    }
    return beat
}

// randomly generate a duration for midi writer
const randomDuration = () => {
    const duration = noteLengths[Math.floor(Math.random() * noteLengths.length)]
    return duration
}

for (let i = 0; i < phraseCount; i++) {
    generateBeat().forEach((note) => {
        let duration = randomDuration()
        track.addEvent(
            new MidiWriter.NoteEvent({
                pitch: note,
                duration: duration,
            })
        );
    }
    )
}
// add notes to the track

// check if the last character is /, if not, add it
if (outputPath.charAt(outputPath.length - 1) !== '/') {
    outputPath = outputPath + '/'
}

const p = `${outputPath}${fileName}`
console.log(`output path: ${p}`)
// build the midi file
let write = new MidiWriter.Writer(track).buildFile()
fs.writeFileSync(p, write, 'binary')

if (fs.existsSync(p)) {
    console.log(`${p} was created`)
} else {
    console.log(`${p} was not created`)
}
