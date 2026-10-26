/**
 * Competitive programming snapshot. Every number below was read from the
 * platform's public data on 26 October 2026 (Codeforces API, LeetCode GraphQL,
 * the CodeChef profile page); nothing is typed in by hand. Rating series are
 * [date, rating after the contest] for every rated contest.
 */

export const statsFetchedOn = "26 October 2026";

export type RatingPoint = [date: string, rating: number];

export interface PlatformStats {
  id: "leetcode" | "codeforces" | "codechef";
  label: string;
  handle: string;
  href: string;
  source: string;
  current: number;
  best: number;
  /** Title held at the best rating, as the platform names it. */
  bestTitle?: string;
  contests: number;
  solved: number;
  /** Extra facts shown as label/value pairs. */
  facts: { label: string; value: string }[];
  /** Solved problems by difficulty, where the platform reports it. */
  breakdown?: { label: string; value: number }[];
  series: RatingPoint[];
}

export const platforms: PlatformStats[] = [
  {
    id: "leetcode",
    label: "LeetCode",
    handle: "Ohi-me",
    href: "https://leetcode.com/u/Ohi-me/",
    source: "LeetCode public GraphQL (profile, contest ranking and history)",
    current: 1616,
    best: 1663,
    contests: 27,
    solved: 668,
    facts: [
      { label: "Contest rating, top", value: "22.45%" },
      { label: "Global contest rank", value: "196,877" },
    ],
    breakdown: [
      { label: "Easy", value: 234 },
      { label: "Medium", value: 394 },
      { label: "Hard", value: 40 },
    ],
    series: [
      ["2022-10-23", 1460],
      ["2022-10-30", 1502],
      ["2022-11-06", 1513],
      ["2022-11-12", 1490],
      ["2022-11-13", 1497],
      ["2022-12-10", 1534],
      ["2022-12-11", 1521],
      ["2022-12-25", 1498],
      ["2023-01-08", 1492],
      ["2023-01-15", 1474],
      ["2023-01-22", 1468],
      ["2023-02-04", 1464],
      ["2023-02-12", 1501],
      ["2023-02-18", 1514],
      ["2023-03-12", 1521],
      ["2023-03-19", 1503],
      ["2023-04-02", 1483],
      ["2023-05-21", 1471],
      ["2023-05-28", 1509],
      ["2023-06-04", 1508],
      ["2023-06-10", 1565],
      ["2023-06-11", 1586],
      ["2023-06-18", 1637],
      ["2023-08-06", 1631],
      ["2023-08-20", 1616],
      ["2025-09-13", 1663],
      ["2026-06-21", 1616],
    ],
  },
  {
    id: "codeforces",
    label: "Codeforces",
    handle: "Ohi-Me",
    href: "https://codeforces.com/profile/Ohi-Me",
    source: "Codeforces API (user.info, user.rating, user.status)",
    current: 1128,
    best: 1388,
    bestTitle: "Pupil",
    contests: 26,
    solved: 222,
    facts: [{ label: "Title at best rating", value: "Pupil" }],
    series: [
      ["2022-12-30", 400],
      ["2023-01-03", 678],
      ["2023-07-06", 802],
      ["2023-07-07", 861],
      ["2023-07-11", 911],
      ["2023-07-16", 959],
      ["2025-04-21", 956],
      ["2025-05-17", 852],
      ["2025-05-24", 880],
      ["2025-05-26", 969],
      ["2025-05-31", 1041],
      ["2025-06-03", 981],
      ["2025-06-08", 998],
      ["2025-06-12", 1011],
      ["2025-06-15", 1011],
      ["2025-06-21", 1075],
      ["2025-07-01", 1097],
      ["2025-08-10", 1056],
      ["2025-09-07", 1159],
      ["2025-09-09", 1250],
      ["2025-10-24", 1277],
      ["2025-10-28", 1272],
      ["2025-12-23", 1227],
      ["2026-01-12", 1388],
      ["2026-10-07", 1246],
      ["2026-10-17", 1128],
    ],
  },
  {
    id: "codechef",
    label: "CodeChef",
    handle: "ohi_me",
    href: "https://www.codechef.com/users/ohi_me",
    source: "CodeChef public profile page (rating graph data)",
    current: 1681,
    best: 1703,
    bestTitle: "3-star",
    contests: 53,
    solved: 202,
    facts: [{ label: "Stars", value: "3-star" }],
    series: [
      ["2022-10-12", 941],
      ["2022-10-19", 1104],
      ["2022-10-26", 1215],
      ["2022-11-02", 1281],
      ["2022-11-09", 1357],
      ["2022-11-16", 1429],
      ["2022-11-23", 1448],
      ["2022-12-07", 1467],
      ["2022-12-12", 1504],
      ["2022-12-14", 1471],
      ["2022-12-28", 1506],
      ["2023-01-04", 1528],
      ["2023-01-11", 1545],
      ["2023-01-18", 1514],
      ["2023-02-01", 1499],
      ["2023-02-15", 1507],
      ["2023-02-22", 1480],
      ["2023-03-01", 1501],
      ["2023-03-08", 1462],
      ["2023-03-29", 1415],
      ["2023-05-31", 1413],
      ["2023-06-07", 1443],
      ["2023-06-14", 1471],
      ["2023-06-21", 1451],
      ["2023-06-28", 1464],
      ["2023-07-05", 1498],
      ["2023-07-12", 1528],
      ["2023-07-19", 1505],
      ["2025-02-26", 1493],
      ["2025-03-12", 1529],
      ["2025-03-26", 1545],
      ["2025-04-02", 1506],
      ["2025-04-16", 1465],
      ["2025-08-27", 1484],
      ["2025-09-03", 1514],
      ["2025-09-10", 1499],
      ["2025-09-17", 1526],
      ["2025-09-24", 1525],
      ["2025-10-22", 1549],
      ["2025-10-29", 1580],
      ["2025-11-05", 1576],
      ["2025-11-12", 1563],
      ["2025-11-19", 1540],
      ["2025-12-10", 1543],
      ["2025-12-17", 1544],
      ["2025-12-24", 1562],
      ["2026-01-07", 1599],
      ["2026-01-14", 1645],
      ["2026-01-21", 1686],
      ["2026-08-19", 1703],
      ["2026-08-26", 1700],
      ["2026-10-07", 1679],
      ["2026-10-14", 1681],
    ],
  },
];
