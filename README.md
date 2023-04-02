# MIDI Generator

This is a Node.js project that generates a random MIDI file with a given scale, phrase length, and note lengths. It uses the [tonal](https://www.npmjs.com/package/tonal) and [midi-writer-js](https://www.npmjs.com/package/midi-writer-js) packages to generate MIDI notes and write them to a file.

## Usage

### Running Via Prebuilt Executable 

#### Download From Latest Release

Download an executable from the latest [release](https://github.com/ammilam/midi-generator/releases/tag/latest).

#### Make Executable

```bash
chmod +x midi-generator-<arch>
```

#### Run The Executable

To run the project, use the following command:

```bash
./midi-generator-<arch> --key=<KEY> --mode=<MODE> --phrase_notes_count=<PHRASE_NOTES_COUNT> --note_lengths=<NOTE_LENGTHS> --min_octave=<MIN_OCTAVE> --max_octave=<MAX_OCTAVE> --file_name=<FILE_NAME>
--note_spread=<NOTE_SPREAD>
```

#### Options

The following options are available as command-line arguments:

- `--note_spread`: This option sets how many notes can potentially sit on top of each other, representing a chord. The default value is 1.
- `--phrase_count`: This option sets how many phrases are in the MIDI file. The default value is 1.
- `--phrase_notes_count`: This option sets the number of notes in each phrase. The default value is 32.
- `--note_lengths`: This option sets the length of the notes in the generated MIDI file. It accepts a comma-separated list of note lengths in fractions of beats. The default value is "16", representing 1/16 of a beat.
- `--min_octave`: This option sets the minimum octave range. The default value is 1.
- `--max_octave`: This option sets the maximum octave range. The default value is 5.
- `--key`: This option sets the key of the scale. The default value is "C".
- `--mode`: This option sets the mode of the scale. The default value is "major".
- `--file_name`: the name of the MIDI file to generate (default: "<key>-<mode>-midi-file-<current date>.mid")
- `--output_path`: the path to output midi files to

#### Duration Parameters

Since this is a wrapper around [midi-writer-js](https://www.npmjs.com/package/midi-writer-js), this application accepts the following duration options:

- 1 : whole
- 2 : half
- d2 : dotted half
- dd2 : double dotted half
- 4 : quarter
- 4t : quarter triplet
- d4 : dotted quarter
- dd4 : double dotted quarter
- 8 : eighth
- 8t : eighth triplet
- d8 : dotted eighth
- dd8 : double dotted eighth
- 16 : sixteenth
- 16t : sixteenth triplet
- 32 : thirty-second
- 64 : sixty-fourth
- Tn : where n is an explicit number of ticks (T128 = 1 beat)


#### Example usage

```bash
./midi-generator-<arch> --note_spread=2 --phrase_count=2 --phrase_notes_count=16 --note_lengths=8,4 --min_octave=2 --max_octave=4 --key=C --mode=minor --file_name="my-midi-file.mid"
```

This will generate a MIDI file with 2 phrases, each phrase in C minor containing 16 notes with a random chord of up to 2 notes, with note lengths of 1/8 or 1/4 of a beat, in a D# minor scale with notes ranging from octave 2 to octave 4, and with the name "my-midi-file.mid".

Note: All arguments are optional. If no option is specified, the default values will be used.


### Building From Source

#### Initializing The Project

1. Clone the repository.
2. Run `npm install` to install the required packages.
3. Run `npm install --global pkg` to install the `pkg` package for creating an executable.

## Dependencies

This tool relies on the following dependencies:

- [tonal](https://www.npmjs.com/package/tonal): A music theory library for Node.js.
- [midi-writer-js](https://www.npmjs.com/package/midi-writer-js): A MIDI file writer library for Node.js.
- fs: A Node.js file system module for reading and writing files.
- [yargs](https://www.npmjs.com/package/yargs): A command line argument parsing library for Node.js.