# AudioSet

**AudioSet** is a lightweight audio player for Obsidian that lets you control playback directly from code blocks.

It allows you to set playback speed, volume, start/end points, and looping — perfect for **playalong practice**, **clipping parts of long recordings**, or **indexing media** without including large files in Obsidian’s search index.

---

## 🪶 Usage

Create a code block with the language `audioset`:

\`\`\`audioset
file: path/to/track.mp3
speed: 0.8
vol: 0.9
start: 0:45
end: 2:30
loop
\`\`\`

The plugin will render an audio player with your chosen settings.
* The path to the file is relative to the vault, without escaping (like %20 for space).

**Supported formats:** any file playable by your browser (MP3, WAV, M4A, OGG, etc.).  
---

## ⚙️ Features
- Adjustable **speed**, **volume**, **start**, **end**, and **loop**
- Parses time as `h:mm:ss`, `m:ss`, or seconds
- Works on any platform
- Respects your active Obsidian theme
- Lightweight — uses native HTML5 `<audio>`

---

## 💡 Example Uses
- Instrumental **practice** with tempo and looping
- Extract and replay **sections from long performances**
- Maintain **media archives** without adding them to vault indexing

---

## 🧩 About
Created by [Andrés Ibarburu](https://github.com/Mowglithecat)

Version 1.0.0  
License: MIT
