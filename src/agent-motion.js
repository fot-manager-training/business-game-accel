// Three pairs meet in the aisle, discuss their task, and return to their desks.
// Changing partners each round lets every active agent visit their colleagues.
export function companyPoses(team, spots, elapsed, reducedMotion = false) {
  const cycle = 16000;
  const time = Math.max(0, elapsed + (team.id - 1) * 670);
  const round = Math.floor(time / cycle);
  const phase = time % cycle;
  const progress =
    phase < 5500
      ? phase / 5500
      : phase < 9500
        ? 1
        : phase < 15000
          ? 1 - (phase - 9500) / 5500
          : 0;
  const travelling =
    (phase > 0 && phase < 5500) || (phase >= 9500 && phase < 15000);
  const shift = round % 3;
  return spots.map(([x, y], index) => {
    const top = index < 3;
    const pair = top ? index : (index - 3 - shift + 3) % 3;
    const partner = top ? 3 + ((index + shift) % 3) : pair;
    if (
      reducedMotion ||
      !team.agents[index]?.active ||
      !team.agents[partner]?.active
    )
      return { x, y, moving: false, partner };
    const [otherX, otherY] = spots[partner];
    const rowGap = Math.abs(otherY - y);
    const aisleY = (y + otherY) / 2 + (pair - 1) * rowGap * 0.07;
    const spacing = Math.abs(spots[1][0] - spots[0][0]) * 0.21;
    const meetingX = (x + otherX) / 2 + (top ? -spacing : spacing);
    const meetingY = aisleY + (top ? -1 : 1) * rowGap * 0.1;
    // Leave the desk vertically, then move along the clear aisle.
    const vertical = Math.min(1, progress / 0.55);
    const horizontal = Math.max(0, (progress - 0.55) / 0.45);
    return {
      x: x + (meetingX - x) * horizontal,
      y: y + (meetingY - y) * vertical,
      moving: travelling,
      partner,
    };
  });
}
