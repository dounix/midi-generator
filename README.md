# MIDI Generator

This is a Node.js project that generates a random MIDI file with a given scale, phrase length, and note lengths. It uses the `tonal` and `midi-writer-js` packages to generate MIDI notes and write them to a file.

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
./midi-generator-<arch> --scale=<SCALE> --phrase_notes_count=<PHRASE_NOTES_COUNT> --note_lengths=<NOTE_LENGTHS> --min_octave=<MIN_OCTAVE> --max_octave=<MAX_OCTAVE> --file_name=<FILE_NAME>
--note_spread=<NOTE_SPREAD>
```

The following options are available:

- `note_spread`: corresponds to how many notes can potentially sit on top of each other, potentially representing a chord (default: 1)
- `scale`: the scale to use (default: "C major")
- `phrase_notes_count`: the number of notes in each phrase (default: 32)
- `note_lengths`: an array of int note lengths (default: [16])
- `min_octave`: the minimum octave range (default: 1)
- `max_octave`: the maximum octave range (default: 5)
- `file_name`: the name of the MIDI file to generate (default: "<key>-<mode>-midi-file-<current date>.mid")

#### Example

To generate a MIDI file with a C minor scale, a phrase length of 16, and possible note lengths of 2, 4, and 8, use the following command:

```bash
./midi-generator-<arch> --scale="C minor" --phrase_notes_count=16 --note_lengths=2,4,16
```

### Building From Source

#### Initializing The Project

1. Clone the repository.
2. Run `npm install` to install the required packages.
3. Run `npm install --global pkg` to install the `pkg` package for creating an executable.

