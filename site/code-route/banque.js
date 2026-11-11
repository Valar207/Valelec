/* Code de la route · banque de questions.
   Toutes les questions sont originales : rédigées pour ce site ou produites par des générateurs
   qui appliquent les règles du Code de la route (aucune question ni image reprise d'un éditeur).
   Format final : { id, th, sc, q, o: [4 réponses], ok: [indices justes], ex } */
(function () {
  'use strict';
  const THEMES = {
    L: 'Circulation routière', C: 'Le conducteur', R: 'La route', U: 'Les autres usagers', D: 'Réglementation',
    P: 'Premiers secours', Q: 'Prendre et quitter son véhicule', M: 'Mécanique et équipements', S: 'Sécurité des passagers', E: 'Environnement',
  };
  const B = [];
  const add = (id, th, sc, q, o, ok, ex) => B.push({ id, th, sc, q, o, ok: typeof ok === 'string' ? [...ok].map((c) => c.charCodeAt(0) - 65) : ok, ex });
  const V = (o) => ({ drv: o });

  /* ================= 1. Questions rédigées ================= */
  const H = [
    // ---- Circulation routière
    ['L', V({ env: 'ville', light: 'O', stopline: 1, speed: 40 }), 'Le feu passe à l’orange. J’ai la place de m’arrêter sans danger. Je :', ['m’arrête à la ligne', 'accélère pour passer avant le rouge', 'continue, l’orange autorise le passage', 'klaxonne pour prévenir derrière'], 'A', 'Le feu orange fixe impose l’arrêt. On ne passe que si l’arrêt ne peut plus se faire en sécurité.'],
    ['L', V({ env: 'ville', light: 'Oc', inter: 1, speed: 30 }), 'Le feu orange clignote. Je :', ['dois obligatoirement m’arrêter', 'peux passer en restant prudent', 'applique les règles de priorité du carrefour', 'fais demi-tour, le feu est en panne'], 'BC', 'Un feu orange clignotant n’impose pas l’arrêt : il demande de la prudence. La priorité se règle alors avec les panneaux ou, à défaut, la priorité à droite.'],
    ['L', V({ env: 'ville', light: 'R', stopline: 1, speed: 0 }), 'Le feu est rouge et personne ne traverse. Je peux franchir la ligne :', ['oui, si la voie est libre', 'non', 'oui, pour tourner à droite', 'oui, la nuit'], 'B', 'Le feu rouge interdit le passage dans tous les cas, sauf panonceau ou flèche lumineuse qui l’autorise expressément pour une direction.'],
    ['L', V({ env: 'ville', zebra: 1, ped: 1, speed: 30 }), 'Un piéton traverse sur le passage. Je :', ['m’arrête pour le laisser traverser', 'passe derrière lui sans ralentir', 'klaxonne pour qu’il se presse', 'le contourne par la gauche'], 'A', 'Le piéton engagé ou qui manifeste clairement l’intention de traverser est prioritaire. Ne pas lui céder le passage coûte 6 points.'],
    ['L', V({ env: 'ville', zebra: 1, ped: 'bord', speed: 30 }), 'Un piéton attend au bord du trottoir, face au passage. Je :', ['ralentis', 'suis prêt à m’arrêter pour le laisser traverser', 'accélère avant qu’il s’engage', 'considère qu’il attendra que je sois passé'], 'AB', 'Le piéton qui montre son intention de traverser est prioritaire, même s’il n’a pas encore posé le pied sur la chaussée.'],
    ['L', V({ env: 'campagne', s: ['AB4'], stopline: 1, inter: 1, speed: 20 }), 'À ce panneau, je dois :', ['marquer un arrêt complet à la ligne', 'm’arrêter seulement si un véhicule arrive', 'céder le passage aux véhicules de la route que j’aborde', 'passer en premier'], 'AC', 'Au stop, l’arrêt est obligatoire même si la voie est libre, puis on laisse passer les usagers de la route abordée.'],
    ['L', V({ env: 'ville', s: ['B1'], speed: 20 }), 'Je peux m’engager dans cette rue :', ['oui, en marche arrière', 'oui, pour me garer rapidement', 'non', 'oui, la nuit'], 'C', 'Le sens interdit s’applique à tous les véhicules, quelle que soit la manœuvre.'],
    ['L', V({ env: 'ville', bus: 1, speed: 40 }), 'À droite, une voie est réservée aux bus. Je peux l’emprunter :', ['pour doubler la file', 'pour tourner à droite au prochain carrefour, si le marquage le permet', 'à aucun moment, même pour tourner', 'si aucun bus n’arrive'], 'B', 'Une voie réservée est interdite aux autres véhicules. Seul un marquage discontinu permet de la traverser pour tourner ou accéder à une propriété.'],
    ['L', V({ env: 'autoroute', speed: 120 }), 'Sur autoroute, il est interdit :', ['de faire demi-tour', 'de rouler en marche arrière', 'de s’arrêter sur la bande d’arrêt d’urgence pour téléphoner', 'de dépasser par la gauche'], 'ABC', 'La bande d’arrêt d’urgence est réservée aux urgences et aux pannes. Le demi-tour et la marche arrière sont interdits, même sur la bande d’arrêt d’urgence.'],
    ['L', V({ env: 'autoroute', speed: 110 }), 'Par temps sec, sur la voie la plus à gauche d’une autoroute, la vitesse minimale est de :', ['50 km/h', '60 km/h', '80 km/h', 'il n’y en a pas'], 'C', 'Sur la voie de gauche d’une autoroute, en circulation fluide et par bonne visibilité, la vitesse minimale est de 80 km/h.'],
    ['L', V({ env: 'autoroute', veh2: 'voiture', speed: 90 }), 'Je m’insère sur l’autoroute depuis la voie d’accélération. Je :', ['cède le passage aux véhicules qui circulent sur l’autoroute', 'adapte ma vitesse à celle de la circulation', 'mets mon clignotant gauche', 'm’arrête systématiquement au bout de la voie'], 'ABC', 'La voie d’accélération sert à prendre la vitesse du trafic. Les véhicules déjà sur l’autoroute sont prioritaires. On ne s’arrête au bout de la voie qu’en dernier recours.'],
    ['L', V({ env: 'campagne', s: ['AB25', 'AB3a'], speed: 50 }), 'À l’entrée de ce giratoire, je laisse passer :', ['les véhicules qui circulent déjà sur l’anneau', 'les véhicules qui veulent entrer à ma droite', 'personne', 'les piétons qui traversent la branche où j’entre'], 'AD', 'Avec le cédez-le-passage à l’entrée, l’anneau est prioritaire. Les piétons engagés sur le passage le sont aussi.'],
    ['L', V({ env: 'ville', s: ['B52'], speed: 15 }), 'Dans cette zone :', ['la vitesse est limitée à 20 km/h', 'les piétons sont prioritaires sur les véhicules', 'les piétons peuvent marcher sur la chaussée', 'la vitesse est limitée à 30 km/h'], 'ABC', 'En zone de rencontre, les piétons peuvent circuler sur la chaussée et sont prioritaires. La vitesse est limitée à 20 km/h.'],
    ['L', V({ env: 'ville', s: ['B30'], speed: 30 }), 'Dans une zone 30 :', ['je ne dépasse pas 30 km/h', 'les cyclistes peuvent en principe circuler à double sens dans les rues à sens unique', 'les piétons ont toujours la priorité, partout', 'le stationnement est interdit'], 'AB', 'Sauf décision contraire du maire, les rues à sens unique d’une zone 30 sont à double sens pour les cyclistes.'],
    ['L', { card: 'L' }, 'Un agent tend le bras à l’horizontale, face à moi. Je :', ['m’arrête', 'peux passer', 'passe seulement pour tourner à droite', 'ralentis sans m’arrêter'], 'A', 'Bras tendu à l’horizontale : arrêt pour les usagers qui arrivent de face et de dos. Ceux qui arrivent sur le côté peuvent passer.'],
    ['L', { card: 'L' }, 'Un agent lève le bras à la verticale. Je :', ['m’arrête, sauf si je suis déjà engagé dans le carrefour', 'peux passer s’il ne me regarde pas', 'accélère pour dégager le carrefour, même si je n’y suis pas encore', 'ignore son geste si mon feu est vert'], 'A', 'Bras levé à la verticale : arrêt pour tous, sauf pour ceux qui sont déjà engagés dans l’intersection. L’agent l’emporte sur les feux.'],
    ['L', V({ env: 'ville', light: 'V', inter: 1, speed: 30 }), 'Le feu est vert, mais un agent me fait signe de m’arrêter. J’obéis :', ['au feu', 'à l’agent', 'au premier qui m’a donné un ordre', 'au panneau'], 'B', 'Les injonctions des agents passent avant les feux, eux-mêmes avant les panneaux, eux-mêmes avant les règles générales.'],
    ['L', V({ env: 'ville', veh: 'voiture', speed: 0 }), 'Je m’arrête en double file pour déposer un passager. C’est :', ['autorisé si c’est rapide', 'autorisé avec les feux de détresse', 'interdit', 'autorisé la nuit'], 'C', 'L’arrêt en double file est interdit : il est considéré comme gênant. Les feux de détresse n’y changent rien.'],
    ['L', V({ env: 'campagne', line: 'disc', veh: 'voiture', vehS: .5, speed: 70 }), 'Le véhicule devant moi a mis son clignotant gauche et s’est décalé pour tourner. Je peux le dépasser :', ['par la droite', 'par la gauche', 'en franchissant la ligne', 'par la droite, en klaxonnant'], 'A', 'On dépasse par la droite un véhicule qui a signalé qu’il tourne à gauche et qui s’est décalé vers le centre de la chaussée.'],
    ['L', V({ env: 'campagne', w: 'nuit', opp: 'voiture', speed: 80 }), 'La nuit, je croise un autre véhicule. J’utilise :', ['les feux de route', 'les feux de croisement', 'les feux de position seuls', 'les feux de brouillard arrière'], 'B', 'On passe en feux de croisement pour ne pas éblouir les usagers croisés ou suivis de près.'],
    ['L', V({ env: 'campagne', w: 'nuit', speed: 80 }), 'Je dois passer des feux de route aux feux de croisement :', ['quand je croise un véhicule', 'quand je suis un véhicule de près', 'quand la route est éclairée de façon continue et suffisante', 'jamais hors agglomération'], 'ABC', 'Les feux de route éblouissent : on les quitte en croisant ou en suivant un usager, et ils sont interdits sur une voie bien éclairée.'],
    ['L', V({ env: 'campagne', w: 'brouillard', speed: 50 }), 'Je peux allumer le feu de brouillard arrière :', ['par brouillard', 'par chute de neige', 'par forte pluie', 'la nuit sur route non éclairée'], 'AB', 'Le feu de brouillard arrière est réservé au brouillard et à la neige. Par pluie, il éblouirait les conducteurs qui suivent.'],
    ['L', V({ env: 'campagne', w: 'pluie', speed: 80 }), 'Je peux allumer les feux de brouillard avant :', ['par brouillard', 'par chute de neige', 'par forte pluie', 'en ville pour être mieux vu'], 'ABC', 'Les feux de brouillard avant sont permis par brouillard, chute de neige ou forte pluie. Ils sont aussi tolérés sur route étroite et sinueuse hors agglomération.'],
    ['L', V({ env: 'autoroute', veh: 'camion', speed: 90 }), 'Les feux de détresse servent notamment à :', ['signaler un ralentissement brutal sur autoroute', 'signaler un véhicule en panne', 'stationner en double file', 'remercier un conducteur'], 'AB', 'Les feux de détresse signalent un danger : véhicule immobilisé, ralentissement brusque ou dépose d’un passager dans un cas de force majeure.'],
    ['L', V({ env: 'ville', speed: 30 }), 'En agglomération, je peux utiliser l’avertisseur sonore :', ['en cas de danger immédiat', 'pour faire avancer la voiture de devant', 'pour saluer quelqu’un', 'pour annoncer un dépassement'], 'A', 'En agglomération, le klaxon est réservé au danger immédiat.'],
    ['L', V({ env: 'autoroute', speed: 110 }), 'Dans un tunnel, j’allume :', ['les feux de croisement', 'les feux de route', 'aucun feu de jour', 'le feu de brouillard arrière'], 'A', 'Les feux de croisement sont obligatoires dans les tunnels, même de jour et même s’ils sont éclairés.'],
    ['L', V({ env: 'ville', s: ['C12'], speed: 30 }), 'Dans cette rue, je peux circuler :', ['dans le sens indiqué seulement', 'en marche arrière sur quelques mètres pour revenir', 'à gauche ou à droite de la chaussée pour tourner', 'à contresens si la rue est vide'], 'AC', 'Dans une rue à sens unique, on peut se placer à gauche pour tourner à gauche. La marche arrière pour circuler à contresens est interdite.'],
    // ---- Le conducteur
    ['C', { card: 'C' }, 'Le taux d’alcool maximal autorisé pour un conducteur confirmé est de :', ['0,2 g par litre de sang', '0,5 g par litre de sang', '0,8 g par litre de sang', '0,25 mg par litre d’air expiré'], 'BD', '0,5 g/L de sang correspond à 0,25 mg/L d’air expiré. À partir de 0,8 g/L, c’est un délit.'],
    ['C', { card: 'C' }, 'En permis probatoire, le taux d’alcool maximal est de :', ['0,2 g par litre de sang', '0,5 g par litre de sang', '0 g, sans aucune tolérance', '0,1 mg par litre d’air expiré'], 'AD', 'Pendant la période probatoire, la limite est de 0,2 g/L de sang, soit 0,1 mg/L d’air expiré, ce qui interdit en pratique de boire avant de conduire.'],
    ['C', { card: 'C' }, 'Pour faire baisser le taux d’alcool plus vite, je peux :', ['boire un café', 'attendre', 'manger', 'prendre l’air'], 'B', 'Seul le temps élimine l’alcool, environ 0,10 à 0,15 g/L par heure. Café, eau ou air frais n’y changent rien.'],
    ['C', { card: 'C' }, 'Un verre d’alcool servi au bar fait monter le taux d’environ :', ['0,05 g/L', '0,20 à 0,25 g/L', '0,5 g/L', '1 g/L'], 'B', 'Un verre standard, quelle que soit la boisson servie au bar, apporte la même quantité d’alcool : environ 0,20 à 0,25 g/L.'],
    ['C', { card: 'C' }, 'Un médicament porte un pictogramme rouge de niveau 3. Je :', ['peux conduire avec prudence', 'ne conduis pas', 'demande l’avis d’un médecin avant de conduire', 'conduis seulement de jour'], 'BC', 'Niveau 1 jaune : soyez prudent. Niveau 2 orange : soyez très prudent. Niveau 3 rouge : ne conduisez pas, et demandez l’avis d’un médecin avant de reprendre le volant.'],
    ['C', V({ env: 'autoroute', speed: 110 }), 'Je ressens les premiers signes de fatigue. Je :', ['m’arrête et fais une sieste de 15 à 20 minutes', 'ouvre la fenêtre et monte le son', 'bois un café et je repars aussitôt', 'roule plus vite pour arriver plus tôt'], 'A', 'Seul le repos est efficace. Il est conseillé de faire une pause toutes les deux heures.'],
    ['C', { card: 'C' }, 'Parmi ces signes, lesquels annoncent la somnolence ?', ['des bâillements', 'des picotements dans les yeux', 'une raideur de la nuque', 'une meilleure concentration'], 'ABC', 'Bâillements, yeux qui piquent, nuque raide, envie de bouger : il faut s’arrêter.'],
    ['C', V({ env: 'ville', speed: 30 }), 'En conduisant, je peux téléphoner :', ['avec le téléphone tenu en main', 'avec des écouteurs dans les oreilles', 'avec le système mains libres intégré au véhicule', 'jamais, quel que soit le système'], 'C', 'Le téléphone tenu en main et tout ce qui se porte sur l’oreille sont interdits (135 € et 3 points). Le dispositif intégré au véhicule est toléré, mais il reste source de distraction.'],
    ['C', V({ env: 'autoroute', speed: 130 }), 'Quand ma vitesse augmente, mon champ de vision :', ['s’élargit', 'se rétrécit', 'ne change pas', 'devient plus net sur les côtés'], 'B', 'À 130 km/h, le champ de vision utile n’est plus que d’environ 30 degrés : les dangers latéraux sont détectés plus tard.'],
    ['C', { card: 'C' }, 'Si je roule deux fois plus vite, l’énergie à dissiper en cas de choc est :', ['deux fois plus grande', 'trois fois plus grande', 'quatre fois plus grande', 'la même'], 'C', 'L’énergie cinétique dépend du carré de la vitesse.'],
    ['C', { card: 'C' }, 'Un choc à 50 km/h équivaut à peu près à une chute :', ['d’un mètre', 'de 10 mètres, environ trois étages', 'de 50 mètres', 'sans gravité si on est attaché'], 'B', 'À 50 km/h, le choc correspond à une chute d’environ 10 mètres.'],
    ['C', { card: 'C' }, 'Mon temps de réaction s’allonge :', ['avec la fatigue', 'après avoir bu de l’alcool', 'en téléphonant', 'en roulant plus vite'], 'ABC', 'Le temps de réaction moyen est d’environ une seconde. La fatigue, l’alcool, les drogues et les distractions l’allongent. La vitesse, elle, allonge la distance parcourue pendant ce temps.'],
    ['C', V({ env: 'ville', veh2: 'moto', speed: 40 }), 'Avant de changer de voie, je regarde :', ['dans le rétroviseur intérieur', 'dans le rétroviseur extérieur', 'dans l’angle mort en tournant la tête', 'seulement devant moi'], 'ABC', 'Les rétroviseurs ne montrent pas tout : un coup d’œil dans l’angle mort est indispensable avant de déboîter.'],
    ['C', { card: 'C' }, 'Conduire après avoir consommé du cannabis :', ['est autorisé si on se sent bien', 'est un délit', 'fait perdre 6 points', 'est toléré en dessous d’un certain taux'], 'BC', 'La conduite après usage de stupéfiants est un délit, quelle que soit la quantité. Elle coûte 6 points.'],
    // ---- La route
    ['R', V({ env: 'campagne', w: 'pluie', line: 'disc', speed: 80 }), 'Sur route mouillée, la distance de freinage :', ['est plus courte', 'est la même', 'augmente fortement', 'dépend de l’état de mes pneus'], 'CD', 'Sur chaussée mouillée, l’adhérence baisse : la distance de freinage augmente nettement, d’autant plus que les pneus sont usés.'],
    ['R', V({ env: 'autoroute', w: 'pluie', speed: 110 }), 'Le volant devient léger sous forte pluie. C’est un début d’aquaplaning. Je :', ['freine fort', 'lève le pied de l’accélérateur', 'tiens le volant sans brusquerie', 'accélère pour traverser la flaque'], 'BC', 'En aquaplaning, les pneus ne touchent plus la route. On relâche l’accélérateur, on garde le volant droit et on évite de freiner brutalement.'],
    ['R', V({ env: 'campagne', curve: .9, line: 'cont', s: ['A1a'], speed: 60 }), 'À l’approche d’un virage, je réduis ma vitesse :', ['avant le virage', 'au milieu du virage', 'à la sortie du virage', 'jamais si la route est sèche'], 'A', 'On ralentit en ligne droite, avant d’entrer dans le virage, pour garder l’adhérence.'],
    ['R', V({ env: 'autoroute', w: 'brouillard', speed: 50 }), 'Sur autoroute, les balises blanches du bord de la route sont espacées de :', ['25 m', '50 m', '100 m', '200 m'], 'B', 'Les balises sont espacées de 50 m. Si on n’en voit pas deux, la visibilité est inférieure à 50 m : la vitesse est alors limitée à 50 km/h.'],
    ['R', V({ env: 'campagne', w: 'nuit', speed: 70 }), 'Les feux de croisement éclairent la route sur environ :', ['10 m', '30 m', '100 m', '300 m'], 'B', 'Les feux de croisement éclairent environ 30 m, les feux de route environ 100 m.'],
    ['R', V({ env: 'campagne', w: 'nuit', opp: 'voiture', speed: 70 }), 'Un véhicule en face m’éblouit. Je :', ['regarde le bord droit de la chaussée', 'ralentis', 'allume mes feux de route pour lui faire comprendre', 'fixe ses phares'], 'AB', 'On ralentit et on regarde le bord droit de la route pour garder sa trajectoire sans être aveuglé.'],
    ['R', V({ env: 'campagne', s: ['A8'], curve: -.4, line: 'cont', speed: 60 }), 'Dans une longue descente, je :', ['utilise le frein moteur en rétrogradant', 'freine en continu tout du long', 'roule au point mort pour économiser', 'garde la même vitesse qu’en côte'], 'A', 'Le frein moteur évite d’échauffer les freins. Rouler au point mort est dangereux et interdit en descente.'],
    ['R', V({ env: 'campagne', w: 'neige', speed: 40 }), 'Par temps froid, le verglas se forme d’abord :', ['sur les ponts', 'dans les zones à l’ombre', 'en plein soleil', 'dans les tunnels'], 'AB', 'Les ponts refroidissent par en dessous et les zones à l’ombre ne sont pas réchauffées : le verglas y apparaît en premier.'],
    ['R', V({ env: 'campagne', w: 'neige', veh: 'voiture', speed: 40 }), 'Sur route enneigée :', ['j’augmente les distances de sécurité', 'je démarre en douceur, sur un rapport plus élevé si possible', 'je freine fort pour tester l’adhérence', 'je garde les mêmes distances qu’au sec'], 'AB', 'Sur neige, on adoucit toutes les actions et on augmente beaucoup les distances.'],
    ['R', V({ env: 'campagne', s: ['A3'], speed: 60 }), 'Ce panneau m’annonce :', ['une chaussée rétrécie', 'une route à sens unique', 'un pont mobile', 'la fin d’une voie de dépassement'], 'A', 'Le panneau de danger A3 signale que la chaussée se rétrécit.'],
    ['R', V({ env: 'campagne', s: ['A14'], speed: 60 }), 'Ce panneau m’indique :', ['un danger particulier', 'un accident', 'la fin de tous les dangers', 'un endroit où le stationnement est interdit'], 'A', 'Le panneau « autres dangers » est souvent complété par un panonceau qui précise la nature du danger.'],
    ['R', V({ env: 'campagne', anim: 1, speed: 70 }), 'Un animal sauvage traverse devant moi. Je :', ['freine fermement en gardant le volant droit', 'donne un coup de volant pour l’éviter', 'klaxonne et accélère', 'reste attentif : d’autres animaux peuvent suivre'], 'AD', 'Un coup de volant fait souvent perdre le contrôle. Les animaux sauvages se déplacent souvent en groupe.'],
    ['R', V({ env: 'campagne', line: 'disc', speed: 80 }), 'Des gravillons recouvrent la chaussée. Je :', ['ralentis', 'augmente la distance avec le véhicule qui me précède', 'freine brusquement', 'dépasse pour ne pas recevoir de projections'], 'AB', 'Les gravillons réduisent l’adhérence et peuvent briser un pare-brise. On ralentit et on s’écarte de celui qui précède.'],
    ['R', V({ env: 'autoroute', speed: 110 }), 'Le vent latéral est plus fort :', ['à la sortie d’une forêt', 'sur un pont', 'en dépassant un camion', 'dans une rue étroite'], 'ABC', 'Le vent latéral surprend dans les zones dégagées : sortie de bois, pont, viaduc, ou quand on sort de l’abri d’un poids lourd.'],
    // ---- Les autres usagers
    ['U', V({ env: 'campagne', line: 'disc', veh: 'velo', speed: 60 }), 'Hors agglomération, je dépasse un cycliste. Je laisse un écart latéral d’au moins :', ['50 cm', '1 m', '1,50 m', '3 m'], 'C', 'L’écart minimal est de 1,50 m hors agglomération et de 1 m en agglomération.'],
    ['U', V({ env: 'ville', veh: 'velo', speed: 30 }), 'En agglomération, je dépasse un cycliste. Je laisse un écart latéral d’au moins :', ['50 cm', '1 m', '1,50 m', '2 m'], 'B', 'L’écart minimal est de 1 m en agglomération et de 1,50 m hors agglomération.'],
    ['U', V({ env: 'ville', kids: 1, ball: 1, speed: 30 }), 'Un ballon roule sur la chaussée. Je :', ['ralentis fortement et me prépare à m’arrêter', 'm’attends à voir un enfant surgir', 'klaxonne et je continue', 'contourne le ballon sans ralentir'], 'AB', 'Un enfant court souvent derrière son ballon, sans regarder.'],
    ['U', V({ env: 'ville', veh: 'bus', speed: 20 }), 'En agglomération, le bus devant moi met son clignotant pour quitter l’arrêt. Je :', ['le laisse partir', 'le dépasse rapidement', 'klaxonne', 'ralentis et m’arrête si nécessaire'], 'AD', 'En agglomération, on doit faciliter le départ d’un bus qui signale qu’il quitte son arrêt.'],
    ['U', V({ env: 'ville', speed: 50 }), 'J’entends une sirène et vois un gyrophare bleu derrière moi. Je :', ['facilite le passage du véhicule', 'me range à droite quand c’est possible', 'freine brutalement au milieu de la voie', 'franchis un feu rouge sans précaution pour libérer la voie'], 'AB', 'On facilite le passage des véhicules prioritaires en se décalant sans danger, sans commettre d’infraction dangereuse.'],
    ['U', V({ env: 'ville', zebra: 1, ped: 1, speed: 20 }), 'Un piéton avec une canne blanche traverse. Il :', ['est prioritaire', 'doit me laisser passer s’il n’est pas sur le passage', 'peut ne pas me voir venir', 'me fait signe de passer, donc je passe sans regarder'], 'AC', 'Une personne aveugle ou malvoyante est toujours prioritaire, où qu’elle traverse.'],
    ['U', V({ env: 'ville', veh: 'camion', speed: 20 }), 'Un poids lourd devant moi s’apprête à tourner à droite. Je :', ['reste derrière lui', 'me méfie : il peut se décaler à gauche avant de tourner', 'le dépasse par la droite', 'reste en dehors de ses angles morts'], 'ABD', 'Les poids lourds ont de grands angles morts et s’écartent avant de tourner. Il ne faut pas se glisser à leur droite.'],
    ['U', V({ env: 'campagne', veh: 'tracteur', line: 'cont', speed: 30 }), 'Un tracteur roule devant moi sur une ligne continue. Je :', ['reste patiemment derrière lui', 'franchis la ligne pour le dépasser', 'colle le tracteur pour qu’il se range', 'attends un endroit où le dépassement est autorisé'], 'AD', 'On ne franchit pas une ligne continue pour dépasser un véhicule à moteur. Le tracteur se rangera souvent quand il le pourra.'],
    ['U', V({ env: 'campagne', line: 'disc', speed: 50 }), 'Je croise des cavaliers. Je :', ['ralentis', 'leur laisse un large espace', 'klaxonne pour les prévenir', 'accélère pour passer vite'], 'AB', 'Les chevaux peuvent s’effrayer. On ralentit, on s’écarte et on évite tout bruit.'],
    ['U', V({ env: 'ville', speed: 30 }), 'Les trottinettes électriques circulent en ville :', ['sur les pistes et bandes cyclables quand il y en a', 'sur les trottoirs', 'à 25 km/h au maximum', 'sur l’autoroute'], 'AC', 'Les trottinettes électriques sont limitées à 25 km/h. Elles circulent sur les aménagements cyclables, sinon sur la chaussée là où la vitesse est limitée à 50 km/h ou moins. Le trottoir leur est interdit, sauf autorisation locale.'],
    ['U', V({ env: 'ville', veh: 'voiture', speed: 30 }), 'Une voiture électrique démarre devant des piétons. Elle :', ['est très silencieuse à basse vitesse', 'peut surprendre les piétons', 'n’a pas besoin de céder le passage', 'est prioritaire'], 'AB', 'À basse vitesse, une voiture électrique fait peu de bruit : les piétons risquent de ne pas l’entendre arriver.'],
    // ---- Réglementation
    ['D', { card: 'D' }, 'Un permis probatoire démarre avec :', ['12 points', '6 points', '8 points', '0 point'], 'B', 'Le permis probatoire démarre avec 6 points. Il atteint 12 points au bout de 3 ans sans infraction, ou 2 ans après une conduite accompagnée.'],
    ['D', { card: 'D' }, 'Sans infraction, un jeune conducteur qui n’a pas fait de conduite accompagnée gagne chaque année :', ['1 point', '2 points', '3 points', '6 points'], 'B', '2 points par an en filière classique, 3 points par an après une conduite accompagnée.'],
    ['D', { card: 'D' }, 'Téléphoner avec le téléphone tenu en main coûte :', ['1 point', '3 points', '6 points', 'aucun point'], 'B', 'C’est une amende de 135 € et un retrait de 3 points.'],
    ['D', { card: 'D' }, 'Ne pas respecter un feu rouge ou un stop coûte :', ['2 points', '4 points', '6 points', '1 point'], 'B', 'Feu rouge et stop : 4 points et une amende de 135 €, avec une possible suspension du permis.'],
    ['D', { card: 'D' }, 'Un excès de vitesse de moins de 20 km/h, hors agglomération (limite au-dessus de 50 km/h), coûte :', ['1 point', '2 points', '3 points', '4 points'], 'A', 'Moins de 20 km/h : 1 point. De 20 à 29 : 2 points. De 30 à 39 : 3 points. De 40 à 49 : 4 points. 50 km/h ou plus : 6 points.'],
    ['D', { card: 'D' }, 'Conduire avec un taux d’alcool entre 0,5 et 0,8 g/L de sang coûte :', ['3 points', '4 points', '6 points', 'aucun point'], 'C', 'C’est une contravention avec un retrait de 6 points, soit tout le capital d’un permis probatoire de première année.'],
    ['D', { card: 'D' }, 'L’assurance de responsabilité civile est :', ['obligatoire pour tout véhicule terrestre à moteur', 'facultative si le véhicule reste au garage', 'obligatoire seulement pour les jeunes conducteurs', 'remplacée par le contrôle technique'], 'A', 'Tout véhicule à moteur doit être assuré au minimum en responsabilité civile, même s’il ne roule pas.'],
    ['D', { card: 'D' }, 'Après un accrochage sans blessé, le constat amiable :', ['se remplit avec l’autre conducteur', 'est signé par les deux conducteurs', 'doit être envoyé à l’assureur dans les 5 jours ouvrés', 'peut être modifié après signature, seul'], 'ABC', 'Une fois signé par les deux parties, le constat ne doit plus être modifié. On l’envoie à son assureur sous 5 jours ouvrés.'],
    ['D', { card: 'D' }, 'Une voiture particulière neuve passe son premier contrôle technique :', ['au bout d’un an', 'au bout de 4 ans', 'au bout de 10 ans', 'jamais'], 'B', 'Premier contrôle technique dans les 6 mois avant son 4e anniversaire, puis tous les 2 ans.'],
    ['D', { card: 'D' }, 'Avec le permis B, je peux conduire un véhicule :', ['de 3,5 t de PTAC au maximum', 'de 9 places au maximum, conducteur compris', 'de 12 places', 'tractant une remorque de 750 kg de PTAC au maximum, quel que soit l’ensemble'], 'ABD', 'Le permis B couvre les véhicules jusqu’à 3,5 t et 9 places, avec une remorque de 750 kg au plus. Au-delà, il faut sous conditions la formation B96 ou le permis BE.'],
    ['D', { card: 'D' }, 'Après un déménagement, je dois mettre à jour le certificat d’immatriculation dans un délai de :', ['15 jours', '1 mois', '3 mois', '1 an'], 'B', 'Le changement d’adresse se déclare dans le mois qui suit.'],
    ['D', { card: 'D' }, 'Un stage de sensibilisation à la sécurité routière permet de récupérer jusqu’à :', ['2 points', '4 points', '6 points', 'tous les points'], 'B', 'Le stage volontaire rend jusqu’à 4 points, dans la limite du plafond du permis, une fois par an au plus.'],
    ['D', V({ env: 'ville', speed: 30 }), 'Dans une zone à faibles émissions, je dois :', ['afficher une vignette Crit’Air sur mon pare-brise', 'respecter les restrictions selon la catégorie de mon véhicule', 'rouler à 20 km/h', 'avoir un véhicule électrique'], 'AB', 'Les zones à faibles émissions limitent la circulation de certains véhicules selon leur vignette Crit’Air.'],
    // ---- Premiers secours
    ['P', { card: 'P' }, 'Face à un accident, les gestes se font dans cet ordre :', ['protéger, alerter, secourir', 'alerter, secourir, protéger', 'secourir, protéger, alerter', 'protéger, secourir, alerter'], 'A', 'On protège d’abord pour éviter un suraccident, puis on alerte, puis on secourt.'],
    ['P', { card: 'P' }, 'Pour alerter les secours, je peux composer :', ['le 15', 'le 18', 'le 112', 'le 12'], 'ABC', '15 : SAMU. 18 : pompiers. 112 : numéro d’urgence européen. 114 : par SMS, pour les personnes sourdes ou malentendantes.'],
    ['P', V({ env: 'campagne', speed: 0 }), 'Pour protéger les lieux d’un accident, je :', ['mets mon gilet de haute visibilité', 'allume mes feux de détresse', 'place le triangle à au moins 30 m en amont', 'dépose le triangle juste derrière les véhicules accidentés'], 'ABC', 'Le triangle se pose à au moins 30 m en amont pour prévenir à temps les usagers qui arrivent.'],
    ['P', { card: 'P' }, 'Je peux déplacer un blessé :', ['s’il risque d’être pris dans un incendie', 'pour le mettre plus à l’aise', 'pour le placer dans ma voiture', 'jamais, même en cas de danger grave'], 'A', 'On ne déplace une victime qu’en cas de danger réel, immédiat et impossible à écarter.'],
    ['P', { card: 'P' }, 'Un motard blessé est inconscient. Je :', ['lui retire son casque', 'laisse son casque en place', 'vérifie s’il respire', 'lui donne à boire'], 'BC', 'On ne retire pas le casque d’un motard, sauf geste de survie réalisé par une personne formée. On ne donne jamais à boire.'],
    ['P', { card: 'P' }, 'La victime est inconsciente et respire. Je :', ['la place en position latérale de sécurité', 'commence un massage cardiaque', 'surveille sa respiration en attendant les secours', 'la fais asseoir'], 'AC', 'La position latérale de sécurité garde les voies respiratoires libres.'],
    ['P', { card: 'P' }, 'La victime est inconsciente et ne respire plus. Je :', ['fais alerter et j’envoie chercher un défibrillateur', 'pratique un massage cardiaque', 'la place en position latérale de sécurité', 'attends les secours sans la toucher'], 'AB', 'Sans respiration, chaque minute compte : massage cardiaque et défibrillateur automatisé externe.'],
    ['P', { card: 'P' }, 'Le massage cardiaque se pratique à un rythme d’environ :', ['30 compressions par minute', '60 compressions par minute', '100 à 120 compressions par minute', '200 compressions par minute'], 'C', 'On comprime le centre du thorax à un rythme de 100 à 120 compressions par minute.'],
    ['P', { card: 'P' }, 'Un blessé saigne abondamment. Je :', ['appuie fortement sur la plaie', 'surélève la plaie sans appuyer', 'lui donne de l’aspirine', 'attends les secours sans intervenir'], 'A', 'On arrête une hémorragie par compression directe de la plaie, avec la main protégée si possible.'],
    ['P', { card: 'P' }, 'Dans mon message d’alerte, je donne :', ['le lieu précis de l’accident', 'le nombre de victimes et leur état', 'les risques particuliers, comme un incendie', 'les noms des conducteurs'], 'ABC', 'Lieu précis, nature de l’accident, nombre et état des victimes, dangers éventuels. On ne raccroche que lorsque l’opérateur le demande.'],
    // ---- Prendre et quitter son véhicule
    ['Q', { card: 'Q' }, 'Avant de démarrer, je :', ['règle mon siège', 'règle mes rétroviseurs', 'boucle ma ceinture', 'règle l’écran pendant que je roule'], 'ABC', 'Tous les réglages se font à l’arrêt.'],
    ['Q', V({ env: 'ville', veh2: 'velo', speed: 0 }), 'Je suis garé en ville. Avant d’ouvrir ma portière, je :', ['regarde dans le rétroviseur', 'tourne la tête pour vérifier l’angle mort', 'ouvre en grand d’un coup', 'ouvre avec la main opposée à la portière pour mieux voir derrière'], 'ABD', 'Ouvrir avec la main opposée oblige à tourner le buste et à voir un cycliste qui arrive.'],
    ['Q', { card: 'Q' }, 'Je me gare dans une descente, le long d’un trottoir. Je :', ['serre le frein à main', 'tourne les roues vers le trottoir', 'engage une vitesse ou la position P', 'laisse les roues droites'], 'ABC', 'Roues braquées vers le trottoir, frein à main et vitesse engagée : la voiture ne peut pas partir seule.'],
    ['Q', { card: 'Q' }, 'Je quitte mon véhicule garé. Je :', ['coupe le moteur', 'retire la clé', 'ne laisse pas d’enfant seul à l’intérieur', 'laisse tourner le moteur pour garder la climatisation'], 'ABC', 'Moteur coupé, clé retirée, enfants et animaux jamais seuls dans le véhicule.'],
    ['Q', { card: 'Q' }, 'L’appui-tête est bien réglé quand :', ['son haut arrive au niveau du haut de la tête', 'il est placé au niveau de la nuque', 'il est le plus bas possible', 'il est retiré'], 'A', 'Bien placé, l’appui-tête limite le coup du lapin en cas de choc arrière.'],
    ['Q', V({ env: 'ville', speed: 0 }), 'Je quitte une place de stationnement. Je :', ['mets mon clignotant', 'vérifie les rétroviseurs et l’angle mort', 'laisse passer les véhicules qui circulent', 'suis prioritaire puisque je suis déjà là'], 'ABC', 'Celui qui quitte un stationnement s’insère dans la circulation : il doit laisser passer les autres usagers.'],
    ['Q', { card: 'Q' }, 'Le moteur est froid. Je :', ['démarre et roule tranquillement', 'le laisse chauffer à l’arrêt plusieurs minutes', 'monte dans les tours dès le démarrage', 'roule en souplesse les premiers kilomètres'], 'AD', 'Un moteur moderne chauffe en roulant. Le faire chauffer à l’arrêt pollue et consomme pour rien.'],
    ['Q', { card: 'Q' }, 'Je règle les rétroviseurs extérieurs pour :', ['voir le moins possible la carrosserie de ma voiture', 'voir la route derrière et sur le côté', 'supprimer complètement l’angle mort', 'voir mes passagers'], 'AB', 'Bien réglés, les rétroviseurs réduisent l’angle mort sans jamais le supprimer.'],
    // ---- Mécanique et équipements
    ['M', { card: 'M' }, 'La profondeur minimale légale des sculptures d’un pneu est de :', ['0,5 mm', '1,6 mm', '3 mm', '5 mm'], 'B', 'En dessous de 1,6 mm, le pneu est interdit. Des témoins d’usure sont moulés dans les rainures.'],
    ['M', { card: 'M' }, 'Je vérifie la pression des pneus :', ['à froid', 'après un long trajet', 'au moins une fois par mois', 'seulement au contrôle technique'], 'AC', 'La pression se contrôle à froid. Un pneu sous-gonflé s’use vite, consomme plus et tient moins bien la route.'],
    ['M', { card: 'M' }, 'L’ABS :', ['empêche les roues de se bloquer au freinage', 'permet de garder le contrôle de la direction en freinant fort', 'réduit toujours la distance de freinage', 'remplace le frein à main'], 'AB', 'L’ABS garde la direction dirigeable en freinage d’urgence. Il ne garantit pas une distance plus courte, surtout sur neige ou gravillons.'],
    ['M', { card: 'M' }, 'Le limiteur de vitesse :', ['m’empêche de dépasser la vitesse que j’ai choisie', 'maintient automatiquement ma vitesse', 'freine à ma place', 'peut être dépassé en enfonçant franchement l’accélérateur'], 'AD', 'Le limiteur plafonne la vitesse. Le régulateur, lui, la maintient.'],
    ['M', { card: 'M' }, 'Je vérifie le niveau d’huile :', ['moteur froid', 'véhicule sur un sol plat', 'moteur en marche', 'en pente'], 'AB', 'Le niveau se lit moteur arrêté et froid, voiture à plat, entre les repères de la jauge.'],
    ['M', { card: 'M' }, 'Dans les zones de montagne concernées, du 1er novembre au 31 mars, je dois :', ['avoir des pneus hiver ou toutes saisons', 'ou bien avoir des chaînes ou chaussettes dans le coffre', 'rouler à 50 km/h', 'avoir des pneus à clous'], 'AB', 'La loi Montagne impose, dans les communes concernées, des pneus adaptés ou des équipements antidérapants dans le coffre.'],
    ['M', { card: 'M' }, 'Mon coffre est très chargé. Je règle :', ['la hauteur des phares', 'la pression des pneus', 'le volume de la radio', 'le régulateur de vitesse'], 'AB', 'La charge relève l’avant : on baisse les phares pour ne pas éblouir. Les pneus se gonflent selon la charge indiquée par le constructeur.'],
    // ---- Sécurité des passagers
    ['S', { card: 'S' }, 'Le port de la ceinture est obligatoire :', ['à l’avant', 'à l’arrière', 'en ville aussi', 'seulement sur autoroute'], 'ABC', 'La ceinture est obligatoire à toutes les places équipées, partout.'],
    ['S', { card: 'S' }, 'Un passager de 15 ans n’a pas bouclé sa ceinture. Qui est sanctionné ?', ['le passager', 'le conducteur', 'personne', 'les parents'], 'B', 'Le conducteur est responsable des passagers mineurs.'],
    ['S', { card: 'S' }, 'Un enfant de moins de 10 ans voyage :', ['dans un siège ou un rehausseur adapté à sa taille et à son poids', 'tenu sur les genoux d’un adulte', 'avec une simple ceinture d’adulte s’il est sage', 'à l’avant dès 6 ans'], 'A', 'Jusqu’à 10 ans, un système de retenue adapté est obligatoire. Sauf cas particuliers, l’enfant voyage à l’arrière.'],
    ['S', { card: 'S' }, 'J’installe un siège bébé dos à la route à l’avant. Je dois :', ['désactiver l’airbag frontal passager', 'laisser l’airbag activé', 'reculer le siège au maximum', 'le mettre face à la route'], 'A', 'Un airbag qui se déclenche face à un siège dos à la route peut blesser gravement le bébé.'],
    ['S', { card: 'S' }, 'Une femme enceinte place la sangle basse de la ceinture :', ['sous le ventre, sur le haut des cuisses', 'sur le ventre', 'derrière le dos', 'elle est dispensée de ceinture'], 'A', 'La sangle basse passe sous le ventre, sur le bassin. La sangle haute passe entre les seins.'],
    ['S', { card: 'S' }, 'Les objets lourds dans l’habitacle :', ['peuvent devenir des projectiles en cas de choc', 'doivent être rangés dans le coffre ou attachés', 'peuvent aller sur la plage arrière', 'ne présentent aucun danger à faible vitesse'], 'AB', 'À 50 km/h, un objet pèse en cas de choc des dizaines de fois son poids.'],
    ['S', { card: 'S' }, 'Le gilet de haute visibilité doit être :', ['à portée de main, dans l’habitacle', 'dans le coffre, sous les bagages', 'porté avant de sortir du véhicule immobilisé en urgence', 'facultatif'], 'AC', 'Le gilet s’enfile avant de sortir. Le triangle de présignalisation est aussi obligatoire.'],
    ['S', { card: 'S' }, 'J’installe un porte-vélos arrière. Il ne doit pas masquer :', ['la plaque d’immatriculation', 'les feux arrière', 'le pare-brise avant', 'les rétroviseurs extérieurs'], 'AB', 'S’ils sont masqués, la plaque et les feux doivent être reportés sur le porte-vélos.'],
    // ---- Environnement
    ['E', { card: 'E' }, 'Pour consommer moins, je :', ['anticipe et roule en souplesse', 'passe rapidement les rapports supérieurs', 'retire le coffre de toit inutilisé', 'garde la climatisation au maximum'], 'ABC', 'L’écoconduite réduit la consommation d’environ 15 %. La climatisation et le coffre de toit font surconsommer.'],
    ['E', V({ env: 'autoroute', speed: 120 }), 'Sur autoroute, rouler à 120 km/h au lieu de 130 km/h :', ['réduit la consommation', 'allonge peu le temps de trajet', 'augmente la consommation', 'est interdit'], 'AB', 'Quelques minutes de plus sur un long trajet, pour une consommation nettement plus faible.'],
    ['E', { card: 'E' }, 'Des pneus sous-gonflés :', ['augmentent la consommation', 's’usent plus vite', 'diminuent la consommation', 'n’ont aucun effet'], 'AB', 'Un pneu sous-gonflé résiste davantage au roulement et chauffe.'],
    ['E', { card: 'E' }, 'Après une vidange faite moi-même, l’huile usagée :', ['se jette dans un égout', 'se dépose en déchetterie ou dans un garage', 'se verse dans la terre', 'se met avec les ordures ménagères'], 'B', 'Un litre d’huile peut polluer une très grande surface d’eau. Elle se recycle en déchetterie ou en garage.'],
    ['E', { card: 'E' }, 'Les premiers kilomètres, moteur froid :', ['le véhicule pollue davantage', 'le véhicule consomme davantage', 'le véhicule pollue moins', 'il faut rouler vite pour chauffer le moteur'], 'AB', 'À froid, le moteur consomme et pollue plus : les trajets très courts en voiture sont les moins efficaces.'],
    ['E', V({ env: 'ville', speed: 30 }), 'Pour réduire le bruit en ville, je :', ['évite les accélérations brusques', 'n’utilise pas l’avertisseur sans raison', 'monte haut dans les tours', 'roule fenêtres ouvertes avec la musique forte'], 'AB', 'Le bruit routier est une pollution. Un échappement modifié pour faire du bruit est interdit.'],
  ];
  H.forEach((x, i) => add('h' + i, ...x));

  /* ================= 2. Générateurs ================= */
  const pick = (arr, seed, n, avoid) => { const out = [], used = new Set(avoid); let k = seed; while (out.length < n) { const v = arr[k % arr.length]; if (!used.has(v)) { out.push(v); used.add(v); } k = (k * 7 + 3) % 9973; } return out; };
  /* place les réponses : la position de la bonne réponse varie d'une question à l'autre */
  const place = (good, bad, seed) => { const all = good.map((t) => [t, 1]).concat(bad.map((t) => [t, 0])); const r = seed % all.length; const o = all.slice(r).concat(all.slice(0, r)); return { o: o.map((x) => x[0]), ok: o.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) }; };
  const hash = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 100003; return h; };

  /* ---- 2a. Panneaux : sens et conséquences ---- */
  const SG = [
    // code, famille, sens, décor, vrais, faux
    ['A1a', 'D', 'Virage à droite', 'campagne', ['Je ralentis avant le virage'], ['Je peux dépasser avant le virage', 'J’accélère dans le virage']],
    ['A1b', 'D', 'Virage à gauche', 'campagne', ['Je ralentis avant le virage'], ['Je me place au centre de la chaussée']],
    ['A1c', 'D', 'Succession de virages, le premier à droite', 'campagne', ['Je ralentis avant les virages'], ['Le premier virage est à gauche']],
    ['A2b', 'D', 'Ralentisseur de type dos-d’âne', 'ville', ['Je ralentis avant le ralentisseur'], ['Je dois m’arrêter devant le ralentisseur']],
    ['A3', 'D', 'Chaussée rétrécie', 'campagne', ['Je me prépare à croiser plus serré, voire à laisser passer'], ['Je suis prioritaire dans le passage étroit']],
    ['A4', 'D', 'Chaussée particulièrement glissante', 'campagne', ['J’évite les freinages et les coups de volant brusques'], ['Je freine fort pour tester l’adhérence']],
    ['A8', 'D', 'Descente dangereuse', 'campagne', ['J’utilise le frein moteur'], ['Je roule au point mort pour économiser']],
    ['A13a', 'D', 'Endroit fréquenté par des enfants', 'ville', ['Je ralentis et redouble d’attention'], ['Les enfants doivent me céder le passage']],
    ['A13b', 'D', 'Passage pour piétons', 'ville', ['Je me prépare à céder le passage aux piétons'], ['Je klaxonne pour prévenir les piétons']],
    ['A14', 'D', 'Autres dangers', 'campagne', ['Un danger particulier m’attend, souvent précisé par un panonceau'], ['Tous les dangers prennent fin']],
    ['A17', 'D', 'Feux tricolores', 'campagne', ['Je me prépare à m’arrêter à des feux'], ['Je suis prioritaire au prochain carrefour']],
    ['A18', 'D', 'Circulation dans les deux sens', 'campagne', ['Des véhicules vont arriver en face'], ['La route devient à sens unique']],
    ['A21', 'D', 'Débouché de cyclistes venant de droite ou de gauche', 'campagne', ['Des cyclistes peuvent surgir d’une piste cyclable'], ['Les cyclistes sont interdits sur cette route']],
    ['AB1', 'D', 'Intersection où s’applique la priorité à droite', 'campagne', ['Je laisse passer les véhicules venant de ma droite'], ['Je suis prioritaire', 'Je dois marquer l’arrêt']],
    ['AB2', 'D', 'Intersection où je suis prioritaire', 'campagne', ['Ma priorité vaut pour cette intersection seulement'], ['Je laisse passer les véhicules venant de droite', 'Je suis prioritaire jusqu’au prochain panneau de fin']],
    ['AB25', 'D', 'Carrefour à sens giratoire', 'campagne', ['Je devrai en principe céder le passage aux véhicules sur l’anneau'], ['Je serai prioritaire sur l’anneau dès mon entrée']],
    ['AB3a', 'P', 'Cédez le passage à l’intersection', 'campagne', ['Je laisse passer les véhicules de la route que j’aborde', 'Je ne m’arrête que si c’est nécessaire'], ['Je dois toujours marquer l’arrêt', 'La priorité à droite s’applique']],
    ['AB4', 'P', 'Arrêt obligatoire à l’intersection', 'campagne', ['Je marque un arrêt complet, même si la voie est libre', 'Je laisse passer les véhicules de la route que j’aborde'], ['Je peux passer sans m’arrêter si personne ne vient', 'Je suis prioritaire']],
    ['AB6', 'P', 'Route à caractère prioritaire', 'campagne', ['Je suis prioritaire aux prochaines intersections', 'Hors agglomération, le stationnement sur la chaussée y est interdit'], ['Je laisse passer les véhicules venant de droite', 'Je dois m’arrêter aux intersections']],
    ['AB7', 'P', 'Fin de route à caractère prioritaire', 'campagne', ['Je ne suis plus prioritaire aux prochaines intersections'], ['Je reste prioritaire jusqu’à la ville suivante']],
    ['B0', 'I', 'Circulation interdite à tout véhicule dans les deux sens', 'ville', ['Aucun véhicule ne peut entrer'], ['Seuls les camions sont interdits']],
    ['B1', 'I', 'Sens interdit à tout véhicule', 'ville', ['Je ne peux pas m’engager dans cette voie'], ['Je peux m’y engager en marche arrière', 'Je peux m’y engager pour me garer rapidement']],
    ['B2a', 'I', 'Interdiction de tourner à gauche à la prochaine intersection', 'ville', ['Je ne tourne pas à gauche au prochain carrefour'], ['Je peux faire demi-tour à gauche au prochain carrefour']],
    ['B2b', 'I', 'Interdiction de tourner à droite à la prochaine intersection', 'ville', ['Je ne tourne pas à droite au prochain carrefour'], ['Je dois tourner à droite']],
    ['B2c', 'I', 'Interdiction de faire demi-tour jusqu’à la prochaine intersection incluse', 'campagne', ['Je ne fais pas demi-tour'], ['Je ne peux pas tourner à gauche']],
    ['B3', 'I', 'Interdiction de dépasser tous les véhicules à moteur, sauf les deux-roues sans side-car', 'campagne', ['Je peux dépasser une moto', 'Je ne peux pas dépasser une voiture'], ['Je peux dépasser un camion lent', 'Je ne peux dépasser aucun véhicule, même un vélo']],
    ['B6a1', 'I', 'Stationnement interdit', 'ville', ['Je peux m’arrêter pour faire descendre un passager'], ['Je ne peux pas m’arrêter du tout', 'Je peux stationner moins de 10 minutes']],
    ['B6d', 'I', 'Arrêt et stationnement interdits', 'ville', ['Je ne peux pas m’arrêter, même pour déposer un passager', 'Je ne peux pas stationner'], ['Je peux m’arrêter quelques minutes en restant au volant', 'Il est interdit de circuler']],
    ['B12', 'I', 'Accès interdit aux véhicules de plus de 3,5 m de haut, chargement compris', 'campagne', ['Je vérifie la hauteur de mon véhicule chargé'], ['Les véhicules de plus de 3,5 t sont interdits']],
    ['B14:30', 'I', 'Vitesse limitée à 30 km/h', 'ville', ['Je ne dépasse pas 30 km/h'], ['Je dois rouler à 30 km/h au minimum']],
    ['B14:50', 'I', 'Vitesse limitée à 50 km/h', 'campagne', ['Je ne dépasse pas 50 km/h'], ['Je dois rouler à 50 km/h au minimum']],
    ['B14:70', 'I', 'Vitesse limitée à 70 km/h', 'campagne', ['Je ne dépasse pas 70 km/h'], ['Je peux rouler à 80 km/h si la route est sèche']],
    ['B14:90', 'I', 'Vitesse limitée à 90 km/h', 'campagne', ['Je ne dépasse pas 90 km/h'], ['Je dois rouler à 90 km/h au minimum']],
    ['B21_1', 'O', 'Obligation de tourner à droite', 'ville', ['Je tourne à droite'], ['Je peux aller tout droit']],
    ['B21_2', 'O', 'Obligation de tourner à gauche', 'ville', ['Je tourne à gauche'], ['Je peux tourner à droite']],
    ['B21a1', 'O', 'Contournement obligatoire par la droite', 'ville', ['Je passe à droite de l’obstacle'], ['Je peux passer de chaque côté']],
    ['B22a', 'O', 'Piste ou bande obligatoire pour les cycles', 'ville', ['Les cyclistes doivent l’emprunter'], ['Les voitures peuvent y stationner']],
    ['B25:30', 'O', 'Vitesse minimale obligatoire de 30 km/h', 'autoroute', ['Je roule à au moins 30 km/h, sauf si les conditions l’empêchent'], ['Je ne dépasse pas 30 km/h']],
    ['B31', 'F', 'Fin de toutes les interdictions signalées pour les véhicules en mouvement', 'campagne', ['Les interdictions signalées avant prennent fin'], ['La vitesse devient libre']],
    ['B33:70', 'F', 'Fin de la limitation à 70 km/h', 'campagne', ['La limitation à 70 km/h prend fin'], ['Je peux rouler aussi vite que je veux']],
    ['C1a', 'C', 'Parking', 'ville', ['Un lieu aménagé pour le stationnement'], ['Le stationnement est payant partout dans la rue']],
    ['C12', 'C', 'Circulation à sens unique', 'ville', ['Tous les véhicules circulent dans le même sens'], ['Je dois tourner à la prochaine intersection']],
    ['C13a', 'C', 'Impasse', 'ville', ['La route n’a pas d’issue'], ['La route est réservée aux riverains']],
    ['C20a', 'C', 'Passage pour piétons', 'ville', ['Le passage pour piétons est ici'], ['Les piétons sont interdits']],
    ['C107', 'C', 'Route pour automobiles', 'campagne', ['Les piétons, les cycles et les tracteurs y sont interdits'], ['La vitesse y est toujours de 130 km/h']],
    ['C108', 'C', 'Fin de route pour automobiles', 'campagne', ['Les règles de la route pour automobiles prennent fin'], ['L’autoroute commence']],
    ['C207', 'C', 'Début de section d’autoroute', 'autoroute', ['Les piétons et les cyclistes y sont interdits', 'Par temps sec, la vitesse est limitée à 130 km/h, sauf panneau'], ['Je peux faire demi-tour par le terre-plein central']],
    ['C208', 'C', 'Fin de section d’autoroute', 'autoroute', ['Les règles de l’autoroute prennent fin'], ['Je reste limité à 130 km/h']],
    ['EB10', 'C', 'Entrée d’agglomération', 'campagne', ['La vitesse est limitée à 50 km/h, sauf autre panneau', 'J’utilise l’avertisseur sonore seulement en cas de danger immédiat'], ['Je peux rouler à 70 km/h']],
    ['EB20', 'C', 'Sortie d’agglomération', 'campagne', ['La limitation à 50 km/h prend fin'], ['Je reste limité à 50 km/h']],
    ['B30', 'C', 'Entrée d’une zone 30', 'ville', ['Je ne dépasse pas 30 km/h dans toute la zone'], ['La limite ne vaut que jusqu’au prochain carrefour']],
    ['B52', 'C', 'Entrée d’une zone de rencontre', 'ville', ['Les piétons sont prioritaires et peuvent marcher sur la chaussée', 'Vitesse limitée à 20 km/h'], ['Les piétons doivent rester sur le trottoir']],
  ];
  const fam = (f) => SG.filter((s) => s[1] === f || (f === 'P' && s[1] === 'D') || (f === 'F' && s[1] === 'I'));
  SG.forEach((s, i) => {
    const [code, f, sens, env, vrai, faux] = s;
    const seed = hash(code);
    const th = f === 'D' ? 'R' : 'L';
    const near = fam(f).map((x) => x[2]).filter((x) => x !== sens);
    const others = near.length >= 3 ? near : near.concat(SG.map((x) => x[2]).filter((x) => x !== sens && !near.includes(x)));
    const sc = { drv: { env, s: [code], speed: env === 'autoroute' ? 110 : env === 'ville' ? 30 : 70, line: env === 'ville' ? 'none' : 'disc' } };
    let p = place([sens], pick(others, seed, 3), seed);
    add('s:' + code, th, sc, 'Ce panneau signifie :', p.o, p.ok, `${sens}.`);
    if (vrai.length) {
      const good = vrai.slice(0, 2), bad = faux.slice(0, 4 - good.length);
      while (good.length + bad.length < 4) bad.push(pick(['Je klaxonne pour signaler ma présence', 'Je m’arrête obligatoirement', 'Je fais demi-tour', 'Je peux stationner sur la chaussée'], seed + bad.length, 1, bad)[0]);
      p = place(good, bad, seed + 1);
      add('s2:' + code, th, { sign: code }, 'Je vois ce panneau. Quelles affirmations sont justes ?', p.o, p.ok, `Ce panneau signifie : ${sens.toLowerCase()}. ${good.join('. ')}.`);
    }
  });

  /* ---- 2b. Priorités aux intersections (vue du dessus) ---- */
  const REG = {
    pd: { lab: 'Aucun panneau', sig: {} },
    pdAB1: { lab: 'Panneau de priorité à droite', sig: { S: 'AB1', N: 'AB1', W: 'AB1', E: 'AB1' } },
    ced: { lab: 'Cédez le passage', sig: { S: 'AB3a', N: 'AB3a' }, main: 'EW' },
    stop: { lab: 'Stop', sig: { S: 'AB4', N: 'AB4' }, main: 'EW' },
    ab2: { lab: 'Intersection prioritaire', sig: { S: 'AB2', N: 'AB2', W: 'AB3a', E: 'AB3a' } },
    ab6: { lab: 'Route prioritaire', sig: { S: 'AB6', N: 'AB6', W: 'AB4', E: 'AB4' } },
    fv: { lab: 'Feu vert', sig: { S: 'V', N: 'V', W: 'R', E: 'R' } },
  };
  const COLS = [['rouge', '#D52B1E'], ['verte', '#16A34A'], ['jaune', '#EAB308'], ['blanche', '#F1F5F9'], ['orange', '#F97316'], ['grise', '#6B7280']];
  const GO = { droit: 'tout droit', gauche: 'à gauche', droite: 'à droite' };
  const SIDE = { W: 'de gauche', E: 'de droite', N: 'd’en face' };
  let pn = 0;
  for (const r of Object.keys(REG)) for (const go of ['droit', 'gauche', 'droite']) for (let m = 0; m < 8; m++) {
    const at = ['W', 'E', 'N'].filter((_, i) => m & (1 << i));
    const minor = r === 'ced' || r === 'stop';
    if (go === 'droite' && (minor || r.startsWith('pd'))) continue;  /* cas ambigus à l'examen : écartés */
    if (r.startsWith('pd') && at.length === 3) continue;              /* blocage circulaire : écarté */
    if (r.startsWith('pd') && go === 'gauche' && at.includes('N') && at.includes('W')) continue; /* idem : chacun attend l'autre */
    const seed = pn++;
    const cars = at.map((a, k) => { const c = COLS[(seed + k * 2) % COLS.length]; return { at: a, col: c[1], name: c[0] }; });
    const yields = cars.filter((c) => (c.at === 'E' && (r.startsWith('pd') || minor)) || (c.at === 'W' && minor) || (c.at === 'N' && go === 'gauche'));
    const stop = r === 'stop';
    const why = [];
    if (r.startsWith('pd')) why.push('La priorité à droite s’applique : je laisse passer qui vient de ma droite, et ceux de gauche me laissent passer.');
    if (minor) why.push(stop ? 'Au stop, je marque l’arrêt puis je laisse passer les véhicules de la route que je coupe.' : 'Au cédez-le-passage, je laisse passer les véhicules de la route que je coupe.');
    if (r === 'ab2' || r === 'ab6') why.push('Je suis sur la route prioritaire : les véhicules de gauche et de droite doivent me céder le passage.');
    if (r === 'fv') why.push('Mon feu est vert, celui des voies de gauche et de droite est rouge.');
    if (go === 'gauche' && at.includes('N')) why.push('En tournant à gauche, je coupe la trajectoire du véhicule d’en face qui va tout droit : je le laisse passer.');
    let q, o, ok;
    if (!cars.length) {
      q = `Je vais ${GO[go]}. Aucun autre véhicule n’arrive. Je :`;
      const good = [], bad = [];
      (stop ? good : bad).push('marque un arrêt complet à la ligne');
      (stop ? bad : good).push('peux passer sans m’arrêter');
      good.push('regarde à gauche et à droite avant de m’engager');
      bad.push('klaxonne pour annoncer mon passage');
      ({ o, ok } = place(good, bad, seed));
    } else {
      q = `Je vais ${GO[go]}. Les autres véhicules vont tout droit. Je laisse passer :`;
      const ops = cars.map((c) => [`la voiture ${c.name} (${SIDE[c.at]})`, yields.includes(c)]);
      if (ops.length < 4) ops.push(['personne, je passe en premier', yields.length === 0]);
      if (ops.length < 4) ops.push(['personne, mais je dois d’abord marquer l’arrêt', stop && yields.length === 0]);
      if (ops.length < 4) ops.push(['tous les véhicules, par politesse', false]);
      const rot = seed % ops.length; const ro = ops.slice(rot).concat(ops.slice(0, rot));
      o = ro.map((x) => x[0]); ok = ro.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0);
      if (stop && yields.length === 0) why.push('Personne n’est à laisser passer, mais l’arrêt au stop reste obligatoire.');
    }
    if (!ok.length) continue;
    add(`p:${r}:${go}:${m}`, 'L', { top: { sig: REG[r].sig, main: REG[r].main, cars, go } }, q, o, ok, why.join(' '));
  }

  /* ---- 2c. Vitesses maximales ---- */
  const ROADS = {
    agglo: ['en agglomération', { env: 'ville', line: 'disc' }, [50, 50, 50, 50]],
    route: ['sur une route à double sens sans séparateur central, hors agglomération', { env: 'campagne', line: 'disc' }, [80, 80, 80, 80]],
    voie: ['sur une route à deux chaussées séparées par un terre-plein central', { env: 'voie-rapide', line: 'disc', s: ['C107'] }, [110, 100, 100, 100]],
    auto: ['sur autoroute', { env: 'autoroute', line: 'disc', s: ['C207'] }, [130, 110, 110, 110]],
  };
  /* [sec confirmé, pluie confirmé, sec probatoire, pluie probatoire] ; brouillard < 50 m : 50 partout */
  const SPEEDS = [30, 50, 70, 80, 90, 100, 110, 120, 130];
  for (const rk of Object.keys(ROADS)) for (const w of ['sec', 'pluie', 'brouillard']) for (const pr of [0, 1]) {
    const [lab, d, v] = ROADS[rk];
    const lim = w === 'brouillard' ? 50 : v[(w === 'pluie' ? 1 : 0) + pr * 2];
    const seed = hash(rk + w + pr);
    const bad = pick(SPEEDS.filter((s) => s !== lim && Math.abs(s - lim) <= 60), seed, 3);
    const { o, ok } = place([lim + ' km/h'], bad.map((s) => s + ' km/h'), seed);
    const cond = w === 'sec' ? 'Par temps sec' : w === 'pluie' ? 'Il pleut' : 'Le brouillard limite la visibilité à moins de 50 m';
    const who = pr ? 'Je suis en permis probatoire' : 'J’ai mon permis depuis plus de 3 ans';
    const ex = w === 'brouillard' ? 'Quand la visibilité est inférieure à 50 m, la vitesse est limitée à 50 km/h sur toutes les routes.'
      : `${lab[0].toUpperCase() + lab.slice(1)} : ${v[0]} km/h par temps sec, ${v[1]} km/h par temps de pluie. En permis probatoire : ${v[2]} km/h, et la pluie ne l’abaisse pas davantage.`;
    add(`v:${rk}:${w}:${pr}`, 'L', { drv: { ...d, w, speed: Math.min(lim, 50 + (seed % 3) * 10) } }, `${who}. ${cond}, je circule ${lab}, sans panneau de limitation. Ma vitesse maximale est de :`, o, ok, ex + (rk === 'route' ? ' Le département peut relever cette limite à 90 km/h sur certaines routes, avec des panneaux.' : ''));
  }

  /* ---- 2d. Distances ---- */
  for (let V = 30; V <= 130; V += 10) {
    const d = V / 10, seed = V;
    const env = V <= 50 ? 'ville' : V <= 90 ? 'campagne' : 'autoroute';
    const sc = { drv: { env, veh: 'voiture', vehS: .4, speed: V, line: 'disc' } };
    const fmt = (x) => Math.round(x) + ' m';
    const mk = (key, q, good, cands, ex, w) => {
      const bad = [...new Set(cands.map(Math.round))].filter((x) => x !== Math.round(good) && x > 0).slice(0, 3);
      if (bad.length < 3) return;
      const { o, ok } = place([fmt(good)], bad.map(fmt), seed + key.length);
      add(`d:${key}:${V}`, 'C', w ? { drv: { ...sc.drv, w } } : sc, q, o, ok, ex);
    };
    mk('reac', `Je roule à ${V} km/h. Pendant mon temps de réaction d’une seconde, je parcours environ :`, d * 3, [d, d * d, d * 6, d * 10, d * 2, d * 5], `Distance parcourue en une seconde ≈ chiffre des dizaines × 3, soit ${d} × 3 = ${d * 3} m.`);
    mk('arret', `Je roule à ${V} km/h sur route sèche. Ma distance d’arrêt est d’environ :`, d * d, [d * 3, d * d * 2, d * 6, d * d / 2, d * 10], `Sur route sèche, distance d’arrêt ≈ dizaines au carré, soit ${d} × ${d} = ${d * d} m. Elle comprend la distance parcourue pendant le temps de réaction et la distance de freinage.`);
    mk('mouille', `Je roule à ${V} km/h sur route mouillée. Ma distance d’arrêt est d’environ :`, d * d * 1.5, [d * d, d * 3, d * d * 3, d * 6, d * d * 2], `Sur route mouillée, on ajoute environ la moitié : ${d * d} + ${d * d / 2} ≈ ${Math.round(d * d * 1.5)} m.`, 'pluie');
    mk('secu', `Je roule à ${V} km/h derrière un autre véhicule. La distance de sécurité minimale (2 secondes) est d’environ :`, d * 6, [d * 3, d * d, d * 10, d * 2, d * 12], `Deux secondes ≈ dizaines × 6, soit ${d} × 6 = ${d * 6} m. Sur autoroute, cela correspond à deux traits de la bande d’arrêt d’urgence.`);
  }

  /* ---- 2e. Dépassements ---- */
  const LINES = { disc: 'une ligne discontinue', cont: 'une ligne continue', 'mixte-disc': 'une ligne mixte, pointillés de mon côté', 'mixte-cont': 'une ligne mixte, trait continu de mon côté' };
  const VEH = { voiture: 'une voiture lente', camion: 'un camion lent', velo: 'un cycliste' };
  for (const ln of Object.keys(LINES)) for (const vh of Object.keys(VEH)) for (const b3 of [0, 1]) for (const opp of [0, 1]) {
    const lineOk = ln === 'disc' || ln === 'mixte-disc';
    const ok2 = !opp && (vh === 'velo' ? true : !b3 && lineOk);
    const seed = hash(ln + vh + b3 + opp);
    const good = [], bad = [];
    (ok2 ? good : bad).push('Je peux dépasser');
    (ok2 ? bad : good).push('Je reste derrière');
    if (vh === 'velo') good.push('Si je le dépasse, je laisse au moins 1,50 m d’écart'); else bad.push('Je peux le dépasser par la droite');
    (ok2 ? good : bad).push('Je vérifie rétroviseurs et angle mort avant de déboîter');
    const { o, ok } = place(good, bad, seed);
    const why = [];
    if (opp) why.push('Un véhicule arrive en face : la place manque, le dépassement est impossible.');
    if (vh === 'velo') why.push('On peut chevaucher une ligne continue pour dépasser un cycliste quand la visibilité est suffisante. Le panneau d’interdiction de dépasser ne concerne pas les deux-roues.');
    else { if (!lineOk) why.push('La ligne continue de mon côté ne doit pas être franchie.'); if (b3) why.push('Le panneau interdit de dépasser les véhicules à moteur autres que les deux-roues.'); }
    if (ok2) why.push('Je contrôle mes rétroviseurs et mon angle mort, je signale mon intention, puis je dépasse.');
    add(`x:${ln}:${vh}:${b3}:${opp}`, 'U', { drv: { env: 'campagne', line: ln, veh: vh, vehS: .46, s: b3 ? ['B3'] : null, opp: opp ? 'voiture' : null, oppS: .22, speed: vh === 'velo' ? 30 : 60 } }, `Hors agglomération, devant moi roule ${VEH[vh]}. Au sol, ${LINES[ln]}${b3 ? ', et ce panneau est en place' : ''}. Que puis-je faire ?`, o, ok, why.join(' '));
  }

  /* ---- 2f. Voyants ---- */
  const VY = [
    ['croisement', 'Feux de croisement allumés'], ['route', 'Feux de route allumés'], ['position', 'Feux de position allumés'],
    ['brouillardAV', 'Feux de brouillard avant allumés'], ['brouillardAR', 'Feu de brouillard arrière allumé'],
    ['huile', 'Pression d’huile insuffisante', 1], ['batterie', 'Défaut de charge de la batterie', 1], ['temperature', 'Liquide de refroidissement trop chaud', 1],
    ['frein', 'Frein de stationnement serré ou niveau de liquide de frein bas', 1], ['abs', 'Défaut du système ABS'], ['ceinture', 'Ceinture de sécurité non bouclée', 1],
    ['carburant', 'Réserve de carburant atteinte'], ['moteur', 'Défaut du moteur ou de la dépollution'], ['pneu', 'Pression des pneus insuffisante'], ['airbag', 'Défaut de l’airbag', 1],
  ];
  VY.forEach(([k, m, red], i) => {
    const others = pick(VY.map((x) => x[1]).filter((x) => x !== m), i * 5 + 1, 3);
    const { o, ok } = place([m], others, i);
    const col = window.SCENE ? window.SCENE.VOY[k][0] : '';
    const sens = { G: 'Vert : une fonction est en marche.', B: 'Bleu : les feux de route sont allumés.', O: 'Orange : une anomalie à faire vérifier rapidement.', R: 'Rouge : un danger, il faut s’arrêter dès que possible.' }[col] || '';
    add('y:' + k, 'M', { dash: [k] }, 'Ce voyant s’allume au tableau de bord. Il indique :', o, ok, `${m}. ${sens}`);
    if (red && k !== 'ceinture') {
      const p = place(['m’arrête dès que possible en sécurité', 'fais vérifier le véhicule avant de repartir'], ['continue jusqu’à destination', 'accélère pour arriver plus vite au garage'], i);
      add('y2:' + k, 'M', { dash: [k] }, 'Ce voyant rouge s’allume en roulant. Je :', p.o, p.ok, `${m}. Un voyant rouge signale un danger : on s’arrête dès que possible en sécurité.`);
    }
  });

  /* ---- 2g. Feux à utiliser selon la situation ---- */
  const FX = [
    ['de jour, par beau temps, sur route', { env: 'campagne' }, [], 'Aucun feu n’est obligatoire de jour par bonne visibilité, même si les feux de croisement sont conseillés.'],
    ['la nuit, sur une route non éclairée, sans personne devant ni en face', { env: 'campagne', w: 'nuit' }, ['route'], 'Sans personne à éblouir, les feux de route éclairent le plus loin.'],
    ['la nuit, en croisant un autre véhicule', { env: 'campagne', w: 'nuit', opp: 'voiture' }, ['croisement'], 'On passe en feux de croisement pour ne pas éblouir.'],
    ['par brouillard épais', { env: 'campagne', w: 'brouillard' }, ['croisement', 'brouillardAV', 'brouillardAR'], 'Par brouillard : feux de croisement, feux de brouillard avant et feu de brouillard arrière.'],
    ['par forte pluie, de jour', { env: 'campagne', w: 'pluie' }, ['croisement', 'brouillardAV'], 'Par forte pluie : feux de croisement, feux de brouillard avant permis, mais pas le feu de brouillard arrière.'],
    ['par chute de neige', { env: 'campagne', w: 'neige' }, ['croisement', 'brouillardAV', 'brouillardAR'], 'Par chute de neige, les feux de brouillard avant et arrière sont permis.'],
  ];
  const FXL = { croisement: 'les feux de croisement', route: 'les feux de route', brouillardAV: 'les feux de brouillard avant', brouillardAR: 'le feu de brouillard arrière' };
  FX.forEach(([lab, d, on, ex], i) => {
    const ks = Object.keys(FXL);
    const opts = ks.map((k) => [FXL[k], on.includes(k)]);
    if (!on.length) { opts[1] = ['aucun feu n’est obligatoire', true]; }
    const r = i % 4; const ro = opts.slice(r).concat(opts.slice(0, r));
    add('f:' + i, 'L', { drv: { ...d, speed: 70, line: 'disc' } }, `Je roule ${lab}. J’utilise :`, ro.map((x) => x[0]), ro.map((x, j) => (x[1] ? j : -1)).filter((j) => j >= 0), ex);
  });

  window.BANQUE = { THEMES, Q: B };
})();
