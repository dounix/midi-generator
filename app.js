import { Interval, Note, Scale, Range } from "tonal";
import MidiWriter from 'midi-writer-js';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv

// get current date
const date = new Date();
const dateStr = date.toISOString()


const fileName = argv.file_name || `midi-file-${dateStr}.mid`

// get command line arguments
const scale = argv.scale || "C major";
console.log(`scale: ${scale}`)

const phraseLength = argv.phrase_length || 32;
console.log(`phrase length: ${phraseLength}`)

const noteLengths = (argv.note_lengths || ["16"]); // this isnt working
console.log(`note lengths: ${noteLengths}`)

const minOctave = argv.min_octave || 1;
console.log(`min octave: ${minOctave}`)
const maxOctave = argv.max_octave || 5;
console.log(`max octave: ${maxOctave}`)

// variable to parse in comma separated list of noteLengths and surround each value with doubel quotes
const [key, mode] = scale.split(" ");


// get range of notes in a scale
const range = Scale.rangeOf(scale);

// get a range of notes of the scale
const keyRange = range(`${key}${minOctave}`, `${key}${maxOctave}`)
console.log(`key range: ${keyRange}`)

// function that returns random slice from an array with a min and max length
const randomSlice = (arr, min = 1, max = 1) => {
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
  for (let i = 0; i < phraseLength; i++) {
    beat.push(randomNote(keyRange))
  }
  return beat
}

// randomly generate a duration for midi writer
const randomDuration = () => {
  const duration = noteLengths[Math.floor(Math.random() * noteLengths.length)]
  return duration
}

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

// build the midi file
let write = new MidiWriter.Writer(track).buildFile()
fs.writeFileSync(fileName, write, 'binary')

if (fs.existsSync(fileName)) {
  console.log(`${fileName} was created`)
} else {
  console.log(`${fileName} was not created`)
}


