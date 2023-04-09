const { Scale, Midi } = require("tonal");
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

const bpm = argv.bpm || 120;

// set phrase count
const phraseCount = argv.phrase_count || 1;
console.log(`phrase count: ${phraseCount}`)

// set phrase length
const phraseNotesCount = argv.phrase_notes_count || 32;
console.log(`phrase notes count: ${phraseNotesCount}`)

// set note lengths
const noteLengths = [(argv.note_durations || "16")].map(l => `${l}`)
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

const generateMidiStream = argv.generate_midi_stream || false;

var easymidi = require('easymidi');

var outputs = easymidi.getOutputs();

let output = new easymidi.Output(outputs[0]);

async function sendMidi(notes, velocity = 127, channel = 1) {
  for (note of notes) {
    console.log(note)
    output.send('noteon', {
      note: note,
      velocity: velocity,
      channel: channel
    });
  }
}

// function that sets a repeat interval for a function based off of a bpm and note length
const setRepeatInterval = (fn, bpm, noteLength) => {
  const interval = (1000 * 60) / bpm
  console.log(interval)
  setInterval(fn, interval)
}

// function that creates randomly sized smaller arrays that fluctuate in length between 1 and the noteSpread value
function randomIndex(items) {
  let note = items[items.length * Math.random() | 0];
  let midiNote = Midi.toMidi(note)

  let obj = { note, midiNote }
  return obj
}

// function that returns a random note from a range
const randomNote = (range) => {
  let notes = []
  let midiNotes = []
  // variable that sets to a random value between 1 and the noteSpread value
  const ns = Math.floor(Math.random() * (noteSpread - 1 + 1)) + 1;
  // loop through the noteSpread value and push a random note to the notes array
  for (let i = 0; i < ns; i++) {
    let res = randomIndex(range)
    let note = res['notes']
    let midi = res['midiNote']
    notes.push(note)
    midiNotes.push(midi)
  }
  return { notes, midiNotes };
};

// initialize a new midi track
const track = new MidiWriter.Track();

// generate a beat
function generateBeat() {
  let beat = []
  for (let i = 0; i < phraseNotesCount; i++) {
    let randomNotes = randomNote(keyRange)
    let notes = randomNotes['notes']
    let midiNotes = randomNotes['midiNotes']
    beat.push(notes)
  }
  return beat
}

function streamMidi() {
  let beat = []
  setRepeatInterval(() => {
    let randomNotes = randomNote(keyRange)
    let notes = randomNotes['notes']
    let midiNotes = randomNotes['midiNotes']

    sendMidi(midiNotes)
  }, bpm, 1)
  return beat
}
// randomly generate a duration for midi writer
const randomDuration = () => {
  const duration = noteLengths[Math.floor(Math.random() * noteLengths.length)]
  return duration
}

if (generateMidiStream == "true") {
  // function to continuously call sendMidi to generate a stream of midi notes
  // need to figure out how to call this function continuously until ctrl+c is pressed
  streamMidi()
} else {
  // loop through the phrase count and add notes to the track
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
}
// add notes to the track

// check if the last character is /, if not, add it
if (outputPath.charAt(outputPath.length - 1) !== '/') {
  outputPath = outputPath + '/'
}

if (generateMidiStream == "false") {
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
}