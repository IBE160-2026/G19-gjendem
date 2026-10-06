# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G19 – G19-gjendem |
| **Product brief** | `product-brief.md` (commit `e4feba4`) |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

Vurdert fil: `product-brief.md` i repoets rot, som PRD-en lenker til som godkjent brief. Mappen `_bmad-output/planning-artifacts/briefs/brief-ai-study-buddy-2026-09-13/` inneholder bare arbeidsnotater og er ikke vurdert. Repoet har også PRD, UX-design, teknisk plan og en første versjon av appen med tester.

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Gruppen kan gå videre og innarbeide punktene under.

**Det som er bra:**

1. Briefen er konkret og ærlig. Problemet (oppgaver spredt på jobbnotater, mobilkalender og hukommelse) er godt beskrevet, og dere skriver selv at verdien ikke er en unik oppfinnelse, men en samlet oversikt. Det er en moden vurdering.
2. Suksesskriteriene er blant de beste vi har sett: ti testoppgaver fordelt på Work, Family og Studies, to eksterne brukere uten hjelp, og «16 av 20 forhåndsdefinerte oppgaver får et etikettforslag som oppfyller skriftlige kriterier», med simulert KI-feil. Dette kan gjøres direkte om til tester.
3. Rekkefølgen er klok: kalender og oppgavehåndtering først, KI-etiketter i trinn 2, og appen skal virke også når KI ikke er tilgjengelig. Det er akkurat slik et enkelt prosjekt bør bygges opp.

**De viktigste endringene:**

1. Hold briefen i takt med PRD-en. PRD-en har allerede endret flere ting: «deadline» er blitt en vanlig «Dato», kategoriene heter nå Jobb, Skole, Familie og Ellers, og start- og sluttid med konfliktvarsel er kommet inn. Det er fint at planen utvikler seg, men skriv en kort endringsnotis i briefen eller i PRD-en om hvorfor, slik at sensor kan følge sporet.
2. Legg en plan for KI-trinnet som sensor kan kjøre. Briefen sier at teknologivalg tas senere. Beskriv før trinn 2 hvilken KI-tjeneste dere vil bruke, hvordan nøkkelen holdes utenfor koden, og hvordan sensor kan prøve appen uten deres nøkkel (for eksempel en testmodus med faste forslag).
3. Vurder én utvidelse som løfter vanskelighetsgraden. Prosjektet er enkelt, og trinn 2 er bare kategoriforslag. Når trinn 1 er stabilt, kan for eksempel prioritet eller KI-tolkning av fritekst («levere rapport fredag kl. 12») gi mer å vise frem.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Enkel**

**Sammenlignbart med:** 6) To-do-liste med smarte etiketter (enkel). Briefen bygger bevisst på dette forslaget. Kalendervisningen med timeplan, konfliktvarsler og sidepanel gir noe mer arbeid enn en ren liste, men løfter ikke prosjektet til middels.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | Lav til middels | Datoer, forfalte oppgaver, filtrering, ukegrenser og overlappende tidsrom. Overkommelig, men grensetilfellene (søndag/mandag, i dag vs. forfalt) må testes. |
| Datamodell – antall entiteter og relasjoner mellom dem | Lav | Oppgave og kategori. |
| Brukere, roller og innlogging | Lav | Én personlig bruker uten innlogging. Deling og synk er bevisst utelatt. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | Lav til middels | Ett avgrenset KI-kall (kategoriforslag) med godkjenning fra brukeren og feilhåndtering. Godt avgrenset. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | Lav | Bare KI-tjenesten i trinn 2. Eksterne kalendere er utelatt. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | Lav | Ingen. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | Lav | Ingen. |
| Sikkerhet og personvern | Lav | Oppgavetekst er personlig, men lagres lokalt. PRD-en sier allerede at brukeren skal få vite hva som sendes til KI. |

**Hva vanskelighetsgraden betyr for dere:**

- _Enkel:_ Et enkelt prosjekt gir stor sjanse for å bli ferdig. Vanskelighetsgraden inngår likevel i vurderingen, så for å nå helt opp må dere vise mer i gjennomføringen. Det betyr særlig et gjennomarbeidet design, grundig testing, en tydelig dokumentert prosess og en README som virker. Dere er godt i gang med dette: appen har allerede flere testfiler og små, beskrivende commits.

### Gjennomførbarhet med BMAD og Claude Code

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | OK | Trinn 1 er allerede delvis implementert. Det er god tid til trinn 2 og forbedringer. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | OK | PRD-en med FR-1 til FR-13 viser at briefen var konkret nok. Mangler fortsatt egne epics/stories-dokumenter, som bør komme før trinn 2. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | OK | En lokal nettleserapp med enkel lagring er godt egnet. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | OK | Alt appen gjør kan kontrolleres ved å se på kalenderen. Kriteriet om skriftlige kriterier for gode etikettforslag gjør også KI-delen kontrollerbar. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | OK | Testsettet med ti oppgaver og 20 KI-oppgaver gir klare forventede resultater. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | Risiko | Trinn 1 er uproblematisk. Trinn 2 krever en plan for nøkkel og testmodus, se over. Rot-README beskriver ennå ikke hvordan appen startes. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | Risiko | Ikke beskrevet i briefen. Kategoriforslag er billig, men sensor må kunne prøve funksjonen uten deres konto. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart som beskrevet.**

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. Fullfør og test trinn 1 (inkludert konfliktreglene og listene for udaterte og forfalte oppgaver) før dere starter på KI-delen, slik briefen selv sier.
2. Planlegg én tydelig utvidelse etter kategoriforslagene, for eksempel KI-forslag til prioritet eller tolkning av fritekst til tittel, dato og kategori, med samme mønster: forslag som brukeren godkjenner, og en fasit dere tester mot.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | OK | Klart: én kalenderoversikt over oppgaver og frister på tvers av jobb, familie og studier. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | OK | Konkret og ærlig, inkludert at det ennå ikke er undersøkt om andre har samme behov. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | OK | Beskriver hva brukeren gjør: legge til oppgave, se den på datoen, filtrere, se forfalte og udaterte oppgaver. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Svært ærlig: eksisterende kalendere er gode alternativer, og verdien ligger i arbeidsflyten. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | Juster | Primærbrukeren er tydelig, men beskrivelsen er nokså bred («people managing their own tasks»). Det er greit, men si gjerne noe om bruksstedet (PC i nettleser), som PRD-en senere har bestemt. |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | OK | Svært gode og målbare kriterier, også for KI-delen. |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | Juster | Tydelig inn/ut, men start- og sluttid og konfliktvarsler har senere kommet inn i PRD-en, selv om briefen sier at planlagt arbeidstid er utelatt. Oppdater eller forklar avviket. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | OK | Nøktern, og tydelig merket som mulige retninger, ikke løfter. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | OK | Tydelig spor fra brief til PRD (FR-nummer) og videre til commits. Fortsett å lagre prompts og dokumentere endringer i planen. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | Juster | Realistisk og godt i gang. Fordi prosjektet er enkelt, bør trinn 2 og gjerne én utvidelse bli ferdig for å vise nok funksjonalitet. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | OK | Kriteriene er konkrete, og repoet har allerede tester. Koble gjerne testene eksplisitt til FR-nummer. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | OK | Kalender som hovedvisning gir et tydelig designgrunnlag, og dere har laget UX-dokumenter. |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | OK | Lokal nettleserapp uten innlogging er et enkelt og godt valg. Hold KI-kallet på serversiden, slik PRD-en krever. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | Juster | Trinn 1 er lett å kjøre. Rot-README mangler fortsatt oppstartsinstruksjoner, og KI-trinnet trenger testmodus. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | Juster | Dokumentasjonen er ryddig samlet. Bestem hvor KI-nøkkelen skal ligge (`.env` som ikke committes) og hvor testoppgavene ligger. |

## 3. Neste steg for gruppen

1. Oppdater briefen, eller legg inn en kort endringsnotis, slik at den samsvarer med PRD-en (dato i stedet for frist, nye kategorier, start- og sluttid).
2. Skriv en plan for KI-trinnet: valgt tjeneste, hvor nøkkelen ligger, testmodus for sensor og de 20 testoppgavene med skriftlige kriterier.
3. Lag epics og stories for resten av trinn 1 og for trinn 2, og oppdater README med hvordan appen og testene kjøres.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.
