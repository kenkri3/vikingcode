# VikingCode (vikingcode.no)

Autonom "vibecoding"- og programvarebyggerplattform skreddersydd for Viking-økosystemet (tilknyttet vikingnet.no, vikingmester.no og vikingcrm.no).

## Teknologistakk & Arkitektur
- **Rammeverk**: Next.js 15+ App Router, React 19, TypeScript
- **Styling**: Tailwind CSS (Dark Obsidian `#0A0D12`, `#12161F`, borders `#1F2937`, signaturlilla `#7C3AED`)
- **Database**: PostgreSQL på Railway via Prisma ORM (`prisma/schema.prisma`)
- **Distribusjon**: Native Railway.com konfigurasjon via `railway.json` med Nixpacks builder
- **Agentmotor**: Antigravity-lignende synlige tankerekker, Gemini-stil inputfelt og Botsify agent webhook API

## Kjøring lokalt
```bash
npm install
npx prisma generate
npm run dev
```

## Distribusjon til Railway
Kunden pusher kode til eget GitHub-repo og distribuerer direkte til sin egen Railway-konto med 1-klikks template:
`https://railway.com/template?template=https://github.com/kenkri3/vikingcode`
