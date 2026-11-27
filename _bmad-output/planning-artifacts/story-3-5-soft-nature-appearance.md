# Story 3.5 — Mykere kalender med naturbakgrunn

**Epic:** 3 — Tilpass kalenderens utseende  
**Status:** Implementert og testet lokalt 27. november 2026; avventer brukerens visuelle godkjenning
**Avklart med brukeren:** 27. november 2026  
**Forutsetning:** Bygger videre på godkjente Stories 3.1–3.4 og eksisterende FR-15.

## Brukerhistorie

Som bruker ønsker jeg en mykere kalender med fjell og vann som valgfri bakgrunn, samtidig som jeg kan velge egne bilder og farger, slik at kalenderen føles personlig og er lett å lese.

## Utseende og avgrensning

- Bruk den godkjente fjellskissen som visuell retning: avrundede paneler og knapper, svakere skillelinjer og lyse, lett gjennomskinnelige flater.
- Tilby det separate landskapsbildet som en innebygd, valgfri bakgrunn. Eksisterende lagrede valg erstattes ikke automatisk.
- Behold egne bilder og farger både rundt kalenderen og i kalenderens rutenett. De to bakgrunnene skal fortsatt kunne endres uavhengig.
- Behold PC-oppsettet med sidepanel til venstre og eksisterende kalenderfunksjoner. Mobiltilpasning tilhører Epic 7.
- Skissens eksempeltekster, oppgaver og tall er illustrasjoner, ikke nye funksjonskrav.

## Akseptansekriterier

1. Når brukeren velger fjellbakgrunnen i utseendeinnstillingene, vises den straks som forhåndsvisning. Bildet fyller valgt bakgrunn med sentrert beskjæring; i rutenettet vises ett sammenhengende bilde.
2. Brukeren kan fortsatt velge egen bildefil, velge farger eller fjerne et bilde. Valgene for bakgrunnen rundt kalenderen og bakgrunnen i rutenettet påvirker ikke hverandre.
3. Lagre beholder valgene etter ny åpning i samme nettleser. Avbryt gjenoppretter sist lagrede utseende. Tilbakestilling følger eksisterende standardutseende og krever Lagre.
4. Eksisterende lagrede bilder og farger beholdes når den nye versjonen åpnes. Oppgaver, kategorier og åpne utkast endres ikke av utseendevalg.
5. Avrundede flater og roligere rutenett gir skissens mykere uttrykk. Datoer, oppgaver, kategorifarger, dagens markering, fullført tekst, konfliktvarsler og norske flagg er tydelige med både lyse og mørke bilder. Normal tekst har minst 4,5:1 kontrast.
6. Månedsskifte, utvidet dag, timeplan og sidepaneler fungerer som før. Tastaturfokus er synlig, og knapper eller tekst klippes ikke ved PC-bredder og nettleserzoom som inngår i eksisterende akseptansekontroll.
7. Den innebygde bakgrunnen er en lokal appressurs uten eksternt bildekall. Feil ved bildevalg eller lagring gir forståelig tilbakemelding og bevarer sist lagrede utseende og brukerens utkast.

## Oppgaver ved implementering

- Samordne UX-dokumentene og leveransestatus for FR-15 med denne storyen før kodeendring.
- Klargjør en komprimert appressurs fra landskapsoriginalen og gjør den tilgjengelig i lokal server og publisert app.
- Tilpass paneler, knapper og rutenett; legg til bakgrunnsvalget i eksisterende forhåndsvisningsflyt.
- Kontroller kriteriene over, kjør relevante utseendetester og dokumenter faktisk resultat før storyen markeres ferdig.
- La brukeren prøve det nye uttrykket før endelig akseptanse.

## Visuelle referanser

- [Godkjent fjellskisse](ux-designs/story-3-5/selected-mockup.png)
- [Landskapet uten grensesnitt](ux-designs/story-3-5/landscape-mountains-lake.png)
- [Bildets opprinnelse](ux-designs/story-3-5/README.md)

Implementasjonen er kontrollert med 26 enhetstester og fire nettlesersuiter. Se [implementasjon og testresultater](../implementation-artifacts/spec-3-5-soft-nature-appearance.md). Endelig visuell godkjenning gjenstår; ingen publisering er gjort i denne økten.
