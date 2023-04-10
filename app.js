const { Scale, Midi } = require("tonal");
const MidiWriter = require('midi-writer-js');
const fs = require('fs');
const yargs = require('yargs');
const hideBin = require('yargs/helpers').hideBin;


const argv = yargs(hideBin(process.argv)).argv

// get current date
const date = new Date();
const dateStr = date.toISOString()

// corresponds to how many notes can potentially sit on top of each other, potentially representing a chord
const noteSpread = argv.note_spread || 1;

// set bpm
const bpm = argv.bpm || 120;
console.log(`bpm: ${bpm}`)

// set phrase count
const phraseCount = argv.phrase_count || 1;
console.log(`phrase count: ${phraseCount}`)

const velocity = 127
const channel = 1

// set phrase length
const phraseNotesCount = argv.phrase_notes_count || 32;
console.log(`phrase notes count: ${phraseNotesCount}`)

// set note lengths
const noteLengths = [(argv.note_durations || "16")].map(l => `${l}`)
console.log(`note lengths: ${noteLengths}`)


function getNotesPerBeat(noteDuration) {
  switch (noteDuration) {
    // whole note
    case "1":
      return 0.25
    // half note
    case "2":
      return 0.5
    // dotted half note
    case "d2":
      return 0.875
    // quarter note
    case "4":
      return 1
    // triplet quarter note
    case "4t":
      return 1.5
    // dotted quarter note
    case "d4":
      return 1.5
    case "dd4":
      return 1.75
    // eighth note
    case "8":
      return 2
    // triplet eighth note
    case "8t":
      return 3
    // dotted eighth note
    case "d8":
      return 3
    case "dd8":
      return 3.5
    // sixteenth note
    case "16":
      return 4
    // triplet sixteenth note
    case "16t":
      return 6
    // thirty-second note
    case "32":
      return 8
    // sixty-fourth note
    case "64":
      return 16
  }
}
// get command line arguments

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

const generateMidiStream = argv.generate_midi_stream || "false";

var easymidi = require('easymidi');

var output = new easymidi.Output('midi-generator', true);

// function that sends midi notes
async function sendMidi(notes, velocity = 127, channel = 1, interval) {
  console.log(`midi => ${[notes]}`)
  output.send('clock');
  for (note of notes) {
    output.send('noteon', {
      note: note,
      velocity: velocity,
      channel: channel
    });
    setInterval(() => {
      output.send('noteoff', {
        note: note,
        velocity: velocity,
        channel: channel
      });
    }, interval)
  }
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
const track = new MidiWriter.Track()
track.setTempo(bpm)

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

// randomly generate a duration for midi writer
const randomDuration = () => {
  const duration = noteLengths[Math.floor(Math.random() * noteLengths.length)]
  return duration
}

// function that generates a stream of midi notes
function streamMidi() {
  // get a random duration
  let duration = randomDuration()
  // get the number of notes per beat
  let subdivision = getNotesPerBeat(duration)
  // calculate the interval between notes
  const interval = (1000 * 60) / (bpm * subdivision) // get note frequency in ms
  setInterval(() => {
    // get a range of random notes
    let randomNotes = randomNote(keyRange)
    // get the notes midi data
    let midiNotes = randomNotes['midiNotes']
    // send the midi notes
    sendMidi(midiNotes, velocity, channel, interval)
  }, interval)
}


// check if the user wants to generate a midi stream
if (generateMidiStream == "true") {
  // function to continuously call sendMidi to generate a stream of midi notes
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

// if not streaming midi, write a midi file
if (generateMidiStream == "false") {
  const p = `${outputPath}${fileName}`

  // build the midi file
  let write = new MidiWriter.Writer(track).buildFile()
  fs.writeFileSync(p, write, 'binary')

  if (fs.existsSync(p)) {
    console.log(`${p} was created`)
  } else {
    console.log(`${p} was not created`)
  }
}