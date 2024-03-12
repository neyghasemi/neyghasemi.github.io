// Enable the WebMidi API and handle any errors if it fails to enable.
// This is necessary to interact with MIDI devices in the web browser.
await WebMidi.enable();

// Initialize variables to store the MIDI input and output devices.
// These will be set based on user selection.
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

// Get HTML elements by their IDs to interact with the webpage.
let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let bpmInput = document.getElementById("bpm");
let quantizationTool = document.getElementById("quantizationTool");

// Initialize an array to store captured MIDI notes and their timestamps.
let recordedNotes = [];
WebMidi.inputs.forEach((input, index) => {
  dropIns.innerHTML += `<option value=${index}>${input.name}</option>`;
});
WebMidi.outputs.forEach((output, index) => {
  dropOuts.innerHTML += `<option value=${index}>${output.name}</option>`;
});

// Function to save MIDI notes
const midiNotes = function (midiMessage) {
  let note = {
    number: midiMessage.note.number,
    velocity: midiMessage.velocity,
    timestamp: WebMidi.time
  };
  recordedNotes.push(note);
};
dropIns.addEventListener("change", function() {
  myInput = WebMidi.inputs[this.value];
  myInput.removeListener();
  myInput.addListener("noteon", "all", captureNote);
});

const playQuantizedNotes = () => {
  let bpm = parseInt(bpmInput.value);
  let quantizationRatio = parseFloat(quantizationSelect.value);
  let beatDuration = (60 / bpm) * 1000;
  let quantizationInterval = beatDuration * quantizationRatio;

  recordedNotes.forEach((note) => {
    let timeSinceStart = note.timestamp - recordedNotes[0].timestamp;
    let quantizedDelay = Math.round(timeSinceStart / quantizationInterval) * quantizationInterval;
    setTimeout(() => {
      myOutput.playNote(note.number, 1, {
        time: WebMidi.time + quantizedDelay,
        velocity: note.velocity
      });
    }, quantizedDelay);
  });
};

dropOuts.addEventListener("change", function() {
  myOutput = WebMidi.outputs[this.value];
});


//the code was developed with the assistance of ChatGPT, coding along with the AI and learning.