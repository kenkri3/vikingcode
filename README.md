# VikingCode (vikingcode.no)

> Autonom "vibecoding"- og programvarebyggerplattform for Viking-økosystemet (tilknyttet **vikingnet.no**, **vikingmester.no** og **vikingcrm.no**).

Plattformen lar brukere beskrive nettsider og SaaS-applikasjoner på naturlig norsk, generere kildekode trinnvis med synlige tankerekker i sanntid, teste resultatet i en interaktiv sandkasse (Live Sandbox Preview), redigere kildekode direkte, og eksportere eller distribuere til Railway.com uten at VikingCode pådrar seg driftskostnader.

---

## 💎 Visuell Identitet & Grensesnitt
- **Ultra-mørkt tema**: Dark Obsidian (`#0A0D12`), sekundærflater (`#12161F`), sub-pixel koksgrå rammer (`#1F2937`).
- **Signaturfarge**: Dyp signaturlilla (`#7C3AED`) med lys lilla aksenter (`#A78BFA`, `#C4B5FD`) for glød og knapper.
- **Fasettert Logo**: Skarp "V"-logo i lilla plassert øverst til venstre.
- **UX-inspirasjon**:
  1. **Startskjerm (ChatGPT-stil)**: Minimalistisk *"Hva vil du bygge i dag?"* med snarveier for Viking-økosystemet.
  2. **Inputlinje (Gemini-stil)**: Flytende, avrundet felt nederst med modellvelger (*Gemini 3.8 Flash High*, *Claude 3.7 Sonnet*, *Viking Ultra*), taleinndata og vedlegg.
  3. **Arbeidsflate & Resonnering (Antigravity-stil)**:
     - Venstrestilt sidepanel for samtaler og prosjekter (*Vikingmester*, *Vikingnet*, *VikingCRM*, *Helge*, *Opplev Horten*, etc.).
     - Synlige tankerekker i sanntid (`Thought for 5.8s >`), filanalyser (`Analyzed ❄️ MesterAIAgentFrame.tsx #L300-450`) og søkelogger.
  4. **Workspace / Split-view**:
     - **Venstre (40 %)**: Agentchat og tankerekker.
     - **Høyre (60 %)**: Fanevelger mellom **Forhåndsvisning (Live Sandbox)** og **Kodeeditor (med filutforsker)**.

---

## 🛡️ Forretningsmodell & Token-sikkerhetsventil
Systemet har en streng sperre mot økonomisk svinn:
- **TRIAL (0 kr)**: 50 000 tokens og maks 3 prompt-tester. Full tilgang til Live Preview og kodeinspeksjon. Eksport til GitHub, Railway og ZIP er låst med hengelås.
- **Viking Starter (490 kr/mnd)**: 500 000 tokens/mnd. Låser opp ZIP-nedlasting og push til eget GitHub-repo (1 aktivt prosjekt).
- **Viking Pro (990 kr/mnd)**: 1 500 000 tokens/mnd. **1-klikks Railway Template-generator**: Genererer `railway.json` og gir 1-klikks distribusjonsknapp inn i kundens egen Railway-konto (ingen hostingkostnad for VikingCode!).
- **Viking Mester (2 490 kr/mnd)**: 5 000 000 tokens/mnd. Byrålisens med multi-database (PostgreSQL, Redis), dedikert Botsify webhook og prioritert hastighet.
- **Top-up (199 kr)**: 500 000 tokens ekstra ved tom saldo.

---

## 🚀 Null-risiko Distribusjon (Railway.com)
I henhold til arkitekturen betaler VikingCode **0 kr** for kundenes hosting:
1. Koden og `railway.json` pushes direkte til kundens eget GitHub-repo.
2. VikingCode genererer en 1-klikks Railway Template-lenke:
   ```
   https://railway.com/template?template=https://github.com/KUNDE/PROSJEKT
   ```
3. Kunden logger inn på sin egen Railway-konto og dekker egen hosting og PostgreSQL-database.

---

## 🤖 Botsify Webhook Integrasjon (`POST /api/agent/webhook`)
Mottar strukturerte byggeoppdrag direkte fra Botsify agentic platform:
```json
{
  "action": "CODE_GENERATE",
  "user_id": "bruker-id",
  "project_name": "Min Norske Bedrift",
  "estimated_tokens": 7500,
  "requires_database": true,
  "files": [
    { "path": "app/page.tsx", "content": "..." }
  ]
}
```

---

## 💻 Kjøring Lokalt

```bash
# 1. Klon kodelageret
git clone https://github.com/kenkri3/vikingcode.git
cd vikingcode

# 2. Installer avhengigheter
npm install

# 3. Generer Prisma Client
npx prisma generate

# 4. Start utviklerserveren
npm run dev
```

Åpne deretter [http://localhost:3000](http://localhost:3000) i nettleseren.
