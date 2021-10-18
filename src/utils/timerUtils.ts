export function formatDuration(duration?: number): string {
  if (!duration) {
    return '';
  }
  let mins: string | number = Math.floor(duration / 60);
  if (mins < 10) {
    mins = `0${String(mins)}`;
  }
  let secs: string | number = Math.floor(duration % 60);
  if (secs < 10) {
    secs = `0${String(secs)}`;
  }

  return `${mins}:${secs}`;
}
