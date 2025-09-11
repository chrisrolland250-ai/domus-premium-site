# Tests automatiques – Domus Premium

Ce dossier contient un **mini test** pour vérifier automatiquement :
- l’ordre du **menu** (*Prestations · Tarifs · Zone · Nos réalisations · FAQ · Contact*),
- la présence des **sections** (#services, #tarifs, #zone, #realisations, #faq, #contact),
- le **preload CSS**,
- le **hero responsive WebP** (hero-640/960/1280.webp + `fetchpriority="high"`),
- la **galerie inline** en WebP (240/480/720) avec `sizes` et `loading="lazy"`.

## Lancer en local
```bash
python tests/check_site.py .
```
Le script doit s’exécuter à la **racine du projet** et lire `index.html`.

## GitHub Actions
Un workflow est fourni pour lancer ces tests à chaque *push* et *pull request* :
- `.github/workflows/site-check.yml`

Vous verrez l’état dans l’onglet **Actions** du repo.

---

Besoin d’un test supplémentaire (poids d’images, absence de PNG/JPG dans `assets/realisations`, etc.) ? Dites-moi et je l’ajoute.
