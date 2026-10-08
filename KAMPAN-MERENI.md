# Příprava měření kampaně Uki (pracovní větev)

Ostrý web zatím neměnit. Před spuštěním reklamy:

1. Založit samostatnou službu GA4 pro uki-kniha.cz, získat ID G-XXXXXXXXXX.
2. Doplnit měření pouze po platném souhlasu s analytickými cookies; zajistit možnost souhlas odvolat.
3. Sledovat událost `pointa_click` při kliknutí na odkazy `https://pointa.cz/project/83184e61-9176-11f1-836a-26bf32ee7fad` napříč stránkami.
4. Testovat z mobilu, včetně odmítnutí cookies, a ověřit GA4 DebugView.
5. Používat UTM parametry v reklamních odkazech, například `utm_source=sklik&utm_medium=cpc&utm_campaign=uki_predprodej_rijen` a `utm_source=facebook&utm_medium=paid_social&utm_campaign=uki_predprodej_rijen`.
6. GA4 měří proklik na Pointu, nikoli potvrzený nákup bez podpory Pointy.

## Reklamy – pravidla

- **Meta:** vyloučit vlastní publika sledujících / návštěvníků / interakcí, pokud jsou dostupná; vypnout rozšíření publika, pokud nelze vyloučení garantovat. Zkontrolovat cílení a náhled před spuštěním.
- **Sklik:** cílit na nové zájemce; vypnout retargeting a vlastní seznamy; nastavit rozpočet max. 300 Kč celkem a kontrolovat skutečnou útratu. Nezaměňovat denní limit s celkovým.
- Malý test nedokáže spolehlivě prokázat prodeje. Bez měření nebo funkčního odkazu reklamu nespouštět.

Větev je pouze příprava; nic nebylo nasazeno ani zaplaceno.
