# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G19 – G19-gjendem |
| **PRD vurdert** | `_bmad-output/planning-artifacts/prds/prd-smart-to-do-2026-09-27/prd.md` (status `final`, sist endret 2026-11-02, commit f6ac748). Addendum lest. |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

Dette er en av de mer gjennomarbeidede PRD-ene: kravene er konkrete, grensetilfellene er tenkt gjennom, og leveranse- og verifikasjonsstatus er ærlig oppgitt. Risikoen ligger i omfanget og balansen. Trinn 1 har vokst til 16 krav (blant annet utseende, helligdager og gjennomgangsvindu), mens KI, som er emnets tema og det som skal gjøre appen «smart», består av to korte krav og er ikke startet. Dokumentet blander dessuten krav, status og endringslogg, og det mangler et glossar.

## 2. Dette fungerer godt

- **Ærlig status.** §7: «These are historical recorded results, not a new full test run» og «No completed two-user trial or ten-task acceptance report is claimed». Skillet mellom mål og dokumentert leveranse er sjeldent og gir et pålitelig grunnlag.
- **Krav med grensetilfeller.** FR-12 sier «Touching endpoints do not overlap; completed tasks do not contribute to conflicts» og «Overnight intervals are not supported». FR-17 sier hvem som kvalifiserer (ikke «today's, undated and completed»). Dette kan nesten kopieres rett inn som testtilfeller.
- **Tydelige beslutninger og avgrensning.** §2 forklarer hvorfor «forfalt» ble til «Past unfinished task». §6 lister hva som er utelatt, og at brainstormede ideer er «not approved requirements». Kravet om en merket testmodus uten egen nøkkel (§6) svarer direkte på tilbakemeldingen på briefen.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet | god | Valg som lagring i nettleser, dato i stedet for frist og utsatt KI står som beslutninger. Det mangler en rangering av hva som kuttes først. |
| Substans | sterk | Produktspesifikt innhold, ingen pynte-personas eller boilerplate-NFR-er. |
| Strategisk sammenheng | svak | Tesen «én kalenderoversikt» er implisitt, utseende og helligdager tjener den dårlig, og KI-delen er tynn. |
| Testbarhet | god | De fleste FR-er har målbare utfall. FR-9/10, NFR-1 og deler av FR-6/15 er vage, og FR-13 er for tett. |
| Scope og avgrensning | god | Utelatelser er eksplisitte (§6), men det finnes ingen kuttlinje for trinn 1. |
| Brukbarhet for neste fase | god | FR-ID-ene er sammenhengende og krysshenvisningene løser seg. Glossar mangler, og akseptansepunktene har ikke ID. |
| Formtilpasning | god | Kapabilitetsspesifikasjon for ett-bruker-verktøy passer, og brukerreiser trengs ikke. PRD-en er skrevet etter implementeringen og bærer preg av det. |

## 4. Viktigste forbedringer

### 4.1 KI-kravene er for tynne til å styre trinn 2
- **Alvorlighet:** høy
- **Hvor:** §3 FR-9/FR-10, «On user request, AI proposes an existing category»; §6 «Deferred AI decisions»
- **Problem og hvorfor det betyr noe:** FR-9 og FR-10 har ingen testbare konsekvenser. Det står ikke hva som sendes, hva som skjer ved usikkert eller ugyldig svar, eller hva «understandable feedback» er. Kostnadsgrense, leverandør og testmodus er utsatt som «pending planning obligations». Stories og arkitektur for KI kan ikke lages fra dette. Tidspunktet gir ikke mye rom for å vente.
- **Forslag:** Skriv FR-9 om slik: «Brukeren kan be om kategoriforslag for en oppgave. *Konsekvenser:* (1) forslaget er alltid en eksisterende kategori, ellers vises «Ingen sikker kategori» og oppgaven er uendret; (2) kategorien settes først når brukeren trykker Godta; (3) før første kall vises hvilken tekst som sendes (tittel og beskrivelse); (4) i testmodus gir de 20 fiktive oppgavene faste svar, merket «Testmodus»; (5) ved tidsavbrudd etter 10 sekunder vises feilmelding, og Lagre fungerer som før.» Skriv også en linje om at Vercel-siden er statisk, så KI-kallet må gå via en server-funksjon. Avklar det før arkitektur.

### 4.2 Tese og kuttlinje mangler: trinn 1 vokser, «smart» er utsatt
- **Alvorlighet:** høy
- **Hvor:** §1 «gives people one calendar overview»; §3 FR-15–18; §2 «Stage 2 (deferred)»
- **Problem og hvorfor det betyr noe:** Tesen er ikke formulert som et veddemål, og suksessmålet «find upcoming, past unfinished and undated tasks … without consulting separate notes» har ingen terskel. Utseende (FR-15) og helligdager (FR-16) bidrar lite til oversikt, men koster mye. Uten rangering vet ingen hva som kuttes hvis tiden blir knapp.
- **Forslag:** Legg inn en kort «MVP-grense» i §2 eller §6 med tre grupper: *må* (FR-1–8, 11–14), *bør* (FR-17–18, FR-9–10) og *kan utgå* (FR-15–16). Gjør tesen målbar, f.eks.: «Etter to uker bruker testbrukeren appen som eneste oppgaveoversikt, og noterer ingen oppgaver utenfor den.»

### 4.3 Krav, status og historikk er blandet
- **Alvorlighet:** medium
- **Hvor:** frontmatter `status: final`; §1 «Earlier reviews and plans remain historical where they differ»; overskrift «approved, not yet implemented»; §7
- **Problem og hvorfor det betyr noe:** «Final» passer dårlig med krav som ikke er bygget og et trinn som ikke er startet. Statusavsnittet og endringsloggen endres oftere enn kravene og gjør det vanskelig å se hva som er gjeldende kilde. FR-9/10 står dessuten sist, etter FR-18.
- **Forslag:** Flytt §7 og endringsloggen til en egen `status.md` (eller til addendumet). Marker kravstatus med en kort tag per FR, f.eks. `[Status: levert]` eller `[Status: ikke implementert]`. Sorter FR-ene i nummerrekkefølge.

### 4.4 Noen krav er ikke testbare, og FR-13 er for tett
- **Alvorlighet:** medium
- **Hvor:** FR-6 «none silently disappear»; FR-15 «remain readable over colours and images»; NFR-1 «understandable without relying on colour alone»; NFR-2; FR-13 (ca. 12 oppførsler i ett avsnitt)
- **Problem og hvorfor det betyr noe:** Når en story skal få akseptkriterier, må utvikleren gjette. FR-13 blir også én stor story som er vanskelig å teste og vise frem.
- **Forslag:** Gi vage ord en grense: «Tekst på bilde har kontrast minst 4,5:1 (WCAG AA) etter at bildet er dekket av et halvgjennomsiktig lag.» «Med 500 oppgaver åpnes måneden på under 1 sekund.» Del FR-13 i tre: åpne skjema (prefyll), tidsvelger (12:00, femminuttersteg) og lagring/feil.

### 4.5 Glossar og ID-er for akseptansepunktene mangler
- **Alvorlighet:** medium
- **Hvor:** §2 «Terms»; §5 punktliste
- **Problem og hvorfor det betyr noe:** Samme begrep har flere navn: «Uten dato» / «undated list», «Rydd side» / «cleanup», «day details» / «expanded day» / «timetable». Det er også uklart hvor man finner «past unfinished» etter at gjennomgangsvinduet er lukket (FR-7 mot FR-17). Akseptansepunktene i §5 kan ikke spores i tester uten ID.
- **Forslag:** Gjør §2 til et glossar med norsk UI-navn og engelsk term side om side, f.eks. «**Rydd side** (cleanup) – skjuler fullførte oppgaver uten å slette dem». Nummerer §5 som AC-1 …, og ta med FR-ene hver dekker, slik dere allerede gjør i parentes.

## 5. Mekaniske funn

- FR-1–18 er unike og sammenhengende, men FR-9/10 står sist. SM-, UJ- og AC-ID-er finnes ikke.
- Ingen `[ASSUMPTION]`-tagger og ingen antakelsesindeks, selv om §6 har åpne beslutninger. Gjør dem om til en nummerert liste.
- «Epic 1» og «Epic 6» (§6) er ikke definert i PRD-en; de ligger i et annet dokument.
- FR-7: «Past unfinished tasks remain accessible even when their month is not displayed» sier ikke hvor (liste, panel eller vindu).
- Dokumentspråket er engelsk. Dette er en bevisst beslutning (§1), men gjør en glossar-kobling til norske UI-navn ekstra viktig.
- Ingen sensitive opplysninger funnet.

## 6. Før dere går videre

**Må avklares før UX/arkitektur/epics:**
- Hva som kuttes først (4.2), og minimumsomfang for KI.
- Hvor KI-kallet kjører, siden appen er statisk på Vercel og nøkkelen ikke skal ligge i nettleseren (4.1).
- Hvor «past unfinished» nås etter lukket vindu (FR-7/FR-17).

**Kan vente:** leverandør og kostnadsgrense (men før stories), ideene i §6 («Ideas for later consideration»), glossar og AC-ID-er (ryddearbeid).

**Oppfølging av tilbakemeldingen på briefen: delvis.**
- Samsvar mellom brief og PRD: ja (begrepsavsnitt og endringslogg forklarer dato, kategorier og tider).
- Plan for KI-trinn med nøkkel og testmodus: delvis (krav og 20 testoppgaver står, men leverandør og kostnad er utsatt).
- Utvidelse som løfter vanskelighetsgraden: nei (bare listet som uforpliktende idé).
- Epics/stories og README: ja (lenket).

## 7. Refleksjonsspørsmål

1. §7 skiller nøye mellom det som er bygget og det som er verifisert. Hvordan sjekket dere hva KI-en påstod var levert, og hva ville dere ha endret hvis dere hadde skrevet det uten kontroll?
2. FR-15 og FR-16 ble godkjent og levert før KI-trinnet startet. Hvilket krav i PRD-en burde ha stoppet dem, og hvordan ville dere be KI-en teste forslag mot tesen i §1?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._
