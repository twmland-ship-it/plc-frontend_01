export function useColorGenerator(length) {
  const allColors = [
    "#FF8000",
    "#b22222",
    "#cd853f",
    "#8b4513",
    "#ffd700",
    "#f5f5dc",
    "#eee8aa",
    "#8b0000",
    "#a52a2a",
    "#da70d6",
  ];
  if (length > 10) {
    const colors = allColors;
    for (let i = 0; i < length - 10; i++) {
      const letters = "0123456789ABCDEF".split("");
      let color = "#";
      for (var x = 0; x < 6; x++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
  } else {
    return allColors.slice(0, length);
  }
}
