'use strict';

var obsidian = require('obsidian');

class AudioSetPlugin extends obsidian.Plugin {
    onload() {
        console.log("Audioset plugin loaded");
        this.registerMarkdownCodeBlockProcessor("audioset", (source, el, ctx) => {
            const lines = source.split("\n").map(line => line.trim()).filter(line => line.length > 0);
            let file = "";
            let speed = 1.0;
            let volume = 1.0;
            let start = 0;
            let stop = 0;
            let loop = false;
            // --- Parse block key/value pairs ---
            for (const line of lines) {
                const trimmed = line.trim();
                // ✅ If the line is just "loop", enable loop mode
                if (trimmed.toLowerCase() === "loop") {
                    loop = true;
                    continue;
                }
                const [rawKey, rawValue] = line.split(":").map(s => s.trim());
                if (!rawKey || !rawValue)
                    continue;
                const key = rawKey.toLowerCase();
                if (key === "file")
                    file = rawValue;
                if (key === "speed")
                    speed = parseFloat(rawValue);
                if (key === "volume")
                    volume = parseFloat(rawValue);
                if (key === "start")
                    start = parseTime(rawValue);
                if (key === "stop")
                    stop = parseTime(rawValue);
            }
            if (!file) {
                el.createEl("div", { text: "❌ No file specified in audioset block." });
                return;
            }
            // --- Info panel ---
            const infoPanel = el.createEl("div", { cls: "audioset-info" });
            const infoLines = [];
            if (file)
                infoLines.push(`${getFileNameOnly(file)}`);
            if (speed !== 1.0)
                infoLines.push(`Speed: ${speed}`);
            if (volume !== 1.0)
                infoLines.push(`Volume: ${volume}`);
            if (start > 0)
                infoLines.push(`Start: ${formatTime(start)}`);
            if (stop > 0)
                infoLines.push(`Stop: ${formatTime(stop)}`);
            if (loop)
                infoLines.push(`Loop: ON`);
            if (infoLines.length > 0) {
                infoLines.forEach(line => {
                    infoPanel.createEl("div", { text: line });
                });
            }
            // --- Create audio element ---
            const audio = el.createEl("audio", { attr: { controls: "true" } });
            const abstractFile = this.app.vault.getAbstractFileByPath(file);
            if (!abstractFile) {
                el.createEl("div", { text: `❌ File not found: ${file}` });
                return;
            }
            audio.src = this.app.vault.getResourcePath(abstractFile);
            // --- Apply speed/volume and jump to start ---
            audio.addEventListener("play", () => {
                audio.playbackRate = speed;
                audio.volume = volume;
                if (start > 0) {
                    audio.currentTime = start;
                    console.log(`Jumped to start time: ${start}`);
                }
            });
            // --- Handle stop and loop behavior ---
            audio.addEventListener("timeupdate", () => {
                if (stop > 0 && audio.currentTime >= stop) {
                    if (loop) {
                        audio.currentTime = start > 0 ? start : 0;
                        audio.play();
                    }
                    else {
                        audio.pause();
                        audio.currentTime = start > 0 ? start : 0;
                    }
                    console.log(loop ? `Looped back to start: ${start}` : `Stopped at: ${stop}`);
                }
            });
        });
    }
    onunload() {
        console.log("audioset unloaded");
    }
}
// --- Utility: Parse time string ---
function parseTime(value) {
    // Supports seconds or HH:MM:SS
    if (value.includes(":")) {
        const parts = value.split(":").map(p => parseFloat(p));
        if (parts.length === 2) {
            // MM:SS
            const [minutes, seconds] = parts;
            return minutes * 60 + seconds;
        }
        else if (parts.length === 3) {
            // HH:MM:SS
            const [hours, minutes, seconds] = parts;
            return hours * 3600 + minutes * 60 + seconds;
        }
    }
    return parseFloat(value); // raw seconds
}
// --- Utility: Format seconds into HH:MM:SS ---
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    else {
        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
}
function getFileNameOnly(filePath) {
    return filePath.split(/[\\/]/).pop() || filePath;
}

module.exports = AudioSetPlugin;
