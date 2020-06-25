-- FINISH THIS FILE

BEGIN;

TRUNCATE
  users,
  pages,
  bookmarks,
  bookmark_images
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, nickname, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, '$2a$12$gEG0lvFZXZAKqdHO8V.RBO0mvksPRcO30Zv/SOrC2eqnZRcTjf//G'),
  ('b.deboop', 'Bodeep Deboop', 'Bo', '$2a$12$cfW4kWMxpXfDVarjLHmcdeFFs8eDntcYTMP3uVGoEKLzccjF5eYEC'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie', '$2a$12$3VmyWQyzaBwy5sOahqTvk.UYMI9qiBaWvHQQbeXnKGGuf8VwkHwSG'),
  ('s.smith', 'Sam Smith', 'Sam', '$2a$12$qGxqaa9fyoMT2svGErZvj.UWRBHCqqldjfN7Zlz.aAVv8zOmaODde'),
  ('lexlor', 'Alex Taylor', 'Lex', '$2a$12$TnS/CttIXoFtjenvV1f9G.FlFvohVnAuf2RM0Mf.7wNf2b5M.LGIy'),
  ('wippy', 'Ping Won In', 'Ping', '$2a$12$o7nfMDlN0GYyqN1qqFRSYOierTYNSFxNnoUy4CSvPCmdTExtx0bHS');

INSERT INTO pages (title, image, user_id, content)
VALUES
  ('Hand-Painted Rubber Ducky', 'https://loremflickr.com/750/300/landscape?random=1', 1, 'This ducky has been hand-painted and is now art. Therefore it is useless and cannot be put in water.'),
  ('Cloning Machine', 'https://loremflickr.com/750/300/landscape?random=2', 2, '100% guaranteed to occasionally work every time! Requires a 167.23v power outlet or a dragonscale battery (obtained separately by solving a riddle).'),
  ('Kangaroo Carrier', 'https://loremflickr.com/750/300/landscape?random=3', 3, 'This convenient item can assist you in bringing your kangaroo to your favorite grocery store, or as a conversation starter at a first date or funeral.'),
  ('Love Potion #26', 'https://loremflickr.com/750/300/landscape?random=4', 4, 'While not as well known as its predecessor, Love Potion #9, this formulation has been proven to be effective in winning the affections of some small amphibians.'),
  ('My Freeze Ray', 'https://loremflickr.com/750/300/landscape?random=5', 5, 'With this freeze ray, you can stop the world.'),
  ('Personal EMP Generator', 'https://loremflickr.com/750/300/landscape?random=6', 6, 'With its guaranteed 10m radius, this discreet device will disable an entire busload of iPhones with the push of a button. It is recommended to include an analog camera which can record the entertaining looks on the faces of those affected, as well as a riot shield in case of mass hysteria.'),
  ('Foolproof Instant Wealth Pamphlet', 'https://loremflickr.com/750/300/landscape?random=7', 1, 'Purchase this pamphlet for $100. Sell this pamphlet to a billion people for $100. Acquisition of this pamphlet is indeed proof of foolishness!'),
  ('Story Water Spigot', 'https://loremflickr.com/750/300/landscape?random=8', 2, 'Once installed by a qualified leprechaun, this spigot will produce a steady stream of stories which can be later be adapted to motion pictures which will not be quite as good as the originals.'),
  ('Ruby Red Slippers', 'https://loremflickr.com/750/300/landscape?random=9', 3, 'Get home quicker than either Uber or Lyft! Three taps of the heels is all it takes. One size fits all.'),
  ( 'Magic Lamp', 'https://loremflickr.com/750/300/landscape?random=10', 4, 'May or may not produce a genie.');

INSERT INTO bookmarks (title, image, user_id, content)
VALUES
  ('Hand-Painted Rubber Ducky', 'https://loremflickr.com/750/300/landscape?random=1', 1, 'This ducky has been hand-painted and is now art. Therefore it is useless and cannot be put in water.'),

INSERT INTO bookmark_images (title, image, user_id, content)
VALUES
  ('Hand-Painted Rubber Ducky', 'https://loremflickr.com/750/300/landscape?random=1', 1, 'This ducky has been hand-painted and is now art. Therefore it is useless and cannot be put in water.'),

COMMIT;
