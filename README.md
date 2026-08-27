# UKI web — připraveno pro GitHub Pages + Pages CMS

Tato složka je připravená jako jednoduchý statický web pro GitHub Pages.

## Co se upravuje v administraci

V Pages CMS bude položka **Obsah webu Uki** se třemi poli:

- **Anotace knihy** — textový editor.
- **Ukázka knihy (PDF)** — nahrání nebo výměna PDF souboru.
- **Krátký popisek ukázky** — nepovinný text u tlačítka.

Nastavení CMS je v souboru `.pages.yml`. Obsah se ukládá do `content/site.json`. PDF se ukládají do `media/docs/`.

## Po založení GitHub repozitáře

1. Nahrát obsah této složky do kořene repozitáře.
2. V GitHubu zapnout **Settings → Pages → Deploy from a branch** a vybrat větev `main` a `/ (root)`.
3. Otevřít Pages CMS, přihlásit se přes GitHub a povolit mu tento repozitář.
4. V Pages CMS otevřít **Obsah webu Uki** a vyplnit anotaci / nahrát PDF.

## Důležité

`index.html` je zachovaný základ původní vstupní stránky. `vstup.html` nyní obsahuje sekce **O knize** a **Ukázka z knihy** napojené na CMS.

Až bude k dispozici finální verze celého webu Uki, lze stejné datové značky (`data-cms`) vložit do jejího existujícího designu bez změny způsobu administrace.
