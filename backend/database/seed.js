require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const mysql  = require("mysql2/promise");

const conn_cfg = {
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "supplylink",
  multipleStatements: true,
};

const HASH = (p) => bcrypt.hashSync(p, 10);

// ── Fournisseurs ──────────────────────────────────────────────────────────────
const FOURNISSEURS = [
  { prenom:"Karim",   nom:"Mansouri",  email:"karim@meubleximo.ma",    telephone:"0661234567", ville:"Casablanca", boutique:"MeublEximo",    desc:"Spécialiste mobilier salon & chambre." },
  { prenom:"Fatima",  nom:"Benali",    email:"fatima@decoatlas.ma",     telephone:"0662345678", ville:"Marrakech",  boutique:"DécoAtlas",     desc:"Décoration artisanale & moderne." },
  { prenom:"Youssef", nom:"El Fassi",  email:"youssef@electroplus.ma",  telephone:"0663456789", ville:"Rabat",      boutique:"ElectroPlus",   desc:"Électroménager grandes marques." },
  { prenom:"Samira",  nom:"Bouzidi",   email:"samira@literimaroc.ma",   telephone:"0664567890", ville:"Fès",        boutique:"LitériaMaroc",  desc:"Matelas & literie haut de gamme." },
  { prenom:"Hassan",  nom:"Chraibi",   email:"hassan@cuisinepro.ma",    telephone:"0665678901", ville:"Tanger",     boutique:"CuisinePro",    desc:"Équipements cuisine professionnels." },
];

// ── Articles ──────────────────────────────────────────────────────────────────
// Images: Unsplash (publiques, pas de clé nécessaire pour l'affichage)
const ARTICLES = [
  // MeublEximo (idx 0)
  { f:0, nom:"Canapé 3 places Milano",       desc:"Canapé en tissu velours gris anthracite, pieds chromés. Très confortable pour le salon.",        prix:3499, prix_barre:3999, stock:12, cat:"Mobilier",       img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", note:4.7, avis:38, promo:true  },
  { f:0, nom:"Table basse ovale Chêne",       desc:"Table basse en bois de chêne massif, design scandinave épuré.",                                  prix:899,  prix_barre:1100, stock:20, cat:"Mobilier",       img:"https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&q=80", note:4.5, avis:22, promo:false },
  { f:0, nom:"Armoire 3 portes coulissantes", desc:"Armoire moderne avec miroir intégré, grande capacité de rangement.",                              prix:2799, prix_barre:null, stock:8,  cat:"Mobilier",       img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", note:4.3, avis:15, promo:false },
  { f:0, nom:"Lit double 160cm avec tête",    desc:"Structure de lit en bois massif, tête de lit rembourrée, 160x200 cm.",                           prix:2299, prix_barre:2699, stock:6,  cat:"Mobilier",       img:"https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80", note:4.8, avis:51, promo:true  },
  { f:0, nom:"Bureau angle bois blanc",       desc:"Bureau d'angle spacieux avec rangements intégrés, idéal télétravail.",                            prix:1299, prix_barre:1499, stock:14, cat:"Mobilier",       img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", note:4.2, avis:9,  promo:false },
  { f:0, nom:"Chaise salle à manger velours", desc:"Chaise moderne en velours bleu, pieds or, lot de 4 disponible.",                                  prix:699,  prix_barre:899,  stock:30, cat:"Mobilier",       img:"https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&q=80", note:4.6, avis:27, promo:false },

  // DécoAtlas (idx 1)
  { f:1, nom:"Miroir rond laiton doré 80cm",  desc:"Miroir décoratif en laiton doré brossé, parfait pour entrée ou salon.",                          prix:649,  prix_barre:799,  stock:25, cat:"Décoration",     img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", note:4.9, avis:63, promo:true  },
  { f:1, nom:"Lampe de sol trépied noir",     desc:"Lampe de salon au design industriel, bras orientable, ampoule E27 incluse.",                      prix:449,  prix_barre:null, stock:18, cat:"Décoration",     img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", note:4.4, avis:31, promo:false },
  { f:1, nom:"Vase céramique artisanal",      desc:"Vase fait main en céramique marocaine, motifs géométriques berbères.",                            prix:189,  prix_barre:240,  stock:40, cat:"Décoration",     img:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80", note:4.7, avis:44, promo:false },
  { f:1, nom:"Tapis berbère 200x300cm",       desc:"Tapis artisanal tissé à la main, laine naturelle, motifs géométriques.",                         prix:1599, prix_barre:1999, stock:10, cat:"Décoration",     img:"https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600&q=80", note:4.8, avis:57, promo:true  },
  { f:1, nom:"Cadre photo bois flotté set 3", desc:"Ensemble de 3 cadres en bois flotté naturel, format A4, A5 et A6.",                               prix:249,  prix_barre:299,  stock:35, cat:"Décoration",     img:"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80", note:4.3, avis:18, promo:false },
  { f:1, nom:"Coussin déco zellige bleu",     desc:"Coussin brodé à la main, motifs zellige bleu de Fès, 45x45 cm.",                                 prix:129,  prix_barre:160,  stock:60, cat:"Décoration",     img:"https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80", note:4.6, avis:29, promo:false },

  // ElectroPlus (idx 2)
  { f:2, nom:"Réfrigérateur Samsung 300L",    desc:"Réfrigérateur NoFrost, classe A++, distributeur d'eau, garantie 2 ans.",                         prix:5999, prix_barre:6999, stock:7,  cat:"Électroménager", img:"https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80", note:4.5, avis:23, promo:true  },
  { f:2, nom:"Machine à laver 8kg LG",        desc:"Lave-linge frontal 1200 tr/min, 15 programmes, Wi-Fi intégré.",                                  prix:4299, prix_barre:4999, stock:9,  cat:"Électroménager", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", note:4.6, avis:35, promo:false },
  { f:2, nom:"Climatiseur Haier 12000 BTU",   desc:"Climatiseur réversible inverter, A+++, installation comprise sur Casablanca.",                    prix:3799, prix_barre:null, stock:11, cat:"Électroménager", img:"https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=80", note:4.4, avis:19, promo:false },
  { f:2, nom:"Micro-ondes Bosch 25L",         desc:"Four micro-ondes grill, 900W, plateau tournant, affichage digital.",                             prix:899,  prix_barre:1099, stock:22, cat:"Électroménager", img:"https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80", note:4.3, avis:12, promo:false },
  { f:2, nom:"Aspirateur robot Xiaomi",       desc:"Robot aspirateur et laveur de sol, cartographie laser, compatible Alexa.",                        prix:2199, prix_barre:2599, stock:15, cat:"Électroménager", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", note:4.7, avis:48, promo:true  },

  // LitériaMaroc (idx 3)
  { f:3, nom:"Matelas mémoire de forme 160",  desc:"Matelas haute densité 25cm, mémoire de forme, 7 zones de confort, 160x200cm.",                   prix:2499, prix_barre:2999, stock:8,  cat:"Literie",        img:"https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80", note:4.8, avis:72, promo:true  },
  { f:3, nom:"Parure de lit satin 260x240",   desc:"Housse de couette + 4 taies, satin de coton égyptien 400 fils, lavable 60°.",                    prix:599,  prix_barre:749,  stock:30, cat:"Literie",        img:"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80", note:4.6, avis:41, promo:false },
  { f:3, nom:"Oreiller ergonomique cervical",  desc:"Oreiller à mémoire de forme avec support cervical adaptatif, housse amovible.",                   prix:349,  prix_barre:429,  stock:45, cat:"Literie",        img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", note:4.5, avis:33, promo:false },
  { f:3, nom:"Couette hiver 400g/m² 220x240", desc:"Couette thermique hiver, garnissage microfibre hypoallergénique, douceur maximale.",              prix:449,  prix_barre:null, stock:20, cat:"Literie",        img:"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80", note:4.4, avis:26, promo:false },

  // CuisinePro (idx 4)
  { f:4, nom:"Robot pâtissier KitchenAid 5L", desc:"Robot multifonction 5L, 10 vitesses, accessoires inox inclus, coloris rouge.",                   prix:4999, prix_barre:5499, stock:5,  cat:"Cuisine",        img:"https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&q=80", note:4.9, avis:84, promo:true  },
  { f:4, nom:"Blender Vitamix Pro 750",        desc:"Blender professionnel 2200W, 64oz, 5 programmes, silence technologie.",                          prix:3299, prix_barre:null, stock:8,  cat:"Cuisine",        img:"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80", note:4.7, avis:52, promo:false },
  { f:4, nom:"Poêle céramique 28cm Tefal",    desc:"Poêle anti-adhésive céramique Thermo-Signal, compatible induction, garantie 5 ans.",              prix:299,  prix_barre:399,  stock:50, cat:"Cuisine",        img:"https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80", note:4.6, avis:67, promo:false },
  { f:4, nom:"Couteaux japonais set 5 pièces", desc:"Set de couteaux en acier inoxydable japonais, manche ergonomique, avec bloc bois.",              prix:799,  prix_barre:999,  stock:15, cat:"Cuisine",        img:"https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80", note:4.8, avis:39, promo:false },
  { f:4, nom:"Machine à café Delonghi",        desc:"Machine espresso automatique, broyeur intégré, réservoir 1.8L, chauffe rapide.",                 prix:2799, prix_barre:3299, stock:10, cat:"Cuisine",        img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", note:4.7, avis:61, promo:true  },
];

async function seed() {
  const db = await mysql.createConnection(conn_cfg);
  console.log("✔  Connecté à MySQL");

  // Vider les tables (ordre FK)
  await db.query(`
    SET FOREIGN_KEY_CHECKS=0;
    TRUNCATE TABLE promotions;
    TRUNCATE TABLE avis;
    TRUNCATE TABLE commande_items;
    TRUNCATE TABLE commandes;
    TRUNCATE TABLE litiges;
    TRUNCATE TABLE articles;
    TRUNCATE TABLE boutiques;
    TRUNCATE TABLE user_roles;
    TRUNCATE TABLE users;
    SET FOREIGN_KEY_CHECKS=1;
  `);
  console.log("✔  Tables vidées");

  // Admin
  const [adminR] = await db.query(
    `INSERT INTO users (prenom,nom,email,telephone,password_hash,ville,statut) VALUES (?,?,?,?,?,?,?)`,
    ["Admin","SupplyLink","admin@supplylink.ma","0600000000",HASH("Admin@2026!"),"Casablanca","actif"]
  );
  await db.query("INSERT INTO user_roles (user_id,role) VALUES (?,?)", [adminR.insertId, "admin"]);

  // Client test
  const [clientR] = await db.query(
    `INSERT INTO users (prenom,nom,email,telephone,password_hash,ville,quartier,rue,statut) VALUES (?,?,?,?,?,?,?,?,?)`,
    ["Hamza","Berrada","hamza@client.ma","0661111111",HASH("Client@2026!"),"Casablanca","Maarif","Rue Hassan II, 12","actif"]
  );
  await db.query("INSERT INTO user_roles (user_id,role) VALUES (?,?)", [clientR.insertId, "client"]);

  // Fournisseurs
  const fIds = [];
  for (const f of FOURNISSEURS) {
    const [r] = await db.query(
      `INSERT INTO users (prenom,nom,email,telephone,password_hash,ville,statut) VALUES (?,?,?,?,?,?,?)`,
      [f.prenom, f.nom, f.email, f.telephone, HASH("Fournisseur@2026!"), f.ville, "actif"]
    );
    await db.query("INSERT INTO user_roles (user_id,role) VALUES (?,?)", [r.insertId, "fournisseur"]);
    await db.query(
      "INSERT INTO boutiques (user_id,nom,description) VALUES (?,?,?)",
      [r.insertId, f.boutique, f.desc]
    );
    fIds.push(r.insertId);
    console.log(`  ✔ Fournisseur: ${f.boutique}`);
  }

  // Articles
  let promoArticles = [];
  for (const a of ARTICLES) {
    const [r] = await db.query(
      `INSERT INTO articles (fournisseur_id,nom,description,prix,prix_barre,stock,categorie,image,note_moy,nb_avis,is_promoted,statut)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,'actif')`,
      [fIds[a.f], a.nom, a.desc, a.prix, a.prix_barre || null, a.stock, a.cat, a.img, a.note, a.avis, a.promo ? 1 : 0]
    );
    if (a.promo) promoArticles.push({ id: r.insertId, fId: fIds[a.f] });
    process.stdout.write(".");
  }
  console.log(`\n✔  ${ARTICLES.length} articles créés`);

  // Promotions actives pour les articles sponsorisés
  const today = new Date();
  for (const p of promoArticles) {
    const fin = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    await db.query(
      `INSERT INTO promotions (fournisseur_id,article_id,pack,montant,date_debut,date_fin,statut)
       VALUES (?,?,'pro',349.00,?,?,'actif')`,
      [p.fId, p.id, today.toISOString().slice(0, 10), fin.toISOString().slice(0, 10)]
    );
  }
  console.log(`✔  ${promoArticles.length} promotions actives`);

  await db.end();
  console.log("\n🎉  Seed terminé !");
  console.log("   admin@supplylink.ma   / Admin@2026!");
  console.log("   hamza@client.ma       / Client@2026!");
  console.log("   karim@meubleximo.ma   / Fournisseur@2026!");
}

seed().catch((e) => { console.error("✘", e.message); process.exit(1); });
