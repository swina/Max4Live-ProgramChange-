# Program Change Controller + Basic CC#'s (BETA)

## ProgramChangeEmuxController (Beta)

This is a first version of a controller created to manage different EmulatorX3 banks from Ableton.

### Features

- Import and read Banks/Presets from an exported EmulatorX3 export (txt file)
- Organized the banks by Category - Preset

![Program Change UI](https://res.cloudinary.com/moodgiver/image/upload/v1750255446/ProgramChange-1_jkmduf.png)

- Default controls CC# (Volume)[7], (Pan)[10]
- Other controls need to be customized in the device
- Add your preset txt file with Drag&Drop

![ProgramChange add preset file](https://res.cloudinary.com/moodgiver/image/upload/v1750255446/ProgramChange-2_dr7dgx.png)

- Save your presets (up to 48) in the device directly

### Components

- **ProgramChangeEmuxController.amxd** : Max4Live device
- **loader.js** : Javascript file that manage all the features
- **Preset.txt** : Example of EmulatorX3 exported Bank

## Notice

This is a very beta version (and my first M4L device). I am actually testing since 1 month with little changes everytime I find something improvable. 

**Please find some comment in the loader.js file.**


