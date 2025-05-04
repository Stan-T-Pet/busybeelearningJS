import soundMap from "@/server/cdn/soundMap";

const sounds = {};

if (typeof window !== "undefined") {
  Object.entries(soundMap).forEach(([key, url]) => {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.preload = "auto";
    sounds[key] = audio;
  });
}

export default function playSound(name) {
  if (typeof window === "undefined") return; // skip on server
  const sound = sounds[name];
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
