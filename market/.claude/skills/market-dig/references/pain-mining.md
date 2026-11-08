# Pain mining — finding what users really suffer

Look for pain, not "product ideas". People do not post to sell ideas; they post to complain, to ask for a solution, or to share how
they work around a problem. The ideas are inside those three.

## Contents
1. Sources and seed phrases
2. Reddit
3. Complaint types
4. Minimum counts
5. Recording one pain
6. Grouping into clusters

## 1. Sources and seed phrases
| Source | Read | Seed phrases |
|---|---|---|
| App Store / Play reviews | 1–3★ recent (last 3–6 months) first; 5★ for what users love; apps growing but complained about are worth more than polished leaders | "I wish…", "Why can't this app…", "I paid but…", "It would be useful if…", "Too complicated…", "I have to do this manually…" |
| Reddit, Facebook groups, Discord, forums | per thread: the situation, what they tried, why it failed, whether they pay or lose time on a workaround | "How do you manage…", "Is there an app that…", "I'm tired of…", "What do you use for…", "I wish there was…", "The hardest part of…" |
| YouTube / TikTok | **comments** more than videos; videos like "How I organize…", "Apps I use to…" show real workflows | "Is there an app that does this automatically?", "I need this for…", "doesn't work in my country" |
| Keyword autocomplete | "how to organize / clean / track / stop / learn …" + the problem words from step 2 | — |

Strongest signals (pay double attention): spreadsheets used to manage it · copying data by hand between apps · many reminders to make
up for forgetting · paying for several tools to do one job · complex workarounds · constantly searching tutorials · accepting a bad
app for lack of choice · **"I hate it but I still use it"**.

## 2. Reddit
Search with quotes for exact phrases, or Google `site:reddit.com "phrase"`. Inside a subreddit sort by Top (past month / year) —
upvotes are votes for pain.

| Group | Queries | Signal |
|---|---|---|
| Frustrated with current tools | "is there an alternative to", "disappointed with", "too expensive", "bloated with features", "ruined the app" | users ready to leave; "ruined the app" after a bad update = a window to catch migrating users |
| Unmet needs | "is there an app for", "is there a tool that", "wish there was a", "does anyone know a way to", "how to automate" | need described, nothing found; read the answers for current workarounds |
| Manual, time-consuming work | "every day I have to", "spending hours doing", "hate doing this manually" | daily frequency, high workaround cost |

Subreddits: r/somebodymakethis, r/findanapp (a thread with no good answer = a publicly confirmed gap), r/SideProject (read the comments
on others' MVPs), r/mildlyinfuriating, r/complaints, plus the niche's own subreddits.
Narrowing formula: `site:reddit.com/r/<niche-subreddit> "<pain phrase>"` — e.g. `r/hometheater "universal remote"`,
`r/ios "storage full"`, `r/learntodraw "don't know what to draw"`.

## 3. Complaint types
Tag each review complaint with one type — this is how a pain also becomes a competitor weakness:
missing feature · inaccurate result · too expensive · hard to use · privacy worry · too many ads · misleading subscription ·
slow / buggy / disconnects. **Complaints that repeat across apps are the best opportunities.**

## 4. Minimum counts
For a serious run: ≥ 30 pain quotes from ≥ 3 source types · ≥ 40 reviews from ≥ 2 apps, including praise · ≥ 3 apps tried hands-on.
List everything — no summarising at the evidence stage; a thin list looks exactly like a full one in a summary. If the minimum is not
reached (niche too small, sources closed), say so in §3 and the quick-read line instead of padding.

## 5. Recording one pain
Each quote is an evidence entry in group A (`market-standards/assets/evidence.template.md`), tagged with its cluster, app, stars,
country, month. While mining, keep a working note per pain with the ten fields below; they feed §3 and the scoring in step 4:

| Field | Example |
|---|---|
| User | người có nhiều email quảng cáo |
| Situation | hộp thư hàng nghìn email chưa đọc |
| Problem | không xoá nhanh theo người gửi được |
| Current workaround | tìm từng người gửi rồi xoá tay |
| Frequency | hàng tuần |
| Severity | trung bình – cao |
| Existing solution | bộ lọc Gmail, app dọn mail |
| Complaint | khó xem lại trước khi xoá |
| Desired outcome | xoá nhanh mà vẫn kiểm soát được |
| Evidence | #12–#23, 4 thread Reddit |

**Said vs needed**: "I need a delete-all button" → the need is "clear the clutter without fear of deleting something important". The
§3 column "Người dùng thực sự cần gì" holds the need, not the requested feature.

## 6. Grouping into clusters
Group the pains (affinity grouping) into need clusters. A good cluster: many related problems · several kinds of users share it ·
can grow into several features · a clear outcome · does not live on one short trend.

§3 table per cluster: the need, evidence numbers, **number of independent sources** (different URLs / source types), frequency and
severity in plain words. A cluster with < 2 independent sources is "tín hiệu yếu". Close §3 with what users praise (must keep / must
have), their workarounds, and a demand-vs-trend line.

## 7. Reading pains honestly
- **A quote is evidence, not a finding.** The finding is your one-sentence reading of several quotes; it must stand on its own.
- **Behaviour beats stated preference.** "Tôi tự hẹn giờ trên đồng hồ" (did) outweighs "tôi sẽ trả tiền cho X" (says). Tag each quote
  did / says; flag clusters that rest only on "says".
- **Disagreeing sources are a signal**, usually of two segments or two contexts — report both instead of picking one.
- **Frequency × impact**: high-high = priority · low frequency, high impact = matters for one segment · high frequency, low impact =
  quality-of-life · low-low = note only.
- **Confidence per cluster**: cao (several independent sources, behaviour) · vừa (a few sources or mostly "says") · thấp (one or two
  sources). A cluster from a couple of sources is a hypothesis, not a conclusion.
- Name people by type ("người đi làm, dùng app 6 tháng"), never by username.
