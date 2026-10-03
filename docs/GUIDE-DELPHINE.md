# Guide de la boutique — Delphine M. Créations

Ce guide explique comment gérer la boutique au quotidien. Vous n'avez besoin que de deux outils :

- **Le Studio** — pour les bijoux, les commandes, les demandes sur-mesure et les textes du site : `https://[VOTRE-DOMAINE]/studio`
- **Stripe** — pour l'argent (paiements et remboursements) : [dashboard.stripe.com](https://dashboard.stripe.com)

> Une modification dans le Studio n'est visible sur le site qu'après avoir cliqué sur **Publier** (en bas à droite). Le site se met à jour en moins d'une minute.

---

## 1. Ajouter un bijou

1. Studio → **Produits** → **Tous les bijoux** → bouton **+** (en haut).
2. Onglet **Présentation** :
   - **Nom du bijou**.
   - **Adresse de la page** : cliquez sur **Générer**.
   - **Photos** : glissez vos photos. La **première** est celle de la boutique. Pour chaque photo, remplissez le **Texte alternatif** (ex. « Boucles d'oreilles en cuir cognac portées »). Le point rond sur la photo permet de choisir la partie la plus importante (elle ne sera jamais coupée).
   - **Histoire du bijou** et **Conseils d'entretien**.
   - **Collection** et **Catégorie**.
   - **Mettre en avant sur l'accueil** si vous voulez qu'il apparaisse en premier.
3. Onglet **Prix et détails** :
   - **Prix** en euros (ex. `45` ou `45,50`).
   - **Couleur du cuir** : écrivez toujours la même chose pour la même couleur (« Cognac », pas « cognac » une fois et « Cognac clair » une autre) — c'est ce qui sert au filtre de la boutique.
   - **Dimensions**, **Poids** (en grammes).
   - **Quantité disponible** : `1` pour une pièce unique.
4. **Publier**.

**Modifier** un bijou : ouvrez-le, changez, **Publier**. **Retirer** un bijou du site : menu `⋯` en haut à droite → **Supprimer la publication** (il reste dans le Studio, invisible sur le site).

## 2. Quand une commande arrive

Vous recevez un e-mail **« Nouvelle commande DMC-2026-0001 »** avec le bouton **Ouvrir la commande**. La cliente reçoit sa confirmation automatiquement.

Le bijou passe tout seul en **Vendu** sur le site : vous n'avez rien à faire.

Dans le Studio → **Commandes** → **À expédier**, vous voyez toutes les commandes payées à préparer : bijoux, adresse, téléphone, montant.

## 3. Expédier une commande

1. Préparez le colis et déposez-le à La Poste.
2. Studio → **Commandes** → **À expédier** → ouvrez la commande.
3. **Numéro de suivi Colissimo** : collez le numéro.
4. **État de la commande** : choisissez **Expédiée**.
5. **Publier**.

La cliente reçoit automatiquement l'e-mail **« Votre colis est parti »** avec le lien de suivi. (Il n'est envoyé qu'une seule fois, même si vous republiez.)

Pour un **retrait dans la Vaunage** : contactez la cliente (téléphone dans la commande), puis passez la commande en **Livrée** une fois le bijou remis.

Quand le colis est arrivé, vous pouvez passer la commande en **Livrée** (facultatif, c'est pour votre suivi).

## 4. Rembourser une cliente

L'argent se gère **uniquement dans Stripe**.

1. Dans la commande (Studio), ouvrez **Stripe** et copiez le **Paiement (Payment Intent)** (commence par `pi_…`).
2. Stripe → **Paiements** → collez le code dans la recherche (ou cherchez l'e-mail de la cliente).
3. Ouvrez le paiement → **Rembourser** → montant total ou partiel → **Rembourser**.
4. De retour dans le Studio : commande → **État** → **Remboursée** → **Publier**.

**Remettre en vente** un bijou retourné : Studio → ouvrez le bijou → **Prix et détails** → **État** : **Disponible**, **Quantité disponible** : `1` → **Publier**.

## 5. Partir en vacances

Studio → **Réglages** → **Mode vacances** → cochez **Activer** et écrivez un message (ex. « Je suis en vacances jusqu'au 25 août, les commandes reprendront à mon retour. ») → **Publier**.

Le message s'affiche en haut du site et les achats sont suspendus. Pour rouvrir : décochez → **Publier**.

## 6. Les demandes sur-mesure et les messages

- Une **demande sur-mesure** arrive par e-mail et dans Studio → **Demandes sur-mesure** → **Nouvelles**, avec les photos d'inspiration. Après avoir répondu, changez le **Suivi** (Répondu, Acceptée, Clôturée) pour vous y retrouver.
- Un **message du formulaire de contact** arrive uniquement par e-mail : il suffit de cliquer sur **Répondre**.

## 7. Les autres réglages

Studio → **Réglages** :

- **Bandeau d'annonce** : petit message en haut de toutes les pages (ex. une collection qui arrive).
- **Livraison** : prix Colissimo, livraison offerte à partir de…, retrait dans la Vaunage.
- **Contact** : e-mail, téléphone, liens Instagram et Facebook affichés sur le site.

Studio → **Pages** : les textes des pages Conditions générales de vente, Mentions légales, Livraison et retours, Confidentialité et Entretien du cuir.

## Bon à savoir

- **« Réservé »** : quand une cliente est en train de payer, le bijou est réservé pour elle pendant 30 minutes. S'il n'y a pas de paiement, il redevient disponible tout seul.
- Vous ne pouvez pas modifier l'**État** d'un bijou disponible ou réservé : c'est la boutique qui s'en charge, pour éviter de vendre deux fois une pièce unique.
- Une commande ne peut pas être supprimée : c'est votre historique de ventes.
- En cas de doute ou de problème : [CONTACT DÉVELOPPEUR À COMPLÉTER].
