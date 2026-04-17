export function useNumformatter(input, fix = 2) {
  if (typeof input !== "number") return null;
  return input
    .toFixed(fix)
    .toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export function useCronFormatter(cron, count) {
  function getDayOfWeekText(dayOfWeek) {
    const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
    return daysOfWeek[parseInt(dayOfWeek, 10) - 1];
  }
  const showCount = count === 1 ? "" : count;
  const parts = cron.split(" ");

  const second = parts[0];
  const minute = parts[1];
  const hour = parts[2];
  const dayOfMonth = parts[3];
  const month = parts[4];
  const dayOfWeek = parts[5];

  let description = "";
  if (dayOfMonth !== "*" && month !== "*") {
    description += `每${showCount}年 ${month} 月 ${dayOfMonth} 日 ${hour} 時 ${minute} 分 ${second} 秒`;
  } else if (dayOfWeek !== "*") {
    const nthDayOfWeek = dayOfWeek.split("#")[1];
    if (nthDayOfWeek) {
      description += `每${showCount}月第 ${nthDayOfWeek} 個 週${getDayOfWeekText(
        nthDayOfWeek
      )} ${hour} 時 ${minute} 分 ${second} 秒`;
    } else {
      description += `每${showCount}週 ${getDayOfWeekText(
        dayOfWeek
      )} ${hour} 時 ${minute} 分 ${second} 秒`;
    }
  } else if (dayOfMonth !== "*" && month === "*") {
    description += `每${showCount}月 第 ${dayOfMonth} 天 ${hour} 時 ${minute} 分 ${second} 秒`;
  } else if (second !== "*" && minute !== "*" && hour !== "*") {
    description += `每${showCount}日 ${hour} 時 ${minute} 分 ${second} 秒`;
  }

  return description;
}

export function useTimeFormatter(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hh = h < 10 ? "0" + h : h;
  const mm = m < 10 ? "0" + m : m;
  const ss = s < 10 ? "0" + s : s;

  return `${hh}:${mm}:${ss}`;
}
